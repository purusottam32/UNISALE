import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Wordmark. The tag shape nods to a price label without needing an asset.
 *
 * The mark carries the brand colour and the word does not. "Uni" in ink with
 * "Sale" in indigo is a two-tone trick that reads as a startup logo generator,
 * and it also spends the accent on something that is not an action — the one
 * rule the colour system asks components to keep. One indigo object in the
 * top-left corner is a brand; two is decoration.
 */
export default function Logo({ href = "/", size = "md", className = "" }) {
  const scale = size === "lg" ? "text-headline" : "text-title";

  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2", className)}
      aria-label="UniSale home"
    >
      <span
        aria-hidden
        className="grid h-8 w-8 place-items-center rounded-sm bg-brand text-brand-fg"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3.5 11.3V4.8a1.3 1.3 0 0 1 1.3-1.3h6.5c.35 0 .68.14.92.38l8 8a1.3 1.3 0 0 1 0 1.84l-6.5 6.5a1.3 1.3 0 0 1-1.84 0l-8-8a1.3 1.3 0 0 1-.38-.92Z"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinejoin="round"
          />
          <circle cx="7.9" cy="7.9" r="1.5" fill="currentColor" />
        </svg>
      </span>
      <span className={cn("text-ink", scale)}>UniSale</span>
    </Link>
  );
}
