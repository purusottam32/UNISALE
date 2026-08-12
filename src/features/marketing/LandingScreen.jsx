"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { CATEGORY_META, LISTING_CATEGORIES } from "@/config/catalog";
import { useAuth } from "@/features/auth/auth-context";
import { useTrendingListings } from "@/features/listings/hooks";
import ProductCard from "@/features/listings/components/ProductCard";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";
import LandingHeader from "./LandingHeader";

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

const PROOF_POINTS = ["No commission", "No listing fees", "Verify in 30 seconds"];

/**
 * Public landing page.
 *
 * Leads with the problem rather than the product: every student already runs
 * this trade through WhatsApp, so the pitch is not "a new marketplace", it is
 * "the one you're already using, minus the parts that don't work".
 *
 * ── Left, not centred ───────────────────────────────────────────────────────
 * The version this replaces centred every section and wrapped each one in a
 * `rounded-lg border border-line` box at an identical vertical rhythm — six
 * near-identical cards stacked down the page, which is the single most
 * template-like shape a marketing page can take. Here nothing is boxed:
 * sections separate by full-bleed surface bands and hairline rules, content is
 * left-aligned against a consistent margin, and the splits are asymmetric.
 *
 * ── One display moment ──────────────────────────────────────────────────────
 * The hero is the only place `text-display-2xl` (72px) appears — the type scale
 * has always had it and nothing in the app had ever used anything above 40px.
 * A 16ch measure over two lines is what makes 72px read as editorial rather
 * than as a banner.
 *
 * ── No scroll reveals ───────────────────────────────────────────────────────
 * Deliberate. `revealOnScroll` exists in `lib/motion.ts` and was tried here,
 * and the cost was not worth it: `whileInView` renders `opacity: 0` inline, so
 * four of the five sections — most of the page — start invisible and depend on
 * framer-motion hydrating and an IntersectionObserver firing before anyone can
 * read them. That is a real failure mode on the one page that has to work for a
 * first-time visitor on a bad connection, traded for a fade. The structure
 * (asymmetry, hairlines, one display moment) is doing the work; fading it in
 * would be the part that reads as a template with animation bolted on.
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

  const proof = listings.slice(0, 4);
  /**
   * No proof to show — API down, or a campus with nothing listed yet.
   *
   * The hero collapses to one column and the headline measure *widens*, so the
   * display type gets bigger and more confident rather than smaller. The version
   * this replaces rendered a dashed box with a seedling emoji apologising for
   * being empty; an outage should show the strongest version of the page, not a
   * sad one. The ask that box carried survives as a one-word swap on the
   * secondary CTA.
   */
  const soloHero = !listingsLoading && proof.length === 0;

  return (
    <div className="min-h-screen bg-canvas">
      <LandingHeader />

      {/* A real `main` landmark. Without it the page was header / footer / two
          navs and five unnamed sections, so a screen-reader user had no
          "skip to content" target and no way to jump past the chrome. */}
      <main id="main">
      {/* ══ Hero ════════════════════════════════════════════════════════════ */}
      <section className="container-page pb-16 pt-20 md:pb-24 md:pt-28">
        {/* `items-start`, NOT `items-end`. The proof column is a 2×2 grid of 4:5
            portraits and runs far taller than the text beside it, so aligning
            bottoms drove the headline ~540px down the page and left the top of
            the hero empty. Top-aligning also lines the two eyebrows up with each
            other, which is the alignment worth having. (`items-end` earns its
            place in the closing section, where the short column is short.) */}
        <div
          className={
            soloHero
              ? "grid"
              : "grid items-start gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
          }
        >
          {/* `min-w-0` is load-bearing, not tidiness. A grid item defaults to
              `min-width: auto`, which means it refuses to shrink below its
              content — and the proof column's content is a `.rail` flexbox of
              four 168px cards (~708px). Without this the item stays 708px wide,
              the single-column grid inherits that width, and it drags the
              headline and every line of body copy off the right edge of a phone.
              `body { overflow-x: hidden }` then clips it with no scrollbar, so
              the text is silently unreachable rather than merely awkward.
              Measured before the fix: 708px of content in a 350px viewport. */}
          <div className="min-w-0">
            {/* An eyebrow, not a pill. `micro` is 11px/600/+0.06em and exists
                for exactly this — the bordered rounded-full badge it replaces
                was the first of the page's boxes. */}
            <p className="flex items-center gap-2 text-micro uppercase text-brand">
              <ShieldCheck size={14} strokeWidth={ICON_STROKE} aria-hidden />
              Verified students only
            </p>

            {/* `text-balance` per sentence, and the second sentence is a block.
                At 72px neither sentence fits one line in a 7/5 split, so left to
                itself the text ran the two together mid-line ("already trades.
                Just"). Making the turn its own block guarantees the break lands
                between the sentences — which is the whole rhetorical device —
                and `text-balance` then evens out the lines inside each one
                instead of leaving a one-word orphan. */}
            <h1 className="mt-5 text-balance text-display-xl text-ink lg:text-display-2xl">
              Your campus already trades.
              {/* `muted`, not `brand`. The tonal drop turns the sentence just as
                  well, and brand-coloured text that is not clickable breaks the
                  one rule the colour system asks components to keep — it also
                  stops competing with the button 40px below. */}
              <span className="block text-muted">Just not very well.</span>
            </h1>

            <p className="mt-6 max-w-[46ch] text-body-lg text-ink-2">
              Every semester, cycles, calculators, textbooks and hostel kit change hands over
              WhatsApp and Instagram stories. UniSale gives that trade a real home — searchable,
              rated, and open only to students at your college.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="/register" size="lg">
                Start selling free
                <ArrowRight size={iconSize.sm} strokeWidth={ICON_STROKE} />
              </Button>
              {/* Ghost, not `secondary`. `secondary` is a filled surface with a
                  hairline, i.e. another plate — one fill plus one text button
                  is the pairing that reads as confident. */}
              <Button href={soloHero ? "/register" : "/explore"} variant="ghost" size="lg">
                {soloHero ? "Claim your campus" : "Browse listings"}
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-2">
              {PROOF_POINTS.map((item) => (
                <li key={item} className="flex items-center gap-2 text-caption text-muted">
                  {/* `muted`, not `brand` — three indigo ticks beside an indigo
                      button is the accent used as paint. Not `faint` either:
                      at 14px on a phone #606060 was effectively invisible, so
                      the proof row read as three unpunctuated fragments. */}
                  <Check
                    size={14}
                    strokeWidth={ICON_STROKE}
                    className="text-muted"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Live campus, cropped by the viewport. The crop is the asymmetry and
              the proof at once, which is why the old standalone "Live on campus
              right now" section is gone rather than restyled.

              The bleed is measured, not guessed. `-6vw` overshot the real gutter
              between roughly 1024 and 1400 — at 1280 it pushed 34px past the
              viewport and cropped the card's *title and verified shield* rather
              than its photograph, deleting the exact trust signal the rest of
              the page argues for. Pulling out by half the difference between the
              viewport and the container reaches the edge and never passes it, and
              gating it at `xl` keeps it off the widths where there is no gutter
              to spend. Cropping a photo is editorial; cropping a price is a bug.

              An `h2`, not a `p`: the four card titles below are `h3`, so a
              paragraph here left the document outline jumping h1 → h3 and put
              "Firefox Ranger 26T MTB" second in screen-reader heading order. */}
          {!soloHero && (
            <div className="min-w-0 xl:mr-[calc((100vw-var(--container-max))/-2)]">
              <h2 className="mb-4 text-micro uppercase text-muted">Live on campus</h2>
              <div className="rail rail-bleed gap-3 sm:grid sm:grid-cols-2 sm:gap-4">
                {listingsLoading
                  ? Array.from({ length: 4 }, (_, index) => (
                      <div key={index} className="w-[168px] sm:w-auto">
                        <ProductCardSkeleton />
                      </div>
                    ))
                  : proof.map((listing, index) => (
                      <div key={listing._id} className="w-[168px] sm:w-auto">
                        <ProductCard listing={listing} priority={index < 2} />
                      </div>
                    ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══ What changes ════════════════════════════════════════════════════
          Full-bleed band, no radius, no border. Across the full width the step
          from canvas to surface separates on its own — a large area reads a
          value difference that the same difference on a 300px card would not,
          which is what lets `border-y` go. */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container-page">
          <p className="text-micro uppercase text-muted">The difference</p>
          <h2 className="mt-3 max-w-[24ch] text-display-md text-ink">What actually changes</h2>

          {/* Rules BETWEEN rows — the legitimate use of `--color-line`. A border
              around each row, which is what this was, is not.

              `text-muted`, not `text-faint`. This is the one place `faint` was
              used as small body copy, and it sits on `surface` rather than
              `canvas` — where its documented 3.17:1 is measured. Actual value
              here was 2.98:1 at 14px, below the 4.5:1 floor, which put the
              page's central argument in its least legible voice. The
              `line-through` already carries "the old way" without spending
              contrast on it.

              `justify-self-end text-right` binds each pair. Left-aligned in a
              `1fr` track, "WhatsApp groups" sat ~230px from its own arrow and
              the section read as two unrelated columns rather than four
              transformations. */}
          <ul className="mt-12 max-w-3xl divide-y divide-line">
            {PROBLEMS.map((item) => (
              <li
                key={item.before}
                className="grid items-baseline gap-x-5 gap-y-1.5 py-5 sm:grid-cols-[1fr_auto_1.1fr]"
              >
                <span className="text-body-sm text-muted line-through sm:justify-self-end sm:text-right">
                  {item.before}
                </span>
                <ArrowRight
                  size={15}
                  strokeWidth={ICON_STROKE}
                  className="hidden text-faint sm:block"
                  aria-hidden
                />
                <span className="text-body text-ink">{item.after}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ How it works ════════════════════════════════════════════════════ */}
      <section className="container-page py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          {/* A heading that holds position while three steps scroll past it is
              the strongest editorial gesture available for the price of one
              class. */}
          <div className="lg:sticky lg:top-[calc(var(--topbar-h)+48px)] lg:self-start">
            <h2 className="text-display-md text-ink">How it works</h2>
            <p className="mt-3 max-w-[30ch] text-body-sm text-muted">
              Three steps, and the first one is the whole product.
            </p>
          </div>

          <ol className="divide-y divide-line">
            {HOW_IT_WORKS.map((item) => (
              <li key={item.step} className="grid grid-cols-[auto_1fr] gap-x-6 py-8 first:pt-0">
                {/* 40px numerals in `faint` — big, quiet, and the actual visual
                    interest the three bordered cards were standing in for.
                    `faint` was darkened to clear 3:1 precisely so this is
                    allowed rather than merely possible. */}
                <span className="text-display-lg tabular text-faint" aria-hidden>
                  {item.step}
                </span>
                <div>
                  <h3 className="text-title text-ink">{item.title}</h3>
                  <p className="mt-2 max-w-[52ch] text-body text-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══ Categories ══════════════════════════════════════════════════════
          A typographic index, not ten tiles. Ten rows of 20px type on hairlines
          is the changelog-index shape, at a tenth of the chrome — and with the
          emoji gone the category name is the label, so nothing replaces them. */}
      <section className="container-page pb-20">
        <h2 className="text-headline text-ink">What students trade</h2>

        <ul className="mt-8 grid gap-x-12 md:grid-cols-2">
          {LISTING_CATEGORIES.slice(0, 10).map((category) => {
            const { Icon, blurb } = CATEGORY_META[category];
            return (
              <li key={category} className="border-b border-line">
                <Link
                  href={`/explore?category=${encodeURIComponent(category)}`}
                  className="group flex items-center gap-4 py-4"
                >
                  <Icon
                    size={iconSize.md}
                    strokeWidth={ICON_STROKE}
                    aria-hidden
                    className="shrink-0 text-faint transition-colors duration-[--duration-fast] group-hover:text-brand"
                  />
                  <span className="text-title text-ink transition-colors duration-[--duration-fast] group-hover:text-brand">
                    {category}
                  </span>
                  <span className="hidden text-caption text-muted sm:ml-auto sm:block">{blurb}</span>
                  {/* `ml-auto` lives on the arrow, not the blurb. The blurb is
                      `display:none` below `sm`, so when it carried the auto
                      margin the arrows collapsed against their labels and landed
                      at ten different x positions — turning the page's most
                      scannable section into its raggedest on exactly the
                      viewport where scanning matters most. */}
                  <ArrowRight
                    size={16}
                    strokeWidth={ICON_STROKE}
                    aria-hidden
                    className="ml-auto shrink-0 text-faint transition-all duration-[--duration-fast] group-hover:translate-x-0.5 group-hover:text-brand sm:ml-0"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ══ Close ═══════════════════════════════════════════════════════════
          `items-end` across an asymmetric split lands the small-text baseline
          on the display baseline. One class, and most of the difference between
          editorial and template.

          `pt-` is deliberately smaller than `pb-`: the category index above
          already ends in `pb-20`, and the two stacked to ~220px of empty canvas
          — a quarter of a phone viewport of nothing immediately before the ask,
          at the exact moment momentum matters. Air below the close is fine; air
          between the last argument and the close is a stall. */}
      <section className="pb-24 pt-12 md:pb-32 md:pt-16">
        <div className="container-page grid items-end gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <h2 className="max-w-[18ch] text-display-lg text-ink lg:text-display-xl">
            Join your campus marketplace
          </h2>

          <div>
            <p className="max-w-[34ch] text-body text-muted">
              Free forever. Verify with your college email and you&apos;re browsing in under a
              minute.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/register" size="lg">
                Create free account
                <ArrowRight size={iconSize.sm} strokeWidth={ICON_STROKE} />
              </Button>
              <Button href="/explore" variant="ghost" size="lg">
                Look around first
              </Button>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* The closing section stays on canvas so the footer's own `surface` band
          is the page's last value change. Two adjacent surface bands separated
          by a canvas gap would read as a stripe, not as structure — and the
          close gets its weight from 56px type and 128px of padding, which is
          the more restrained way to get it anyway. */}
      <Footer />
    </div>
  );
}
