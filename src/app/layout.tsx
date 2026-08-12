import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { site } from "@/config/site";
import { ThemeScript } from "@/components/layout/ThemeToggle";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "campus marketplace",
    "college students",
    "buy and sell",
    "used goods India",
    "hostel essentials",
    "student marketplace",
  ],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  /**
   * One value, matching `--color-canvas`. A media-split would be wrong here:
   * the theme is dark for everyone by default regardless of OS preference,
   * and `themeColor` cannot read the localStorage flag that overrides it. So
   * a user who explicitly chose light gets dark browser chrome — the only
   * honest option, since the alternative is chrome that contradicts the page
   * for the majority instead of the minority.
   */
  themeColor: "#090909",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before first paint to avoid a light flash. */}
        <ThemeScript />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
