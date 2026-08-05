"use client";

import { forwardRef } from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";

/**
 * An interactive, toggleable filter control.
 *
 * Uses `aria-pressed` rather than `aria-selected` because a chip is a toggle
 * button, not a listbox option — screen readers announce "pressed"/"not
 * pressed", which is what the interaction actually is.
 */
const chip = cva(
  [
    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full",
    "text-body-sm font-medium",
    "transition-[background-color,border-color,color,box-shadow] duration-[--duration-fast] ease-[--ease-standard]",
    "active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-45",
  ],
  {
    variants: {
      active: {
        true: "bg-brand-tint text-brand shadow-[inset_0_0_0_1px_var(--color-brand)]",
        false: "bg-surface text-ink-2 shadow-e1 hover:bg-surface-2 hover:text-ink",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-9 px-3.5",
      },
    },
    defaultVariants: { active: false, size: "md" },
  }
);

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSelect">,
    VariantProps<typeof chip> {
  /** Leading glyph — an emoji for categories, a Lucide icon elsewhere. */
  icon?: React.ReactNode;
  /** Live result count. Baymard: counts stop filters leading to dead ends. */
  count?: number;
  /** Renders a trailing ✕. Turns the chip into a removable applied-filter pill. */
  onRemove?: () => void;
}

const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { active, size, icon, count, onRemove, className, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={active ?? false}
      className={cn(chip({ active, size }), className)}
      {...props}
    >
      {icon}
      {children}
      {count !== undefined && (
        <span className={cn("tabular text-caption", active ? "text-brand/70" : "text-muted")}>
          {count}
        </span>
      )}
      {onRemove && (
        /**
         * A nested <button> is invalid HTML, so this is a span with an explicit
         * click handler. `stopPropagation` keeps "remove" from also toggling
         * the chip it lives inside.
         */
        <span
          role="button"
          tabIndex={-1}
          aria-label="Remove filter"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          className="-mr-1 ml-0.5 grid h-5 w-5 place-items-center rounded-full opacity-60 transition-opacity hover:opacity-100"
        >
          <X size={iconSize.xs} strokeWidth={ICON_STROKE} />
        </span>
      )}
    </button>
  );
});

export default Chip;
export { chip as chipVariants };
