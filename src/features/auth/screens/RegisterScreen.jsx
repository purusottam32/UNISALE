"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { applyFieldErrors, getErrorMessage } from "@/lib/errors";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { CheckIcon, ShieldIcon } from "@/components/ui/icons";
import { useAuth } from "../auth-context";
import AuthLayout from "../components/AuthLayout";
import GoogleButton, { AuthDivider } from "../components/GoogleButton";

/** Institutional domains we recognise on sight, for instant inline feedback. */
const CAMPUS_PATTERN = /@[\w.-]*\.(ac\.in|edu|edu\.in)$/i;

export default function RegisterScreen() {
  const router = useRouter();
  const { register: signUp, pending } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const email = watch("email", "");
  const looksInstitutional = CAMPUS_PATTERN.test(email);

  const onSubmit = async (values) => {
    try {
      await signUp(values);
      toast.success("Check your inbox for a 6-digit code.");
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      if (!applyFieldErrors(error, setError)) {
        toast.error(getErrorMessage(error, "Could not create your account."));
      }
    }
  };

  return (
    <AuthLayout
      title="Create your campus account"
      subtitle="One minute to join. Free forever, no listing fees."
      step={{ current: 1, total: 3, labels: ["Your details", "Verify email", "Campus profile"] }}
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand">
            Log in
          </Link>
        </>
      }
    >
      <GoogleButton label="Sign up with Google" />
      <AuthDivider label="or use your college email" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Full name"
          placeholder="Riya Sharma"
          autoComplete="name"
          required
          error={errors.name?.message}
          {...register("name", {
            required: "Tell us your name.",
            minLength: { value: 2, message: "That looks too short." },
          })}
        />

        <div>
          <Input
            label="College email"
            type="email"
            placeholder="you@college.ac.in"
            autoComplete="email"
            required
            error={errors.email?.message}
            trailing={
              looksInstitutional ? (
                <span className="text-brand" title="Recognised college domain">
                  <CheckIcon size={16} />
                </span>
              ) : null
            }
            {...register("email", {
              required: "We need your college email.",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "That email doesn't look right." },
            })}
          />

          {/* Explaining the requirement where it is asked, not in a help page. */}
          <p className="mt-2 flex gap-2 rounded-md bg-surface-2 p-2.5 text-xs leading-relaxed text-muted">
            <span className="mt-0.5 shrink-0 text-brand">
              <ShieldIcon size={14} />
            </span>
            Your college email is how we keep UniSale students-only. We never show it to
            anyone — buyers reach you through in-app chat.
          </p>
        </div>

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="At least 6 characters"
          autoComplete="new-password"
          required
          error={errors.password?.message}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="text-xs font-semibold text-brand"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          }
          {...register("password", {
            required: "Choose a password.",
            minLength: { value: 6, message: "Use at least 6 characters." },
          })}
        />

        <Button type="submit" size="lg" block loading={pending.register}>
          Send verification code
        </Button>

        <p className="text-center text-xs leading-relaxed text-muted">
          By joining you agree to trade honestly and meet safely on campus.
        </p>
      </form>
    </AuthLayout>
  );
}
