"use client";

import Link from "next/link";
import { cn } from "@/components/ui/cn";
import { CheckIcon, ShieldIcon } from "@/components/ui/icons";

/**
 * Breaks the trust score into the actions that raise it.
 *
 * A bare number tells a seller nothing. Listing the unmet signals turns
 * reputation into a checklist, which is the only version of it people act on.
 * Hidden once the score is high enough that the remaining items are just time.
 */
export default function TrustMeter({ user }) {
  if (!user) return null;

  const score = user.trustScore ?? 0;
  if (score >= 85) return null;

  const signals = [
    { label: "College email verified", done: user.isEmailVerified, action: null },
    {
      label: "Profile photo and bio added",
      done: Boolean(user.avatar && user.bio),
      action: { href: "/settings", label: "Add them" },
    },
    {
      label: "At least 3 ratings, averaging 4+",
      done: user.ratingCount >= 3 && user.ratingAverage >= 4,
      action: { href: "/sell", label: "Sell something" },
    },
    { label: "Account older than 90 days", done: null, action: null },
  ];

  const nextUp = signals.find((signal) => signal.done === false);

  return (
    <section className="rounded-lg border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
          <span className="text-brand">
            <ShieldIcon size={16} />
          </span>
          Trust score
        </h2>
        <span className="text-sm font-bold tabular-nums text-ink">{score}/100</span>
      </div>

      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-surface-3">
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-700"
          style={{ width: `${score}%` }}
        />
      </div>

      <ul className="mt-3.5 space-y-2">
        {signals.map((signal) => (
          <li key={signal.label} className="flex items-center gap-2.5 text-[13px]">
            <span
              className={cn(
                "grid h-5 w-5 shrink-0 place-items-center rounded-full",
                signal.done
                  ? "bg-brand-tint text-brand"
                  : "border border-dashed border-line-strong text-muted"
              )}
            >
              {signal.done ? <CheckIcon size={12} /> : null}
            </span>

            <span className={cn("flex-1", signal.done ? "text-muted line-through" : "text-ink-2")}>
              {signal.label}
            </span>

            {!signal.done && signal.action && (
              <Link href={signal.action.href} className="shrink-0 text-xs font-semibold text-brand">
                {signal.action.label}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {nextUp && (
        <p className="mt-3 text-xs text-muted">
          Buyers message sellers with higher trust scores first. Next up: {nextUp.label.toLowerCase()}.
        </p>
      )}
    </section>
  );
}
