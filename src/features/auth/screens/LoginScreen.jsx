"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { applyFieldErrors, getErrorMessage } from "@/lib/errors";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { useAuth } from "../auth-context";
import AuthLayout from "../components/AuthLayout";
import GoogleButton, { AuthDivider } from "../components/GoogleButton";

export default function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isProfileComplete, pending } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  /** Where the user was headed before the guard sent them here. */
  const next = searchParams.get("next") || "/feed";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    if (isAuthenticated) router.replace(isProfileComplete ? next : "/onboarding");
  }, [isAuthenticated, isProfileComplete, next, router]);

  const onSubmit = async (values) => {
    try {
      const result = await login(values);
      toast.success(`Welcome back, ${result.user?.name?.split(" ")[0] || "student"}.`);
      router.replace(result.user?.isProfileComplete ? next : "/onboarding");
    } catch (error) {
      const status = error?.response?.status;

      // An unverified account is a resumable state, not a failure — send them
      // back to the code screen rather than making them start over.
      if (status === 403 && error?.response?.data?.needsVerification) {
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
        return;
      }
      if (!applyFieldErrors(error, setError)) {
        toast.error(getErrorMessage(error, "Could not sign you in."));
      }
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Pick up where you left off on your campus marketplace."
      footer={
        <>
          New to UniSale?{" "}
          <Link href="/register" className="font-semibold text-brand">
            Create a free account
          </Link>
        </>
      }
    >
      <GoogleButton label="Continue with Google" />
      <AuthDivider />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="College email"
          type="email"
          placeholder="you@college.ac.in"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register("email", { required: "Enter your email." })}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
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
          {...register("password", { required: "Enter your password." })}
        />

        <Button type="submit" size="lg" block loading={pending.login}>
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
}
