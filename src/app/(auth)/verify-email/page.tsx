import { Suspense } from "react";
import type { Metadata } from "next";
import VerifyEmailScreen from "@/features/auth/screens/VerifyEmailScreen";

export const metadata: Metadata = { title: "Verify your email" };

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailScreen />
    </Suspense>
  );
}
