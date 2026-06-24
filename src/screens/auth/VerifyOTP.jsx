"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FiArrowLeft, FiMail, FiRefreshCw } from "react-icons/fi";
import AuthVisual from "../../components/auth/AuthVisual";

const OTP_LENGTH = 6;

export default function VerifyOTP() {
  const { verifyOtp, resendOtp, verifyOtpPending } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const name = searchParams.get("name") || "";

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) router.replace("/register");
  }, [email, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const focusNext = (index) => {
    if (index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const focusPrev = (index) => {
    if (index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleDigitChange = (index, value) => {
    if (value.length > 1) {
      const pasteDigits = value.replace(/\D/g, "").slice(0, OTP_LENGTH);
      const newDigits = [...digits];
      for (let i = 0; i < pasteDigits.length; i++) {
        if (index + i < OTP_LENGTH) newDigits[index + i] = pasteDigits[i];
      }
      setDigits(newDigits);
      const nextFocus = Math.min(index + pasteDigits.length, OTP_LENGTH - 1);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    if (digit) focusNext(index);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index]) focusPrev(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length !== OTP_LENGTH) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      const result = await verifyOtp({ email, otp });
      toast.success("Email verified. Welcome to UniSale.");
      if (result?.user?.isProfileComplete) {
        router.push("/feed");
      } else {
        router.push("/complete-profile");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid OTP. Please try again.";
      toast.error(msg);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    try {
      await resendOtp({ email });
      toast.success("New OTP sent to your email.");
      setResendCooldown(60);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  const otp = digits.join("");

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div style={{ maxWidth: 400, width: "100%", margin: "0 auto" }}>
          <Link
            href="/register"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--color-text-secondary)", fontSize: 14, marginBottom: 40 }}
          >
            <FiArrowLeft /> Back to registration
          </Link>

          <div className="animate-fade-in">
            <div style={{
              width: 56, height: 56,
              background: "var(--color-primary-light)",
              borderRadius: "var(--radius-lg)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 24, fontSize: 24
            }}>
              <FiMail />
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
              Check your email
            </h1>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginBottom: 8 }}>
              We sent a 6-digit code to
            </p>
            <p style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: 15, marginBottom: 32 }}>
              {email}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="otp-group" style={{ marginBottom: 32 }}>
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    id={`otp-digit-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`otp-input ${digit ? "filled" : ""}`}
                    autoFocus={i === 0}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              <button
                id="verify-otp-submit"
                type="submit"
                className="btn btn-primary btn-lg btn-full"
                disabled={verifyOtpPending || otp.length !== OTP_LENGTH}
              >
                {verifyOtpPending ? (
                  <><div className="spinner" style={{ width: 18, height: 18 }} /> Verifying...</>
                ) : (
                  "Verify Email"
                )}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <p style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
                Didn&apos;t receive the code?
              </p>
              <button
                id="resend-otp-btn"
                onClick={handleResend}
                disabled={resendCooldown > 0 || resending}
                className="btn btn-ghost"
                style={{ marginTop: 8, fontSize: 14, color: resendCooldown > 0 ? "var(--color-text-muted)" : "var(--color-primary)", fontWeight: 600 }}
              >
                {resending ? (
                  <><FiRefreshCw style={{ animation: "spin 1s linear infinite" }} /> Sending...</>
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  "Resend OTP"
                )}
              </button>
            </div>

            <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--color-text-muted)" }}>
              The code expires in 10 minutes
            </p>
          </div>
        </div>
      </div>

      <AuthVisual
        tagline="Almost there - verify your campus email."
        stats={[
          { value: "10 min", label: "OTP validity" },
          { value: "6 digits", label: "Verification code" },
          { value: "Secure", label: "College-only access" },
        ]}
      />
    </div>
  );
}
