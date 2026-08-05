"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";
import { transitions } from "@/lib/motion";

/**
 * Desktop section navigation — settings, profile tabs, admin.
 *
 * Deliberately *not* a global app sidebar. A permanent left rail would tax
 * every browsing session to serve a handful of account screens, and it steals
 * the horizontal space the listing grid needs at every breakpoint. Primary
 * navigation lives in the top bar and the mobile tab bar; this is for
 * navigating *within* a section.
 *
 * Collapses to a horizontal chip rail below `lg`, so the same component serves
 * both breakpoints rather than shipping a second mobile-only variant.
 */
export interface SideNavItem {
  href: string;
  label: string;
  Icon?: LucideIcon;
  count?: number;
}

export default function SideNav({
  items,
  title,
  className,
  layoutGroup = "sidenav",
}: {
  items: SideNavItem[];
  title?: string;
  className?: string;
  layoutGroup?: string;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href.split("?")[0];

  return (
    <nav aria-label={title || "Section"} className={className}>
      {title && (
        <h2 className="mb-3 hidden px-3 text-micro uppercase text-muted lg:block">{title}</h2>
      )}

      <ul className="rail rail-bleed gap-1 lg:flex-col lg:overflow-visible">
        {items.map(({ href, label, Icon, count }) => {
          const active = isActive(href);

          return (
            <li key={href} className="lg:w-full">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-2.5 whitespace-nowrap rounded-md px-3",
                  "h-10 text-body-sm font-medium",
                  "transition-colors duration-[--duration-fast]",
                  active ? "text-ink" : "text-muted hover:text-ink"
                )}
              >
                {/* The moving pill is the feedback — it shows where you came
                    from, which a colour swap alone cannot. */}
                {active && (
                  <motion.span
                    layoutId={`${layoutGroup}-pill`}
                    transition={transitions.layout}
                    className="absolute inset-0 -z-10 rounded-md bg-surface-2"
                  />
                )}

                {Icon && <Icon size={iconSize.sm} strokeWidth={ICON_STROKE} className="shrink-0" />}
                <span className="flex-1">{label}</span>

                {count !== undefined && count > 0 && (
                  <span className="rounded-full bg-surface-3 px-1.5 text-[0.625rem] tabular text-muted">
                    {count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
