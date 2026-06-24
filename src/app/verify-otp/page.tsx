import { Suspense } from "react";
import VerifyOTP from "@/screens/auth/VerifyOTP";

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTP />
    </Suspense>
  );
}
