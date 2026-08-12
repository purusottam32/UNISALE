"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  Heart,
  LogOut,
  MessageCircle,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { useBadgeCounts } from "@/features/notifications/hooks";
import SearchBar from "@/features/search/SearchBar";
import { formatCampusLine } from "@/lib/format";
import { cn } from "@/lib/cn";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";
import { transitions } from "@/lib/motion";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import { notify } from "@/components/ui/Toast";
import {
  DropdownContent,
  DropdownItem,
  DropdownRoot,
  DropdownSeparator,
  DropdownTrigger,
  dropdownIconProps,
} from "@/components/ui/Dropdown";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

/**
 * App header.
 *
 * Search owns the centre on desktop, because that is where intent arrives on a
 * large screen — people come knowing what they want and type it. On mobile it
 * collapses to an icon that expands into a full-width row, since the tab bar
 * already owns navigation down there and the header should not compete for
 * thumb space.
 *
 * The chrome is intentionally quiet: hairline separation, no fills, no
 * borders on the icon buttons. Navigation you notice is navigation competing
 * with the grid.
 */
const NAV_LINKS = [
  { href: "/feed", label: "Home" },
  { href: "/explore", label: "Explore" },
];

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const badges = useBadgeCounts();
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const signOut = async () => {
    await logout();
    notify.success("Signed out");
    router.push("/");
  };

  return (
    <header className="glass-chrome sticky top-0 z-40 shadow-[0_1px_0_var(--color-line)]">
      <div className="container-page flex h-[var(--topbar-h)] items-center gap-3">
        <Logo href={isAuthenticated ? "/feed" : "/"} />

        <nav aria-label="Primary" className="ml-2 hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-3 py-2 text-body-sm font-medium",
                "transition-colors duration-[--duration-fast]",
                isActive(link.href)
                  ? "bg-surface-2 text-ink"
                  : "text-muted hover:text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mx-auto hidden w-full max-w-lg md:block">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-0.5 md:ml-0">
          <IconAction
            label="Search"
            onClick={() => setSearchOpen((open) => !open)}
            expanded={searchOpen}
            className="md:hidden"
          >
            <Search size={iconSize.lg} strokeWidth={ICON_STROKE} />
          </IconAction>

          <ThemeToggle className="hidden sm:grid" />

          {isAuthenticated ? (
            <>
              <IconAction label="Saved" href="/saved" className="hidden sm:grid">
                <Heart size={iconSize.lg} strokeWidth={ICON_STROKE} />
              </IconAction>

              <IconAction
                label="Notifications"
                href="/notifications"
                count={badges.notifications}
                className="hidden sm:grid"
              >
                <Bell size={iconSize.lg} strokeWidth={ICON_STROKE} />
              </IconAction>

              <IconAction
                label="Chats"
                href="/messages"
                count={badges.messages}
                className="hidden lg:grid"
              >
                <MessageCircle size={iconSize.lg} strokeWidth={ICON_STROKE} />
              </IconAction>

              <Button href="/sell" size="sm" className="ml-1.5 hidden lg:inline-flex">
                <Plus size={iconSize.sm} strokeWidth={2.25} />
                Sell
              </Button>

              <AccountMenu user={user} onSignOut={signOut} />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button href="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button href="/register" size="sm">
                Join free
              </Button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transitions.base}
            className="overflow-hidden md:hidden"
          >
            <div className="container-page pb-3">
              <SearchBar autoFocus variant="inline" onNavigate={() => setSearchOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ── Icon button / link ───────────────────────────────────────────────────*/

function IconAction({
  label,
  href,
  onClick,
  count = 0,
  expanded,
  className,
  children,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  count?: number;
  expanded?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = cn(
    "relative grid h-10 w-10 place-items-center rounded-full text-ink-2",
    "transition-colors duration-[--duration-fast] hover:bg-surface-2 hover:text-ink",
    className
  );

  const badge = count > 0 && (
    <span
      /* `text-white` is literal on purpose: `danger-fill` is the same colour in
         both themes (4.71:1 against white), so routing this through a token
         that flips would make it worse, not more consistent. */
      className="absolute right-0.5 top-0.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-danger-fill px-1 text-nano tabular text-white"
      aria-hidden
    >
      {count > 9 ? "9+" : count}
    </span>
  );

  const accessibleLabel = count > 0 ? `${label}, ${count} unread` : label;

  const inner = href ? (
    <Link href={href} aria-label={accessibleLabel} className={classes}>
      {children}
      {badge}
    </Link>
  ) : (
    <button
      type="button"
      onClick={onClick}
      aria-label={accessibleLabel}
      aria-expanded={expanded}
      className={classes}
    >
      {children}
      {badge}
    </button>
  );

  return <Tooltip content={label}>{inner}</Tooltip>;
}

/* ── Account menu ─────────────────────────────────────────────────────────*/

const MENU_ITEMS = [
  { href: "/profile", label: "My profile", Icon: User },
  { href: "/profile?tab=listings", label: "My listings", Icon: ShoppingBag },
  { href: "/saved", label: "Saved items", Icon: Heart },
  { href: "/settings", label: "Settings", Icon: Settings },
];

function AccountMenu({
  user,
  onSignOut,
}: {
  user: ReturnType<typeof useAuth>["user"];
  onSignOut: () => void;
}) {
  const router = useRouter();

  return (
    <DropdownRoot>
      <DropdownTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="ml-1 hidden items-center gap-1 rounded-full p-0.5 pr-1.5 transition-colors hover:bg-surface-2 sm:flex"
        >
          <Avatar src={user?.avatar} name={user?.name} size="sm" />
          <ChevronDown size={iconSize.xs} strokeWidth={ICON_STROKE} className="text-muted" />
        </button>
      </DropdownTrigger>

      <DropdownContent>
        <div className="px-2.5 py-2">
          <p className="truncate text-body-sm font-semibold text-ink">{user?.name}</p>
          <p className="truncate text-caption text-muted">
            {formatCampusLine(user) || user?.email}
          </p>
        </div>

        <DropdownSeparator />

        {MENU_ITEMS.map(({ href, label, Icon }) => (
          <DropdownItem
            key={href}
            icon={<Icon {...dropdownIconProps} />}
            onSelect={() => router.push(href)}
          >
            {label}
          </DropdownItem>
        ))}

        <DropdownSeparator />

        <DropdownItem destructive icon={<LogOut {...dropdownIconProps} />} onSelect={onSignOut}>
          Sign out
        </DropdownItem>
      </DropdownContent>
    </DropdownRoot>
  );
}
