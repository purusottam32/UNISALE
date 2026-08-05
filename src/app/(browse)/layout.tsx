import AppShell from "@/components/layout/AppShell";

/**
 * Publicly browsable pages.
 *
 * Explore, search, listing detail and seller profiles are readable without an
 * account — a marketplace that hides its inventory behind a signup wall has
 * nothing to convince anyone to sign up with. Actions inside these pages
 * (message, save) prompt for auth at the point of intent instead.
 */
export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
