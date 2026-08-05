"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { transitions } from "@/lib/motion";
import Chip from "./Chip";

/**
 * Underlined tab bar with a shared-layout indicator.
 *
 * This is one of the few places Framer earns its keep: `layoutId` makes the
 * underline *travel* between tabs instead of disappearing and reappearing.
 * The movement is the feedback — it shows where you came from and where you
 * landed, which a cross-fade cannot.
 *
 * Deliberately not Radix Tabs: these tabs switch *routes and queries*, not
 * panels. Radix would insist on owning `tabpanel` content that doesn't exist,
 * and its `aria-controls` would point at nothing.
 */
export interface TabItem {
  value: string;
  label: string;
  count?: number;
}

export default function Tabs({
  tabs,
  value,
  onChange,
  className,
  /** Unique when two tab bars can be on screen at once, or the underline jumps between them. */
  layoutGroup = "tabs",
}: {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  layoutGroup?: string;
}) {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn("rail rail-bleed relative gap-1 shadow-[inset_0_-1px_0_var(--color-line)]", className)}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;

        return (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative px-3 pb-3 pt-1.5 text-body-sm font-semibold",
              "transition-colors duration-[--duration-fast]",
              active ? "text-ink" : "text-muted hover:text-ink-2"
            )}
          >
            <span className="inline-flex items-center gap-1.5">
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[0.625rem] tabular leading-none",
                    active ? "bg-brand-tint text-brand" : "bg-surface-2 text-muted"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>

            {active && (
              <motion.span
                layoutId={`${layoutGroup}-indicator`}
                transition={transitions.layout}
                className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-brand"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Horizontal chip rail — categories, quick filters.
 * Kept here rather than in Chip.tsx because it is a *layout* of chips, and
 * Chip should stay a single-purpose atom.
 */
export function ChipRow({
  options,
  value,
  onChange,
  className,
  allowClear = true,
  clearLabel = "All",
}: {
  options: { value: string; label: string; emoji?: string; count?: number }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  allowClear?: boolean;
  clearLabel?: string;
}) {
  return (
    <div className={cn("rail rail-bleed gap-2", className)}>
      {allowClear && (
        <Chip active={!value} onClick={() => onChange("")}>
          {clearLabel}
        </Chip>
      )}
      {options.map((option) => (
        <Chip
          key={option.value}
          active={value === option.value}
          count={option.count}
          icon={option.emoji ? <span aria-hidden>{option.emoji}</span> : undefined}
          onClick={() => onChange(value === option.value ? "" : option.value)}
        >
          {option.label}
        </Chip>
      ))}
    </div>
  );
}
