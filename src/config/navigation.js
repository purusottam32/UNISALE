/**
 * A single navigation source of truth, consumed by both the desktop top bar
 * and the mobile tab bar so the two can never drift apart.
 *
 * `badge` names a counter from `useBadgeCounts()`.
 */
export const PRIMARY_NAV = [
  { href: "/feed", label: "Home", icon: "home" },
  { href: "/explore", label: "Explore", icon: "compass" },
  { href: "/sell", label: "Sell", icon: "plus", emphasis: true },
  { href: "/messages", label: "Chats", icon: "chat", badge: "messages" },
  { href: "/profile", label: "You", icon: "user" },
];

/** Secondary destinations that live in the desktop account menu. */
export const ACCOUNT_NAV = [
  { href: "/profile", label: "My profile" },
  { href: "/profile?tab=listings", label: "My listings" },
  { href: "/saved", label: "Saved items" },
  { href: "/notifications", label: "Notifications", badge: "notifications" },
  { href: "/settings", label: "Settings" },
];

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
