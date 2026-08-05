"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../auth-context";

/**
 * Route protection for the authenticated shell.
 *
 * Onboarding is enforced here rather than in each page: a student who verified
 * their email but never finished their profile is bounced to `/onboarding`, so
 * no screen ever has to cope with a half-built account.
 */
export default function AuthGuard({ children, requireProfile = true }) {
  const { isAuthenticated, isProfileComplete, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const next = encodeURIComponent(pathname || "/feed");
      router.replace(`/login?next=${next}`);
      return;
    }

    if (requireProfile && !isProfileComplete && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [isLoading, isAuthenticated, isProfileComplete, requireProfile, pathname, router]);

  if (isLoading || !isAuthenticated || (requireProfile && !isProfileComplete)) {
    return <FullPageLoader />;
  }

  return children;
}

export function FullPageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
      <span
        className="h-7 w-7 rounded-full border-[2.5px] border-line border-t-brand animate-spin"
      />
    </div>
  );
}
