import { Suspense } from "react";
import type { Metadata } from "next";
import LoginScreen from "@/features/auth/screens/LoginScreen";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  // LoginScreen reads `?next=` via useSearchParams, which needs a Suspense
  // boundary during static rendering.
  return (
    <Suspense fallback={null}>
      <LoginScreen />
    </Suspense>
  );
}
