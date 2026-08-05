"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORY_META, LISTING_CATEGORIES } from "@/config/catalog";
import { useAuth } from "@/features/auth/auth-context";
import { useTrendingListings } from "@/features/listings/hooks";
import ProductCard from "@/features/listings/components/ProductCard";
import Logo from "@/components/layout/Logo";
import Footer from "@/components/layout/Footer";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { ArrowRightIcon, CheckIcon, ShieldIcon } from "@/components/ui/icons";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Verify with your college email",
    body: "A 6-digit code proves you're a student. That single check is what keeps strangers, resellers and scammers off the platform.",
  },
  {
    step: "02",
    title: "List in under a minute",
    body: "Snap a few photos, name your price, publish. No listing fees, no commission, no waiting for approval.",
  },
  {
    step: "03",
    title: "Meet between classes",
    body: "Chat in-app without sharing your number, agree a spot on campus, hand it over. Then rate each other.",
  },
];

const PROBLEMS = [
  { before: "WhatsApp groups", after: "Searchable listings that don't scroll away" },
  { before: "OLX strangers", after: "Only verified students from your college" },
  { before: "Sharing your number", after: "In-app chat that stays in-app" },
  { before: "No idea who you're dealing with", after: "Ratings and trust scores on every profile" },
];

/**
 * Public landing page.
 *
 * Leads with the problem rather than the product: every student already runs
 * this trade through WhatsApp, so the pitch is not "a new marketplace", it is
 * "the one you're already using, minus the parts that don't work".
 *
 * Real trending listings render below the fold — proof of a live campus beats
 * any stock photograph.
 */
export default function LandingScreen() {
  const router = useRouter();
  const { isAuthenticated, isProfileComplete, isLoading } = useAuth();
  const { listings, isLoading: listingsLoading } = useTrendingListings({ limit: 8 });

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) router.replace(isProfileComplete ? "/feed" : "/onboarding");
  }, [isLoading, isAuthenticated, isProfileComplete, router]);

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-50 border-b border-line bg-surface/92 backdrop-blur-md">
        <div className="container-page flex h-[var(--topbar-h)] items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:grid" />
            <Button href="/explore" variant="ghost" size="sm" className="hidden sm:inline-flex">
              Browse
            </Button>
            <Button href="/login" variant="ghost" size="sm">
              Log in
            </Button>
            <Button href="/register" size="sm">
              Join free
            </Button>
          </div>
        </div>
      </header>

      <section className="container-page py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] font-medium text-ink-2">
            <span className="text-brand">
              <ShieldIcon size={14} />
            </span>
            Verified students only
          </span>

          <h1 className="mt-6 text-[clamp(36px,7vw,62px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
            Your campus already trades.
            <br />
            <span className="text-brand">Just not very well.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-ink-2">
            Every semester, cycles, calculators, textbooks and hostel kit change hands over
            WhatsApp and Instagram stories. UniSale gives that trade a real home — searchable,
            rated, and open only to students at your college.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/register" size="lg">
              Start selling free <ArrowRightIcon />
            </Button>
            <Button href="/explore" variant="secondary" size="lg">
              Browse listings
            </Button>
          </div>

          <ul className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {["No commission", "No listing fees", "Verify in 30 seconds"].map((item) => (
              <li key={item} className="flex items-center gap-1.5 text-[13px] text-muted">
                <span className="text-brand">
                  <CheckIcon size={14} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink">
              Live on campus right now
            </h2>
            <p className="mt-1 text-sm text-muted">Real listings from verified students.</p>
          </div>
          <Link
            href="/explore"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand"
          >
            See all <ArrowRightIcon size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {listingsLoading
            ? Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="aspect-[4/5] w-full" rounded="rounded-lg" />
              ))
            : listings
                .slice(0, 4)
                .map((listing) => <ProductCard key={listing._id} listing={listing} />)}
        </div>

        {!listingsLoading && listings.length === 0 && (
          <div className="rounded-lg border border-dashed border-line bg-surface px-6 py-14 text-center">
            <p className="text-3xl" aria-hidden>
              🌱
            </p>
            <p className="mt-3 font-semibold text-ink">Your campus hasn&apos;t started yet</p>
            <p className="mt-1 text-sm text-muted">
              Be the first to list — early sellers get the whole campus to themselves.
            </p>
            <Button href="/register" className="mt-5">
              Claim your campus
            </Button>
          </div>
        )}
      </section>

      <section className="border-y border-line bg-surface py-16">
        <div className="container-page">
          <h2 className="text-center text-2xl font-extrabold tracking-[-0.02em] text-ink md:text-[32px]">
            What actually changes
          </h2>

          <ul className="mx-auto mt-9 max-w-2xl space-y-2.5">
            {PROBLEMS.map((item) => (
              <li
                key={item.before}
                className="flex flex-col gap-2 rounded-lg border border-line p-4 sm:flex-row sm:items-center sm:gap-4"
              >
                <span className="text-sm text-muted line-through sm:w-[42%]">{item.before}</span>
                <span aria-hidden className="hidden text-brand sm:block">
                  <ArrowRightIcon size={16} />
                </span>
                <span className="flex-1 text-sm font-medium text-ink">{item.after}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-center text-2xl font-extrabold tracking-[-0.02em] text-ink md:text-[32px]">
          How it works
        </h2>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="rounded-lg border border-line bg-surface p-6">
              <span className="text-sm font-extrabold tabular-nums text-brand">{item.step}</span>
              <h3 className="mt-3 text-lg font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <h2 className="mb-5 text-xl font-extrabold tracking-[-0.02em] text-ink">
          What students trade
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {LISTING_CATEGORIES.slice(0, 10).map((category) => (
            <Link
              key={category}
              href={`/explore?category=${encodeURIComponent(category)}`}
              className="rounded-lg border border-line bg-surface p-4 transition-colors hover:border-brand hover:bg-brand-tint"
            >
              <span className="text-2xl" aria-hidden>
                {CATEGORY_META[category]?.emoji}
              </span>
              <p className="mt-2 text-sm font-semibold text-ink">{category}</p>
              <p className="mt-0.5 text-xs text-muted">{CATEGORY_META[category]?.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="rounded-xl border border-line bg-surface px-6 py-14 text-center">
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink md:text-[34px]">
            Join your campus marketplace
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted">
            Free forever. Verify with your college email and you&apos;re browsing in under a minute.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button href="/register" size="lg">
              Create free account <ArrowRightIcon />
            </Button>
            <Button href="/explore" variant="secondary" size="lg">
              Look around first
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
