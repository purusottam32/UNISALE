import type { NextConfig } from "next";

/**
 * Listing photos are served from Cloudflare R2 via its public bucket URL, which
 * differs per environment — so the host is read from the same env var the
 * backend uses rather than hard-coded here.
 */
const r2Host = (() => {
  try {
    return process.env.NEXT_PUBLIC_R2_PUBLIC_URL
      ? new URL(process.env.NEXT_PUBLIC_R2_PUBLIC_URL).hostname
      : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      ...(r2Host ? [{ protocol: "https" as const, hostname: r2Host }] : []),
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
