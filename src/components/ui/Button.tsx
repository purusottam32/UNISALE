"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import Spinner from "./Spinner";

/**
 * The only button in the system.
 *
 * MOTION NOTE — the press animation is CSS, not Framer Motion, and that is
 * deliberate. A marketplace renders hundreds of buttons per session; wrapping
 * every one in `motion.button` costs runtime and bundle weight for a 100ms
 * transform that `active:scale-*` produces identically on the compositor.
 * Framer is reserved for things CSS genuinely cannot do — shared layout,
 * orchestrated sequences, drag, exit animations.
 *
 * Sizes map to the `controlHeight` token so a Button, Input and Select placed
 * side by side line up without anyone reaching for a magic number.
 */
const button = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap select-none",
    "text-button rounded-md",
    "transition-[background-color,border-color,color,box-shadow,transform,opacity]",
    "duration-[--duration-fast] ease-[--ease-standard]",
    "active:scale-[0.975]",
    "disabled:pointer-events-none disabled:opacity-50",
    // Focus is inherited from the global :focus-visible rule; this keeps the
    // ring hugging the button's own radius.
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  ],
  {
    variants: {
      variant: {
        /** The single accent. One per view — if two things are indigo, one is wrong. */
        primary: "bg-brand text-brand-fg hover:bg-brand-hover shadow-e1",
        secondary: "bg-surface text-ink shadow-e1 hover:bg-surface-2",
        ghost: "text-ink-2 hover:bg-surface-2 hover:text-ink",
        soft: "bg-brand-tint text-brand hover:bg-brand-tint-hover",
        /** Reads as available but not urgent — used for destructive entry points. */
        danger: "bg-danger-tint text-danger hover:brightness-[0.97]",
        dangerSolid: "bg-danger text-danger-fg hover:brightness-[0.94] shadow-e1",
        /** Inverted — for use on brand or photographic backgrounds. */
        inverse: "bg-surface text-ink hover:bg-surface-2 shadow-e2",
      },
      size: {
        sm: "h-9 px-3.5",
        md: "h-11 px-5",
        lg: "h-[52px] px-7 rounded-lg",
        icon: "h-11 w-11 rounded-full p-0",
        iconSm: "h-9 w-9 rounded-full p-0",
        iconLg: "h-[52px] w-[52px] rounded-full p-0",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", block: false },
  }
);

type ButtonVariants = VariantProps<typeof button>;

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    ButtonVariants {
  /** Renders a Next `<Link>`, keeping middle-click and open-in-new-tab. */
  href?: string;
  /** Merges props onto the child instead of rendering a button. */
  asChild?: boolean;
  loading?: boolean;
  /** Announced while `loading` is true. */
  loadingLabel?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    size,
    block,
    href,
    asChild,
    loading = false,
    loadingLabel = "Working",
    className,
    children,
    disabled,
    type = "button",
    ...props
  },
  ref
) {
  const classes = cn(button({ variant, size, block }), className);
  const isDisabled = disabled || loading;

  /**
   * The label stays mounted and is hidden with `opacity-0` rather than being
   * swapped out, so the button keeps its width while loading. A button that
   * shrinks mid-submit makes the whole layout twitch.
   */
  const content = (
    <>
      {loading && (
        <span className="absolute inset-0 grid place-items-center">
          <Spinner size={size === "sm" || size === "iconSm" ? 14 : 16} />
        </span>
      )}
      <span className={cn("inline-flex items-center gap-2", loading && "opacity-0")}>
        {children}
      </span>
      {loading && <span className="sr">{loadingLabel}</span>}
    </>
  );

  if (asChild) {
    return (
      <Slot className={classes} {...props}>
        {children}
      </Slot>
    );
  }

  if (href && !isDisabled) {
    // `props` is typed for a button; the shared subset (className, onClick,
    // aria-*) is what actually gets forwarded to the anchor.
    return (
      <Link href={href} className={classes} {...(props as Record<string, unknown>)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {content}
    </button>
  );
});

export default Button;
export { button as buttonVariants };
