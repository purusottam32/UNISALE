"use client";

import toast, { Toaster, type Toast as HotToast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";
import { toastIn } from "@/lib/motion";

/**
 * Transient confirmation.
 *
 * Built on react-hot-toast's headless `custom` renderer rather than its default
 * styling, so toasts inherit our tokens exactly and can never drift into
 * looking like a third-party widget. That was the deciding factor against
 * swapping in another toast library: the library should own queueing and
 * timers, we should own every pixel.
 *
 * Toasts confirm; they never carry the only copy of something important. Any
 * message a user might need twice belongs in `/notifications`.
 */

type Tone = "success" | "error" | "warn" | "info";

const TONE = {
  success: { Icon: CheckCircle2, className: "text-accent" },
  error: { Icon: XCircle, className: "text-danger" },
  warn: { Icon: AlertTriangle, className: "text-warn" },
  info: { Icon: Info, className: "text-brand" },
} as const;

function ToastCard({
  t,
  tone,
  title,
  description,
  action,
}: {
  t: HotToast;
  tone: Tone;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}) {
  const { Icon, className } = TONE[tone];

  return (
    <AnimatePresence>
      {t.visible && (
        <motion.div
          variants={toastIn}
          initial="hidden"
          animate="show"
          exit="exit"
          /* `polite` not `assertive`: a toast confirming an action the user
             just took should not interrupt whatever they are reading. */
          role="status"
          aria-live="polite"
          className={cn(
            "pointer-events-auto flex w-[min(92vw,26rem)] items-start gap-3",
            "rounded-md bg-surface p-3.5 shadow-e3"
          )}
        >
          <span className={cn("mt-px shrink-0", className)}>
            <Icon size={iconSize.lg} strokeWidth={ICON_STROKE} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-body-sm font-semibold text-ink">{title}</p>
            {description && <p className="mt-0.5 text-caption text-muted">{description}</p>}
          </div>

          {action && (
            <button
              type="button"
              onClick={() => {
                action.onClick();
                toast.dismiss(t.id);
              }}
              className="shrink-0 rounded-xs px-2 py-1 text-body-sm font-semibold text-brand transition-colors hover:bg-brand-tint"
            >
              {action.label}
            </button>
          )}

          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => toast.dismiss(t.id)}
            className="-mr-1 -mt-1 shrink-0 rounded-full p-1 text-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <X size={iconSize.sm} strokeWidth={ICON_STROKE} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface NotifyOptions {
  description?: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
}

const show = (tone: Tone, title: string, options: NotifyOptions = {}) =>
  toast.custom(
    (t) => (
      <ToastCard
        t={t}
        tone={tone}
        title={title}
        description={options.description}
        action={options.action}
      />
    ),
    {
      /* Errors linger: the user has to read them, and often act. Successes are
         confirmations they already expected. */
      duration: options.duration ?? (tone === "error" ? 6000 : 3600),
    }
  );

export const notify = {
  success: (title: string, options?: NotifyOptions) => show("success", title, options),
  error: (title: string, options?: NotifyOptions) => show("error", title, options),
  warn: (title: string, options?: NotifyOptions) => show("warn", title, options),
  info: (title: string, options?: NotifyOptions) => show("info", title, options),
  dismiss: toast.dismiss,
  /** Ties a toast to a promise's lifecycle — used for uploads and publishes. */
  promise: toast.promise,
};

/**
 * Mounted once in the root providers. Positioned top-centre so it never
 * collides with the mobile tab bar or the sticky action bar on listing pages.
 */
export function ToastViewport() {
  return (
    <Toaster
      position="top-center"
      containerStyle={{ top: "calc(var(--topbar-h) + 12px)" }}
      gutter={10}
      toastOptions={{ className: "!bg-transparent !shadow-none !p-0 !m-0 !max-w-none" }}
    />
  );
}
