"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/cn";

/**
 * Tooltips are a desktop affordance — they have no touch equivalent, so
 * nothing essential may live in one. Use them for *naming* icon-only controls,
 * never for instructions.
 *
 * `<TooltipProvider>` belongs once near the app root; `delayDuration` there
 * governs the whole app so tooltips never fire at different speeds.
 */
export const TooltipProvider = TooltipPrimitive.Provider;

export default function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}) {
  if (!content) return <>{children}</>;

  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          sideOffset={6}
          className={cn(
            /* Top of the surface ladder, not `bg-ink`. An inverted tooltip is
               a light-mode idiom: in dark it becomes a near-white card firing
               on every icon hover, which is the brightest thing on screen and
               attached to the least important information on it. */
            "z-[70] max-w-[16rem] rounded-xs bg-surface-3 px-2.5 py-1.5 text-caption font-medium text-ink shadow-e3",
            /* Grows from the trigger edge — Radix supplies the origin. */
            "origin-[var(--radix-tooltip-content-transform-origin)]",
            "data-[state=delayed-open]:animate-pop-in data-[state=closed]:animate-pop-out"
          )}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-surface-3" width={10} height={5} />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
