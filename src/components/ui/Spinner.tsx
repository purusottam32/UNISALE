import { cn } from "@/lib/cn";

/**
 * Indeterminate progress.
 *
 * Inherits `currentColor` so it works on any surface without a variant prop —
 * a spinner inside a primary button, a ghost button and a card all take the
 * colour of their context automatically.
 */
export default function Spinner({
  size = 16,
  className,
  label,
}: {
  size?: number;
  className?: string;
  /** Omit inside a control that already announces its busy state. */
  label?: string;
}) {
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "inline-block shrink-0 animate-spin rounded-full",
          "border-current border-t-transparent opacity-70",
          className
        )}
        style={{ width: size, height: size, borderWidth: Math.max(2, Math.round(size / 8)) }}
      />
      {label && <span className="sr">{label}</span>}
    </>
  );
}
