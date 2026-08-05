import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * `cn` — the only way class names get composed in this codebase.
 *
 * tailwind-merge has to be taught our custom scales, or it cannot tell a
 * font-size from a text-colour. Without this config `cn("text-body-sm",
 * "text-muted")` would treat both as the same class group and silently drop
 * one — a bug that shows up as "why is my caption the wrong size" three
 * screens later.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-2xl",
            "display-xl",
            "display-lg",
            "display-md",
            "headline",
            "title",
            "subtitle",
            "body-lg",
            "body",
            "body-sm",
            "caption",
            "micro",
            "button",
            "price-hero",
            "price-lg",
            "price-md",
            "price-sm",
          ],
        },
      ],
      "text-color": [
        {
          text: [
            "ink",
            "ink-2",
            "muted",
            "faint",
            "inverse",
            "brand",
            "brand-fg",
            "brand-hover",
            "brand-active",
            "accent",
            "accent-fg",
            "success",
            "warn",
            "danger",
            "danger-fg",
            "info",
          ],
        },
      ],
      shadow: [{ shadow: ["e1", "e2", "e3", "e4"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
