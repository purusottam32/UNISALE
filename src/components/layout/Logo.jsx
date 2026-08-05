import Link from "next/link";
import { cn } from "@/components/ui/cn";

/** Wordmark. The tag shape nods to a price label without needing an asset. */
export default function Logo({ href = "/", size = "md", className = "" }) {
  const scale = size === "lg" ? "text-2xl" : "text-[19px]";

  return (
    <Link href={href} className={cn("inline-flex items-center gap-2", className)} aria-label="UniSale home">
      <span
        aria-hidden
        className="grid h-8 w-8 place-items-center rounded-[10px] bg-brand text-brand-fg"
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
      <span className={cn("font-extrabold tracking-[-0.02em] text-ink", scale)}>
        Uni<span className="text-brand">Sale</span>
      </span>
    </Link>
  );
}
