import { cn } from "@/lib/cn";
import { aspect } from "@/lib/design-tokens";

/**
 * Loading placeholder.
 *
 * The rule for every skeleton in this codebase: mirror the *exact* geometry of
 * the content it replaces. A placeholder that is the wrong height causes the
 * page to jump when data lands, which is more jarring than no placeholder at
 * all. That is why the composed skeletons below duplicate the real components'
 * padding and aspect ratios rather than approximating them.
 */
export default function Skeleton({
  className,
  rounded = "rounded-md",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { rounded?: string }) {
  return <div aria-hidden className={cn("skeleton", rounded, className)} {...props} />;
}

/**
 * Mirrors `<ProductCard>` exactly: a bare 4:5 photo on the canvas — no
 * surface, no shadow — then three text rows flush to the image edge at
 * `pt-2.5`. If this drifts from the real card the grid jumps when data lands,
 * which is the one thing a skeleton exists to prevent.
 */
export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="w-full" rounded="rounded-lg" style={{ aspectRatio: aspect.card }} />
      <div className="space-y-1.5 pt-2.5">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3.5 w-2/5" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4"
      role="status"
      aria-label="Loading listings"
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ConversationRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="h-14 w-14 shrink-0" rounded="rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
    </div>
  );
}

/** Text block placeholder. The last line is short, the way real text ends. */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cn("h-3.5", index === lines - 1 ? "w-2/5" : "w-full")}
        />
      ))}
    </div>
  );
}
