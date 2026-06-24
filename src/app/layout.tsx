import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "UniSale — Campus Marketplace for College Students",
  description:
    "Buy, sell, and exchange goods safely within your college campus. UniSale is India's trusted peer-to-peer marketplace for verified college students.",
  keywords:
    "campus marketplace, college students, buy sell, used goods, hostel essentials, student marketplace India",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    title: "UniSale — Campus Marketplace",
    description:
      "Your campus. Your marketplace. Buy and sell safely among verified college students.",
    url: "https://unisale.in",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
