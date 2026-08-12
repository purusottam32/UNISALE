/**
 * Footer navigation.
 *
 * This file used to claim to be "a single navigation source of truth" for the
 * top bar and the tab bar as well, and it was not: both hardcoded their own
 * arrays and neither imported from here. The dead `PRIMARY_NAV` and
 * `ACCOUNT_NAV` exports are gone rather than wired up, because the two bars
 * genuinely need different things — the top bar shows two of five links, the
 * tab bar shows all five with a raised brand-filled centre — and unifying them
 * would mean adding a string→component icon map to both files to serve an
 * abstraction neither wants. The footer is the one case that is really just
 * data, so it is the one case that lives here.
 */
export const FOOTER_NAV = [
  {
    title: "Marketplace",
    links: [
      { href: "/explore", label: "Browse listings" },
      { href: "/explore?sort=views%3Adesc", label: "Trending" },
      { href: "/sell", label: "Sell an item" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/register", label: "Create account" },
      { href: "/settings", label: "Settings" },
    ],
  },
];
