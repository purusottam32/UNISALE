import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/**
 * The `(browse)` route group exists so listings are readable without an
 * account — a marketplace that hides its inventory behind a signup wall has
 * nothing to convince anyone to sign up with (docs/ARCHITECTURE.md §4.2).
 * That argument only pays off if crawlers are told which half is public.
 *
 * Everything behind the auth guard is disallowed: those routes render a
 * redirect for an anonymous crawler, so indexing them wastes crawl budget on
 * pages that can never rank.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/explore", "/search", "/listings/", "/u/"],
      disallow: [
        "/feed",
        "/sell",
        "/saved",
        "/messages",
        "/notifications",
        "/profile",
        "/settings",
        "/onboarding",
        "/verify-email",
        "/design-system",
      ],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
