"use client";

import Logo from "@/components/layout/Logo";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Button from "@/components/ui/Button";

/**
 * Marketing header.
 *
 * Deliberately the same mechanism as the app's `TopBar`: `glass-chrome` plus a
 * hairline drawn as a box-shadow. It used to be `border-b border-line` with its
 * own `bg-surface/92 backdrop-blur-md`, which is a second, slightly different
 * chrome treatment for a visitor to notice one click before they see the first.
 */
export default function LandingHeader() {
  return (
    <header className="glass-chrome sticky top-0 z-40 shadow-[0_1px_0_var(--color-line)]">
      <div className="container-page flex h-[var(--topbar-h)] items-center justify-between">
        <Logo href="/" />

        <div className="flex items-center gap-1">
          {/* Visible on phones too. Dark is forced on everyone regardless of OS
              preference, so hiding the only escape hatch below `sm` left the
              cohort most likely to be reading outdoors in daylight — students,
              on phones — with no way out of it. Forcing the choice and then
              hiding the control is the one combination that can't be defended. */}
          <ThemeToggle />
          <Button href="/explore" variant="ghost" size="sm" className="hidden sm:inline-flex">
            Browse
          </Button>
          <Button href="/login" variant="ghost" size="sm">
            Log in
          </Button>
          <Button href="/register" size="sm" className="ml-1">
            Join free
          </Button>
        </div>
      </div>
    </header>
  );
}
