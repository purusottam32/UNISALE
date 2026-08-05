"use client";

import * as Menu from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";

/**
 * Action menu.
 *
 * Radix owns the hard parts — roving focus, typeahead, collision-aware
 * positioning, scroll locking, return-focus on close. We own the surface.
 *
 * Note this is a *menu*, not a select. Menu items perform actions; they do not
 * hold a value. Anything that sets a value uses `<Select>` so it gets the
 * native mobile picker.
 */

export const DropdownRoot = Menu.Root;
export const DropdownTrigger = Menu.Trigger;

export function DropdownContent({
  align = "end",
  sideOffset = 8,
  className,
  children,
}: {
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Menu.Portal>
      <Menu.Content
        align={align}
        sideOffset={sideOffset}
        /* Caps at the available viewport height so a long menu scrolls
           instead of running off-screen on a phone. */
        className={cn(
          "z-[70] max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[13rem] overflow-y-auto",
          "rounded-md bg-surface p-1.5 shadow-e3",
          "origin-[var(--radix-dropdown-menu-content-transform-origin)]",
          "data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out",
          className
        )}
      >
        {children}
      </Menu.Content>
    </Menu.Portal>
  );
}

export function DropdownItem({
  icon,
  destructive,
  trailing,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Menu.Item> & {
  icon?: React.ReactNode;
  destructive?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <Menu.Item
      className={cn(
        "flex cursor-pointer select-none items-center gap-2.5 rounded-sm px-2.5 py-2",
        "text-body-sm outline-none transition-colors duration-[--duration-fast]",
        /* Radix sets data-highlighted for both hover and keyboard focus, so
           mouse and keyboard users see exactly the same affordance. */
        destructive
          ? "text-danger data-[highlighted]:bg-danger-tint"
          : "text-ink-2 data-[highlighted]:bg-surface-2 data-[highlighted]:text-ink",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
      {trailing && <span className="shrink-0 text-muted">{trailing}</span>}
    </Menu.Item>
  );
}

export function DropdownCheckItem({
  checked,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Menu.CheckboxItem>) {
  return (
    <Menu.CheckboxItem
      checked={checked}
      className={cn(
        "flex cursor-pointer select-none items-center gap-2.5 rounded-sm px-2.5 py-2",
        "text-body-sm text-ink-2 outline-none transition-colors duration-[--duration-fast]",
        "data-[highlighted]:bg-surface-2 data-[highlighted]:text-ink",
        className
      )}
      {...props}
    >
      <span className="grid h-4 w-4 shrink-0 place-items-center text-brand">
        <Menu.ItemIndicator>
          <Check size={iconSize.xs} strokeWidth={3} />
        </Menu.ItemIndicator>
      </span>
      <span className="flex-1 truncate">{children}</span>
    </Menu.CheckboxItem>
  );
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return (
    <Menu.Label className="px-2.5 py-1.5 text-micro uppercase text-muted">{children}</Menu.Label>
  );
}

export function DropdownSeparator() {
  return <Menu.Separator className="my-1.5 h-px bg-line" />;
}

/** Convenience export so callers can size icons consistently inside items. */
export const dropdownIconProps = { size: iconSize.sm, strokeWidth: ICON_STROKE };
