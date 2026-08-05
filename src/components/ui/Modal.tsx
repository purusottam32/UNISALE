"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";
import { dialogIn, scrim } from "@/lib/motion";
import Button from "./Button";

/**
 * Centred dialog.
 *
 * RADIX + FRAMER CONTRACT — the part that is easy to get wrong:
 * Radix unmounts its content the instant `open` flips to false, which kills
 * any exit animation. `forceMount` on Portal/Overlay/Content hands mount
 * control to `<AnimatePresence>` instead, so the close animation actually
 * runs. Every overlay in this system follows the same pattern.
 *
 * Radix requires a Title for screen readers. If a caller doesn't supply a
 * visible one we still render it, visually hidden — an accessible name is not
 * optional just because the design doesn't want a heading.
 */
export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Hides the title visually while keeping it for assistive tech. */
  hideTitle?: boolean;
  size?: "sm" | "md" | "lg";
  footer?: React.ReactNode;
  children?: React.ReactNode;
  /** Off for destructive confirmations, where a stray click shouldn't dismiss. */
  dismissible?: boolean;
}

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export default function Modal({
  open,
  onOpenChange,
  title,
  description,
  hideTitle,
  size = "md",
  footer,
  children,
  dismissible = true,
}: ModalProps) {
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

            <Dialog.Content
              asChild
              forceMount
              onPointerDownOutside={(event) => !dismissible && event.preventDefault()}
              onEscapeKeyDown={(event) => !dismissible && event.preventDefault()}
            >
              <motion.div
                variants={dialogIn}
                initial="hidden"
                animate="show"
                exit="exit"
                className={cn(
                  "fixed left-1/2 top-1/2 z-[70] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2",
                  "flex max-h-[85vh] flex-col overflow-hidden rounded-xl bg-surface shadow-e4",
                  "focus:outline-none",
                  SIZES[size]
                )}
              >
                <header
                  className={cn(
                    "flex items-start justify-between gap-4 px-6 pt-5",
                    hideTitle && "sr"
                  )}
                >
                  <div className="min-w-0">
                    <Dialog.Title className="text-title text-ink">{title}</Dialog.Title>
                    {description && (
                      <Dialog.Description className="mt-1 text-body-sm text-muted">
                        {description}
                      </Dialog.Description>
                    )}
                  </div>

                  {dismissible && !hideTitle && (
                    <Dialog.Close
                      aria-label="Close"
                      className="-mr-2 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                    >
                      <X size={iconSize.lg} strokeWidth={ICON_STROKE} />
                    </Dialog.Close>
                  )}
                </header>

                {children && (
                  <div className={cn("flex-1 overflow-y-auto px-6", hideTitle ? "pt-5" : "pt-4")}>
                    {children}
                  </div>
                )}

                <footer className="flex gap-2 px-6 pb-5 pt-5">{footer}</footer>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

/**
 * Confirmation shorthand. Exists so destructive flows can't accidentally ship
 * an outside-click dismiss or a non-destructive-looking confirm button.
 */
export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  onConfirm,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  children?: React.ReactNode;
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      dismissible={!destructive}
      footer={
        <>
          <Button variant="secondary" block onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? "dangerSolid" : "primary"}
            block
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
