"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary: catches errors thrown by the root layout itself,
 * which `app/error.tsx` cannot — that boundary lives *inside* the layout.
 *
 * This component replaces the root layout entirely, so the font, the theme
 * script and `globals.css` are all gone by the time it renders. Everything
 * here is therefore inline and self-contained: importing the design system
 * would reintroduce the dependency this file exists to survive without. The
 * palette is hard-coded to the dark canvas because dark is the app's default
 * with no attribute set (see docs/ARCHITECTURE.md §4.6).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[unisale] global error", error.digest ?? "", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          background: "#090909",
          color: "#f5f5f5",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <main style={{ maxWidth: "26rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
            UniSale hit an unexpected error
          </h1>
          <p style={{ margin: "10px 0 24px", lineHeight: 1.6, color: "#a1a1a1", fontSize: "0.9375rem" }}>
            The page couldn&apos;t start. Reloading usually clears it.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              font: "inherit",
              fontWeight: 600,
              cursor: "pointer",
              border: 0,
              borderRadius: "10px",
              padding: "12px 22px",
              background: "#8b8bf5",
              color: "#0b0b12",
            }}
          >
            Reload UniSale
          </button>
        </main>
      </body>
    </html>
  );
}
