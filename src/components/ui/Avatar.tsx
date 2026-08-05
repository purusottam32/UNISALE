"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { getInitials } from "@/lib/format";

/**
 * Identity, not decoration.
 *
 * Falls back to initials rather than a generic silhouette: on a trust-led
 * marketplace a named circle reads as a real classmate, a grey person icon
 * reads as an empty account. Radix handles the image load lifecycle, so a
 * broken URL degrades to initials instead of an alt-text box.
 */
const avatar = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-surface-3",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-[0.625rem]",
        sm: "h-8 w-8 text-[0.6875rem]",
        md: "h-10 w-10 text-caption",
        lg: "h-14 w-14 text-body",
        xl: "h-20 w-20 text-title",
        "2xl": "h-28 w-28 text-display-md",
      },
      ring: {
        true: "ring-2 ring-brand ring-offset-2 ring-offset-surface",
        false: "",
      },
    },
    defaultVariants: { size: "md", ring: false },
  }
);

export interface AvatarProps extends VariantProps<typeof avatar> {
  src?: string | null;
  name?: string;
  className?: string;
  /** Renders a presence dot. `undefined` shows nothing at all. */
  online?: boolean;
}

const DOT_SIZE = {
  xs: "h-2 w-2",
  sm: "h-2.5 w-2.5",
  md: "h-3 w-3",
  lg: "h-3.5 w-3.5",
  xl: "h-4 w-4",
  "2xl": "h-5 w-5",
} as const;

export default function Avatar({
  src,
  name = "",
  size = "md",
  ring,
  online,
  className,
}: AvatarProps) {
  const label = name || "Student";

  return (
    <span className={cn("relative inline-flex", className)}>
      <AvatarPrimitive.Root className={avatar({ size, ring })}>
        {src && (
          <AvatarPrimitive.Image
            src={src}
            alt={label}
            className="h-full w-full object-cover"
          />
        )}
        <AvatarPrimitive.Fallback
          /**
           * No delay: initials should be there on first paint. A 600ms delay
           * (the common default) produces an empty circle on slow connections,
           * which is worse than the fallback it is trying to avoid.
           */
          delayMs={0}
          className="flex h-full w-full items-center justify-center font-semibold text-ink-2"
        >
          <span aria-hidden>{getInitials(label)}</span>
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>

      {online !== undefined && (
        <span
          title={online ? "Online now" : "Offline"}
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-surface",
            DOT_SIZE[size ?? "md"],
            online ? "bg-accent" : "bg-line-strong"
          )}
        >
          <span className="sr">{online ? "Online now" : "Offline"}</span>
        </span>
      )}
    </span>
  );
}

/** Overlapping stack, for "3 students saved this". */
export function AvatarGroup({
  people,
  max = 3,
  size = "sm",
}: {
  people: { src?: string | null; name?: string }[];
  max?: number;
  size?: AvatarProps["size"];
}) {
  const shown = people.slice(0, max);
  const overflow = people.length - shown.length;

  return (
    <div className="flex items-center">
      {shown.map((person, index) => (
        <span key={index} className={index > 0 ? "-ml-2" : undefined}>
          <Avatar
            {...person}
            size={size}
            className="rounded-full ring-2 ring-surface"
          />
        </span>
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            "-ml-2 grid place-items-center rounded-full bg-surface-3 text-caption font-semibold text-ink-2 ring-2 ring-surface",
            size === "xs" ? "h-6 w-6" : size === "sm" ? "h-8 w-8" : "h-10 w-10"
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
