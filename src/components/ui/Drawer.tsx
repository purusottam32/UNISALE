"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";
import { scrim, sheetUp, transitions } from "@/lib/motion";

/**
 * Bottom sheet on mobile, side panel from `md` up.
 *
 * WHY ONE COMPONENT AND NOT TWO: filters, sort and detail panels are the same
 * *interaction* at every breakpoint — an interruption you dismiss to get back
 * to the grid. Only the direction of travel changes. Two components would
 * mean two prop surfaces and two chances for them to drift.
 *
 * The drag handle on mobile isn't decoration: it's the affordance that says
 * "swipe me away", and it's why we can keep the close button optional there.
 */
export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  side?: "bottom" | "right";
  footer?: React.ReactNode;
  children: React.ReactNode;
  /** Constrains the desktop panel. Bottom sheets always span the viewport. */
  size?: "sm" | "md" | "lg";
}

const PANEL_WIDTH = {
  sm: "md:max-w-sm",
  md: "md:max-w-md",
  lg: "md:max-w-xl",
};

export default function Drawer({
  open,
  onOpenChange,
  title,
  description,
  side = "bottom",
  footer,
  children,
  size = "md",
}: DrawerProps) {
  const isSide = side === "right";

  /* Side panels slide on X; bottom sheets reuse the shared sheetUp variant so
     every upward-travelling surface in the product moves identically. */
  const variants = isSide
    ? {
        hidden: { x: "100%" },
        show: { x: 0, transition: transitions.sheet },
        exit: { x: "100%", transition: transitions.exit },
      }
    : sheetUp;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                variants={scrim}
                initial="hidden"
                animate="show"
                exit="exit"
                className="fixed inset-0 z-[60] bg-[var(--scrim)]"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.div
                variants={variants}
                initial="hidden"
                animate="show"
                exit="exit"
                className={cn(
                  "fixed z-[70] flex flex-col overflow-hidden bg-surface shadow-e4 focus:outline-none",
                  isSide
                    ? "inset-y-0 right-0 w-full md:w-[92vw] " + PANEL_WIDTH[size]
                    : cn(
                        "inset-x-0 bottom-0 max-h-[88vh] rounded-t-xl",
                        "md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2",
                        "md:max-h-[85vh] md:w-[calc(100vw-2rem)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl",
                        PANEL_WIDTH[size]
                      )
                )}
              >
                {!isSide && (
                  <div
                    aria-hidden
                    className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-line-strong md:hidden"
                  />
                )}

                <header className="flex items-start justify-between gap-4 px-5 pb-3 pt-4">
                  <div className="min-w-0">
                    <Dialog.Title className="text-title text-ink">{title}</Dialog.Title>
                    {description && (
                      <Dialog.Description className="mt-0.5 text-body-sm text-muted">
                        {description}
                      </Dialog.Description>
                    )}
                  </div>

                  <Dialog.Close
                    aria-label="Close"
                    className="-mr-2 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                  >
                    <X size={iconSize.lg} strokeWidth={ICON_STROKE} />
                  </Dialog.Close>
                </header>

                <div className="flex-1 overflow-y-auto px-5 pb-5">{children}</div>

                {footer && (
                  /* Padded for the iOS home indicator so a full-width primary
                     action is never sat underneath it. */
                  <footer
                    className="flex shrink-0 gap-2 bg-surface px-5 pt-4 shadow-[0_-1px_0_var(--color-line)]"
                    style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
                  >
                    {footer}
                  </footer>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
