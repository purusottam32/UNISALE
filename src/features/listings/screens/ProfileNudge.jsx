"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CloseIcon } from "@/components/ui/icons";
import { Sparkles } from "lucide-react";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";

const DISMISS_KEY = "unisale.nudge.profile";

/**
 * Prompts the one profile improvement that most changes a seller's outcomes:
 * a photo and a bio push the account over the "profile complete" trust
 * threshold. Dismissible and remembered, because a banner you cannot silence
 * stops being advice and becomes noise.
 */
export default function ProfileNudge({ user }) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  const needsWork = user && (!user.avatar || !user.bio);
  if (!needsWork || dismissed) return null;

  const missing = !user.avatar && !user.bio ? "a photo and a short bio" : !user.avatar ? "a photo" : "a short bio";

  return (
    <div className="relative flex flex-wrap items-center gap-3 rounded-lg border border-line bg-brand-tint p-4">
      <Sparkles size={iconSize.lg} strokeWidth={ICON_STROKE} aria-hidden className="text-brand" />

      <p className="min-w-0 flex-1 text-sm text-ink-2">
        <span className="font-semibold text-ink">Add {missing}.</span> Buyers message profiles
        that look like a real classmate far more often.
      </p>

      <Link
        href="/settings"
        className="shrink-0 rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-brand-fg"
      >
        Finish profile
      </Link>

      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          window.localStorage.setItem(DISMISS_KEY, "1");
          setDismissed(true);
        }}
        className="absolute right-2 top-2 rounded-full p-1 text-muted hover:text-ink"
      >
        <CloseIcon size={15} />
      </button>
    </div>
  );
}
