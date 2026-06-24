"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children, requireComplete = false }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, isEmailVerified, isProfileComplete } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.replace("/login");
    else if (!isEmailVerified) router.replace("/verify-otp");
    else if (requireComplete && !isProfileComplete) router.replace("/complete-profile");
  }, [isLoading, isAuthenticated, isEmailVerified, isProfileComplete, requireComplete, router]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  if (!isAuthenticated || !isEmailVerified || (requireComplete && !isProfileComplete)) {
    return null;
  }

  return children;
}
