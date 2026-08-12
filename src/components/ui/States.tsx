"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Search, WifiOff } from "lucide-react";
import { cn } from "@/lib/cn";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";
import { fadeUp } from "@/lib/motion";
import Button from "./Button";
import Spinner from "./Spinner";

/**
 * The three states every data-backed surface must handle.
 *
 * Grouped in one module because they are one decision, not three: a screen
 * picks empty / loading / error and the choice should be visible in a single
 * import. Splitting them made it easy to ship a screen that handled two of
 * the three.
 */

/* ── Empty ────────────────────────────────────────────────────────────────*/

export interface EmptyStateProps {
  /**
   * A Lucide icon element, e.g. `<Search size={iconSize.xl} />`. Defaults to a
   * magnifier.
   *
   * This used to take an emoji, on the reasoning that illustrations get stale
   * and cost a download — true, but the alternative to an illustration is an
   * icon, not a glyph from the OS emoji font. An emoji cannot inherit
   * `currentColor`, ignores the stroke weight of everything around it, and
   * renders as a different picture on every platform.
   */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  secondaryAction?: { label: string; href?: string; onClick?: () => void };
  /** `inline` drops the dashed frame — for empty states inside a card. */
  variant?: "framed" | "inline";
  className?: string;
}

/**
 * An empty state on a two-sided marketplace is almost always a *supply*
 * problem, so it must always offer a way forward — widen the search, or list
 * something. A dead end here is a churned user.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "framed",
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className={cn(
        "flex flex-col items-center px-6 text-center",
        variant === "framed"
          ? "rounded-lg bg-surface py-14 shadow-e1"
          : "py-10",
        className
      )}
    >
      {/* Same framed circle `ErrorState` uses below, so the two states finally
          look like siblings instead of a 40px glyph next to a 48px disc. */}
      <span
        aria-hidden
        className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-surface-2 text-muted"
      >
        {icon ?? <Search size={iconSize.xl} strokeWidth={ICON_STROKE} />}
      </span>

      <h3 className="text-title text-ink">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-body-sm leading-relaxed text-muted">{description}</p>
      )}

      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {action && (
            <Button href={action.href} onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="secondary"
              href={secondaryAction.href}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ── Loading ──────────────────────────────────────────────────────────────*/

/**
 * Spinner-based loading is the *fallback*, not the default.
 *
 * Where the final layout is known — any grid, list or card — use a Skeleton
 * instead, so nothing shifts when data lands. Reach for this only when the
 * shape of the result genuinely isn't known ahead of time.
 */
export function LoadingState({
  label = "Loading",
  className,
  full = false,
}: {
  label?: string;
  className?: string;
  full?: boolean;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-muted",
        full ? "min-h-[60vh]" : "py-16",
        className
      )}
    >
      <Spinner size={26} className="text-brand" />
      <p className="text-body-sm">{label}</p>
    </div>
  );
}

/* ── Error ────────────────────────────────────────────────────────────────*/

export interface ErrorStateProps {
  title?: string;
  description?: string;
  /** Offline gets its own icon and copy — it is the user's problem to fix. */
  offline?: boolean;
  onRetry?: () => void;
  retrying?: boolean;
  action?: { label: string; href?: string };
  className?: string;
}

export function ErrorState({
  title,
  description,
  offline = false,
  onRetry,
  retrying = false,
  action,
  className,
}: ErrorStateProps) {
  const Icon = offline ? WifiOff : AlertTriangle;

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center rounded-lg bg-surface px-6 py-14 text-center shadow-e1",
        className
      )}
    >
      <span
        className={cn(
          "mb-4 grid h-12 w-12 place-items-center rounded-full",
          offline ? "bg-surface-2 text-muted" : "bg-danger-tint text-danger"
        )}
      >
        <Icon size={iconSize.xl} strokeWidth={ICON_STROKE} />
      </span>

      <h3 className="text-title text-ink">
        {title || (offline ? "You're offline" : "Something went wrong")}
      </h3>
      <p className="mt-1.5 max-w-sm text-body-sm leading-relaxed text-muted">
        {description ||
          (offline
            ? "Check your connection and try again — campus wifi drops more than it should."
            : "This one's on us. Try again, and let us know if it keeps happening.")}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {onRetry && (
          <Button onClick={onRetry} loading={retrying}>
            <RefreshCw size={iconSize.sm} strokeWidth={ICON_STROKE} />
            Try again
          </Button>
        )}
        {action && (
          <Button variant="secondary" href={action.href}>
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Compact inline error for use above a form or inside a card, where a
 * full-height error block would be disproportionate.
 */
export function InlineError({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2.5 rounded-sm bg-danger-tint px-3.5 py-3 text-body-sm text-danger",
        className
      )}
    >
      <AlertTriangle size={iconSize.sm} strokeWidth={ICON_STROKE} className="mt-0.5 shrink-0" />
      <span className="min-w-0">{children}</span>
    </div>
  );
}
