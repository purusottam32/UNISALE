"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, MessageCircle, Plus, User } from "lucide-react";
import { useBadgeCounts } from "@/features/notifications/hooks";
import { cn } from "@/lib/cn";
import { ICON_STROKE } from "@/lib/design-tokens";

/**
 * Mobile tab bar — the primary navigation on phones, where most campus
 * traffic is.
 *
 * "Sell" is raised and brand-filled because supply is the scarce side of this
 * marketplace: the ask should never be more than one tap away, and it should
 * never look like the other four.
 *
 * Everything else is deliberately quiet. Navigation that competes with the
 * grid is navigation you notice, and you should not notice this.
 */
const TABS = [
  { href: "/feed", label: "Home", Icon: Home },
  { href: "/explore", label: "Explore", Icon: Compass },
  { href: "/sell", label: "Sell", Icon: Plus, emphasis: true },
  { href: "/messages", label: "Chats", Icon: MessageCircle, badge: "messages" as const },
  { href: "/profile", label: "You", Icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const badges = useBadgeCounts();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Primary"
      className="glass-chrome fixed inset-x-0 bottom-0 z-40 shadow-[0_-1px_0_var(--color-line)] lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex h-[var(--tabbar-h)] max-w-lg items-stretch">
        {TABS.map(({ href, label, Icon, emphasis, badge }) => {
          const active = isActive(href);
          const count = badge ? badges[badge] : 0;

          if (emphasis) {
            return (
              <li key={href} className="flex flex-1 items-center justify-center">
                <Link
                  href={href}
                  aria-label={label}
                  className={cn(
                    "grid h-12 w-12 -translate-y-3 place-items-center rounded-xl",
                    "bg-brand text-brand-fg shadow-e2",
                    "transition-transform duration-[--duration-fast] active:scale-90"
                  )}
                >
                  <Icon size={24} strokeWidth={2.25} />
                </Link>
              </li>
            );
          }

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1",
                  "text-nano transition-colors duration-[--duration-fast]",
                  active ? "text-brand" : "text-muted"
                )}
              >
                <span className="relative">
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.25 : ICON_STROKE}
                    /* Filled at 12% keeps the active tab legible without a
                       second colour — Lucide has no filled variants. */
                    fill={active ? "currentColor" : "none"}
                    fillOpacity={active ? 0.12 : 0}
                  />
                  {count > 0 && (
                    <span
                      className="absolute -right-2 -top-1 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-danger-fill px-1 text-nano tabular text-white"
                      aria-label={`${count} unread`}
                    >
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
