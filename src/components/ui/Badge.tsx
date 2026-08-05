import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * A static label. Badges describe; they never respond to clicks — anything
 * interactive is a `<Chip>`.
 */
const badge = cva(
  "inline-flex items-center gap-1 whitespace-nowrap rounded-full font-semibold leading-none",
  {
    variants: {
      tone: {
        neutral: "bg-surface-2 text-ink-2",
        brand: "bg-brand-tint text-brand",
        accent: "bg-accent-tint text-accent",
        success: "bg-success-tint text-success",
        warn: "bg-warn-tint text-warn",
        danger: "bg-danger-tint text-danger",
        info: "bg-info-tint text-info",
        /**
         * For badges sitting on a listing photo, where surface tokens cannot
         * be trusted because the backdrop is user-supplied.
         */
        overlay: "glass-on-photo",
        /** Maximum emphasis — reserve for a single "Sold" style state. */
        solid: "bg-ink text-inverse",
      },
      size: {
        sm: "px-2 py-1 text-[0.6875rem]",
        md: "px-2.5 py-1.5 text-caption",
      },
    },
    defaultVariants: { tone: "neutral", size: "sm" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {
  icon?: React.ReactNode;
}

export default function Badge({ tone, size, icon, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badge({ tone, size }), className)} {...props}>
      {icon}
      {children}
    </span>
  );
}

export { badge as badgeVariants };
