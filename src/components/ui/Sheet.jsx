"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { CloseIcon } from "./icons";

/**
 * Bottom sheet on mobile, centred dialog from `md` up.
 *
 * Filters and confirmations are the two places a marketplace interrupts the
 * user, so this handles the details that make an interruption tolerable:
 * background scroll lock, Escape to dismiss, and focus moved into the panel.
 */
export default function Sheet({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  size = "md",
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);

    // Move focus in so keyboard and screen-reader users land inside the panel.
    const timer = window.setTimeout(() => panelRef.current?.focus(), 20);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className=" absolute inset-0 bg-[var(--scrim)]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          " relative flex max-h-[88vh] w-full flex-col overflow-hidden bg-surface shadow-lg outline-none",
          "rounded-t-xl md:rounded-xl md:animate-none",
          size === "sm" && "md:max-w-sm",
          size === "md" && "md:max-w-lg",
          size === "lg" && "md:max-w-2xl"
        )}
      >
        {/* Drag affordance — signals "swipe me away" on touch devices. */}
        <div aria-hidden className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-line-strong md:hidden" />

        {title && (
          <header className="flex items-start justify-between gap-4 px-5 pb-3 pt-4">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-ink">{title}</h2>
              {description && <p className="mt-0.5 text-[13px] text-muted">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-1 -mt-1 rounded-full p-2 text-muted hover:bg-surface-2 hover:text-ink"
            >
              <CloseIcon />
            </button>
          </header>
        )}

        <div className="flex-1 overflow-y-auto px-5 pb-5">{children}</div>

        {footer && (
          <footer className="flex gap-2 border-t border-line bg-surface px-5 py-3.5 pb-[max(14px,env(safe-area-inset-bottom))]">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body
  );
}
