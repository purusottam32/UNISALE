import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/**
 * Web app manifest.
 *
 * The PRD ships mobile as a PWA rather than native apps (§17), and without a
 * manifest there is no PWA — Android offers no install prompt and iOS drops the
 * app to a Safari bookmark with a screenshot for an icon. Students living in
 * this product from a phone should be able to keep it on the home screen.
 *
 * `start_url` is `/feed` because anyone who installed the app has an account;
 * the marketing page is for people who don't. Unauthenticated visitors are
 * redirected out of `/feed` by `AuthGuard` anyway, so nothing breaks either way.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: "/feed",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    // Matches `--color-canvas`; dark is the default with no theme attribute set.
    background_color: "#090909",
    theme_color: "#090909",
    categories: ["shopping", "education", "lifestyle"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "Sell an item", url: "/sell" },
      { name: "Chats", url: "/messages" },
      { name: "Saved", url: "/saved" },
    ],
  };
}
