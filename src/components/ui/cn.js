/**
 * Re-export so existing `@/components/ui` imports keep working.
 * The implementation — including the tailwind-merge config that teaches it our
 * custom type and shadow scales — lives in `@/lib/cn`.
 */
export { cn } from "@/lib/cn";
