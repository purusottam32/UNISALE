"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/errors";
import Button from "@/components/ui/Button";
import { useAuth } from "../auth-context";
import AuthLayout from "../components/AuthLayout";
import OtpInput from "../components/OtpInput";

const RESEND_SECONDS = 45;

/** Deep link straight into the user's webmail, so they never leave to go hunting. */
const inboxUrl = (email) => {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  if (domain.includes("gmail") || domain.includes("googlemail")) return "https://mail.google.com";
  if (domain.includes("outlook") || domain.includes("hotmail")) return "https://outlook.live.com";
  return null;
};

export default function VerifyEmailScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resendOtp, pending } = useAuth();

  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!email) router.replace("/register");
  }, [email, router]);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = setInterval(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  /**
   * Submits as soon as the sixth digit lands. The guard stops the auto-submit
   * and a manual tap from firing the same code twice.
   */
  const submit = async (value) => {
    const otp = value || code;
    if (otp.length !== 6 || submittingRef.current) return;

    submittingRef.current = true;
    setError("");

    try {
      const result = await verifyOtp({ email, otp });
      toast.success("Email verified.");
      router.replace(result.user?.isProfileComplete ? "/feed" : "/onboarding");
    } catch (caught) {
      setError(getErrorMessage(caught, "That code didn't work."));
      setCode("");
    } finally {
      submittingRef.current = false;
    }
  };

  const resend = async () => {
    try {
      await resendOtp({ email });
      setSecondsLeft(RESEND_SECONDS);
      setCode("");
      setError("");
      toast.success("New code sent.");
    } catch (caught) {
      toast.error(getErrorMessage(caught, "Could not resend the code."));
    }
  };

  const mailUrl = inboxUrl(email);

  return (
    <AuthLayout
      title="Check your college inbox"
      subtitle={
        <>
          We sent a 6-digit code to <span className="font-semibold text-ink">{email}</span>. It
          expires in 10 minutes.
        </>
      }
      step={{ current: 2, total: 3, labels: ["Your details", "Verify email", "Campus profile"] }}
      footer={
        <button type="button" onClick={() => router.push("/register")} className="font-semibold text-brand">
          Use a different email
        </button>
      }
    >
      <div className="space-y-5">
        <OtpInput
          value={code}
          onChange={setCode}
          onComplete={submit}
          disabled={pending.verifyOtp}
          error={error}
        />

        <Button
          size="lg"
          block
          loading={pending.verifyOtp}
          disabled={code.length !== 6}
          onClick={() => submit()}
        >
          Verify and continue
        </Button>

        {mailUrl && (
          <a
            href={mailUrl}
            target="_blank"
            rel="noreferrer"
            className="block text-center text-sm font-semibold text-brand"
          >
            Open my inbox →
          </a>
        )}

        <div className="text-center text-sm text-muted">
          {secondsLeft > 0 ? (
            <>Didn&apos;t get it? Resend in {secondsLeft}s</>
          ) : (
            <button type="button" onClick={resend} className="font-semibold text-brand">
              Resend the code
            </button>
          )}
        </div>

        <p className="rounded-md bg-surface-2 p-3 text-center text-xs leading-relaxed text-muted">
          College mail servers can be slow. If nothing arrives in two minutes, check spam or
          promotions.
        </p>
      </div>
    </AuthLayout>
  );
}
