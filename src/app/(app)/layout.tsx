import AppShell from "@/components/layout/AppShell";
import AuthGuard from "@/features/auth/components/AuthGuard";

/**
 * The signed-in shell. `AuthGuard` bounces anyone without a session to /login
 * and anyone with an unfinished profile to /onboarding, so no page inside this
 * group ever has to defend against a half-built account.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
