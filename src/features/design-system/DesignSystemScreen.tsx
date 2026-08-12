"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Zap,
} from "lucide-react";
import Logo from "@/components/layout/Logo";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/cn";
import {
  ICON_STROKE,
  aspect,
  breakpoints,
  controlHeight,
  grid,
  iconSize,
  zIndex,
} from "@/lib/design-tokens";
import { cardHover, pressable, transitions } from "@/lib/motion";
import { Grid, Section, Spec } from "./Section";

/* ── Data ─────────────────────────────────────────────────────────────────*/

/**
 * Class names are written out in full rather than composed at runtime.
 * Tailwind scans source statically — a template literal like `bg-${token}`
 * produces no CSS at all, and the swatch silently renders transparent.
 */
const SURFACES = [
  { token: "canvas", cls: "bg-canvas", note: "page background" },
  { token: "surface", cls: "bg-surface", note: "cards, sheets" },
  { token: "surface-2", cls: "bg-surface-2", note: "wells, inputs" },
  { token: "surface-3", cls: "bg-surface-3", note: "pressed" },
];

/**
 * Ratios are quoted per theme, dark first, because dark is the default and a
 * single number here would be wrong half the time. Both figures are measured
 * against the token's own backdrop — `canvas` for text, the paired fill for
 * actions.
 */
const TEXT_TOKENS = [
  { token: "ink", cls: "text-ink", note: "headings, prices", dark: "18.26:1", light: "16.97:1" },
  { token: "ink-2", cls: "text-ink-2", note: "body copy", dark: "12.02:1", light: "10.01:1" },
  { token: "muted", cls: "text-muted", note: "metadata", dark: "6.32:1", light: "4.56:1" },
  { token: "faint", cls: "text-faint", note: "large marks, disabled", dark: "3.17:1", light: "3.27:1" },
];

const ACTION_TOKENS = [
  { token: "brand", cls: "bg-brand text-brand-fg", note: "primary action", dark: "6.65:1", light: "6.29:1" },
  { token: "accent", cls: "bg-accent text-accent-fg", note: "trust, verified", dark: "10.33:1", light: "5.48:1" },
  { token: "danger", cls: "bg-danger text-danger-fg", note: "destructive", dark: "7.35:1", light: "6.02:1" },
  { token: "warn", cls: "bg-warn text-inverse", note: "caution", dark: "11.88:1", light: "5.02:1" },
];

const TYPE_SCALE = [
  { token: "display-2xl", cls: "text-display-2xl", spec: "72 / 600 / −0.040em", sample: "Sell it on campus" },
  { token: "display-xl", cls: "text-display-xl", spec: "56 / 600 / −0.038em", sample: "Sell it on campus" },
  { token: "display-lg", cls: "text-display-lg", spec: "40 / 600 / −0.034em", sample: "Sell it on campus" },
  { token: "display-md", cls: "text-display-md", spec: "32 / 600 / −0.028em", sample: "Sell it on campus" },
  { token: "headline", cls: "text-headline", spec: "24 / 600 / −0.022em", sample: "Moving fast on campus" },
  { token: "title", cls: "text-title", spec: "20 / 600 / −0.016em", sample: "Hero Sprint cycle, 26 inch" },
  { token: "subtitle", cls: "text-subtitle", spec: "17 / 500 / −0.011em", sample: "Like new · IIT Bombay" },
  { token: "body-lg", cls: "text-body-lg", spec: "17 / 400 / −0.006em", sample: "Two years old, recently serviced." },
  { token: "body", cls: "text-body", spec: "16 / 400 / 0", sample: "Two years old, recently serviced." },
  { token: "body-sm", cls: "text-body-sm", spec: "14 / 400 / 0", sample: "Two years old, recently serviced." },
  { token: "caption", cls: "text-caption", spec: "13 / 400 / 0", sample: "Posted 4h ago · 128 views" },
  { token: "micro", cls: "text-micro uppercase", spec: "11 / 600 / +0.06em", sample: "Verified student" },
];

const PRICE_SCALE = [
  { token: "price-hero", cls: "text-price-hero", spec: "40 / 600", value: "₹1,25,000" },
  { token: "price-lg", cls: "text-price-lg", spec: "28 / 600", value: "₹65,000" },
  { token: "price-md", cls: "text-price-md", spec: "20 / 600", value: "₹2,200" },
  { token: "price-sm", cls: "text-price-sm", spec: "16 / 600", value: "₹450" },
];

const SPACING = [
  { step: "1", px: 4 },
  { step: "2", px: 8 },
  { step: "3", px: 12 },
  { step: "4", px: 16 },
  { step: "6", px: 24 },
  { step: "8", px: 32 },
  { step: "12", px: 48 },
  { step: "16", px: 64 },
  { step: "24", px: 96 },
];

const RADII = [
  { token: "xs", px: 6, use: "badges" },
  { token: "sm", px: 10, use: "inputs" },
  { token: "md", px: 14, use: "buttons" },
  { token: "lg", px: 20, use: "cards ★" },
  { token: "xl", px: 28, use: "sheets" },
  { token: "2xl", px: 36, use: "panels" },
];

const ELEVATION = [
  { token: "e1", cls: "shadow-e1", use: "inputs, chips" },
  { token: "e2", cls: "shadow-e2", use: "card hover ★" },
  { token: "e3", cls: "shadow-e3", use: "dropdowns" },
  { token: "e4", cls: "shadow-e4", use: "modals" },
];

const MOTION = [
  { name: "instant", ms: 100, use: "press feedback" },
  { name: "fast", ms: 160, use: "hover, colour" },
  { name: "base", ms: 240, use: "the default ★" },
  { name: "entrance", ms: 300, use: "scroll reveal" },
  { name: "sheet", ms: 380, use: "drawers" },
  { name: "exit", ms: 160, use: "anything leaving" },
];

const NAV = [
  ["colour", "Colour"],
  ["type", "Typography"],
  ["space", "Space"],
  ["radius", "Radius"],
  ["elevation", "Elevation"],
  ["motion", "Motion"],
  ["icons", "Icons"],
  ["layout", "Layout"],
];

/* ── Screen ───────────────────────────────────────────────────────────────*/

export default function DesignSystemScreen() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="glass-chrome sticky top-0 z-40 border-b border-line">
        <div className="container-page flex h-16 items-center gap-4">
          <Logo href="/" />
          <span className="hidden text-caption text-muted sm:block">Design system</span>
          <nav className="rail ml-auto hidden gap-1 lg:flex">
            {NAV.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-full px-3 py-1.5 text-body-sm text-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                {label}
              </a>
            ))}
          </nav>
          <ThemeToggle className="ml-auto lg:ml-0" />
        </div>
      </header>

      <main className="container-page pb-24">
        {/* Hero — the type scale's own advertisement. */}
        <motion.section
          className="py-16 md:py-24"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitions.entrance}
        >
          <span className="text-micro text-brand">UNISALE · V1</span>
          <h1 className="mt-3 max-w-3xl text-display-xl text-ink">
            A quiet, confident frame around student photography.
          </h1>
          <p className="mt-5 max-w-xl text-body-lg text-muted">
            Every colour, size, radius, shadow and easing in the product resolves to a token on
            this page. If it is not here, it does not exist.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Light + dark", "WCAG AA verified", "8px rhythm", "Framer Motion"].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface px-3 py-1.5 text-caption text-ink-2 shadow-e1"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.section>

        {/* ── Colour ─────────────────────────────────────────────────────── */}
        <Section
          id="colour"
          title="Colour"
          description="One accent, spent sparingly. Anything brand-coloured is an action — if it is not clickable, it is a bug. Every pair below was measured, not estimated."
        >
          <h3 className="mb-3 text-title text-ink">Surfaces</h3>
          <Grid className="grid-cols-2 md:grid-cols-4">
            {SURFACES.map((item) => (
              <div key={item.token} className="rounded-lg border border-line p-3">
                <div className={cn("mb-3 h-20 rounded-md shadow-e1", item.cls)} />
                <p className="text-body-sm font-medium text-ink">{item.token}</p>
                <Spec label="" value={item.note} />
              </div>
            ))}
          </Grid>

          <h3 className="mb-3 mt-10 text-title text-ink">Text</h3>
          <Grid className="grid-cols-2 md:grid-cols-4">
            {TEXT_TOKENS.map((item) => (
              <div key={item.token} className="rounded-lg bg-surface p-4 shadow-e1">
                <p className={cn("text-title", item.cls)}>Aa</p>
                <p className="mt-2 text-body-sm font-medium text-ink">{item.token}</p>
                <Spec label={item.note} value={`${item.dark} dark · ${item.light} light`} />
              </div>
            ))}
          </Grid>

          <h3 className="mb-3 mt-10 text-title text-ink">Actions</h3>
          <Grid className="grid-cols-2 md:grid-cols-4">
            {ACTION_TOKENS.map((item) => (
              <div key={item.token} className="rounded-lg border border-line p-3">
                <div
                  className={cn(
                    "mb-3 grid h-20 place-items-center rounded-md text-button",
                    item.cls
                  )}
                >
                  Action
                </div>
                <p className="text-body-sm font-medium text-ink">{item.token}</p>
                <Spec label={item.note} value={`${item.dark} dark · ${item.light} light`} />
              </div>
            ))}
          </Grid>

          <div className="mt-6 rounded-lg border border-line bg-warn-tint p-4">
            <p className="text-body-sm text-ink-2">
              <span className="font-semibold text-ink">Trap avoided:</span> the obvious emerald
              (#10B981) measures 3.61:1 on canvas and fails AA as text. Light mode uses{" "}
              <span className="tabular">#047857</span> instead; the vivid value survives only for
              dark mode and large glyphs.
            </p>
          </div>
        </Section>

        {/* ── Typography ─────────────────────────────────────────────────── */}
        <Section
          id="type"
          title="Typography"
          description="Inter Variable with cv01 + ss03. Tracking runs −0.04em at display sizes and eases to 0 by 14px — the single highest-yield premium signal. Weight ceiling is 600, never higher."
        >
          <div className="divide-y divide-line overflow-hidden rounded-lg bg-surface shadow-e1">
            {TYPE_SCALE.map((item) => (
              <div
                key={item.token}
                className="flex flex-col gap-2 p-5 md:flex-row md:items-baseline md:gap-6"
              >
                <div className="w-40 shrink-0">
                  <p className="text-body-sm font-medium text-ink">{item.token}</p>
                  <Spec label="" value={item.spec} />
                </div>
                <p className={cn("min-w-0 truncate text-ink", item.cls)}>{item.sample}</p>
              </div>
            ))}
          </div>

          <h3 className="mb-3 mt-10 text-title text-ink">Price scale</h3>
          <p className="mb-4 max-w-xl text-body-sm text-muted">
            Always tabular. A price column that reflows as digits change reads as amateur — Stripe
            treats this as non-negotiable and so do we.
          </p>
          <Grid className="grid-cols-2 md:grid-cols-4">
            {PRICE_SCALE.map((item) => (
              <div key={item.token} className="rounded-lg bg-surface p-5 shadow-e1">
                <p className={cn("tabular text-ink", item.cls)}>{item.value}</p>
                <p className="mt-3 text-body-sm font-medium text-ink">{item.token}</p>
                <Spec label="" value={item.spec} />
              </div>
            ))}
          </Grid>
        </Section>

        {/* ── Space ──────────────────────────────────────────────────────── */}
        <Section
          id="space"
          title="Space"
          description="4px base. Air between sections, density within grids — section rhythm runs 56/96px while grid gutters stay at 12/16px."
        >
          <div className="space-y-2.5 rounded-lg bg-surface p-5 shadow-e1">
            {SPACING.map((item) => (
              <div key={item.step} className="flex items-center gap-4">
                <span className="w-10 shrink-0 text-caption tabular text-muted">{item.step}</span>
                <span className="h-3 rounded-xs bg-brand" style={{ width: item.px }} />
                <span className="text-caption tabular text-muted">{item.px}px</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Radius ─────────────────────────────────────────────────────── */}
        <Section
          id="radius"
          title="Radius"
          description="Two-tier: small radii on controls, large on surfaces. 20px is the signature — it is the listing card."
        >
          <Grid className="grid-cols-3 md:grid-cols-6">
            {RADII.map((item) => (
              <div key={item.token} className="text-center">
                <div
                  className="mb-2 aspect-square w-full border-2 border-brand bg-brand-tint"
                  style={{ borderRadius: `var(--radius-${item.token})` }}
                />
                <p className="text-body-sm font-medium text-ink">{item.token}</p>
                <Spec label="" value={`${item.px}px · ${item.use}`} />
              </div>
            ))}
          </Grid>
        </Section>

        {/* ── Elevation ──────────────────────────────────────────────────── */}
        <Section
          id="elevation"
          title="Elevation"
          description="Stacked micro-offsets plus an inset hairline. Several tiny shadows read as light; one big blur reads as Material Design. Dark mode drops shadows entirely and climbs the surface ladder instead — switch the theme above to see it."
        >
          <Grid className="grid-cols-2 md:grid-cols-4">
            {ELEVATION.map((item) => (
              <div key={item.token} className={cn("rounded-lg bg-surface p-5", item.cls)}>
                <p className="text-body-sm font-medium text-ink">{item.token}</p>
                <Spec label="" value={item.use} />
              </div>
            ))}
          </Grid>
        </Section>

        {/* ── Motion ─────────────────────────────────────────────────────── */}
        <Section
          id="motion"
          title="Motion"
          description="Motion communicates state, never decorates. Exit is always faster than entrance. Springs are for celebration only — a bouncing page reads as a toy."
        >
          <Grid className="mb-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {MOTION.map((item) => (
              <div key={item.name} className="rounded-lg bg-surface p-4 shadow-e1">
                <p className="text-body-sm font-medium text-ink">{item.name}</p>
                <p className="text-price-sm tabular text-brand">{item.ms}ms</p>
                <Spec label="" value={item.use} />
              </div>
            ))}
          </Grid>

          <div className="grid gap-3 md:grid-cols-3">
            <MotionDemo title="Card lift" note="y −3px · scale 1.006">
              <motion.div
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                variants={cardHover}
                className="cursor-pointer rounded-lg bg-surface p-6 shadow-e1"
              >
                <ShoppingBag size={iconSize.xl} strokeWidth={ICON_STROKE} className="text-brand" />
                <p className="mt-3 text-body-sm text-ink">Hover me</p>
              </motion.div>
            </MotionDemo>

            <MotionDemo title="Button press" note="scale 0.975">
              <motion.button
                type="button"
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                variants={pressable}
                className="h-11 w-full rounded-md bg-brand px-5 text-button text-brand-fg"
              >
                Press me
              </motion.button>
            </MotionDemo>

            <MotionDemo title="Image zoom" note="scale 1.04 · 500ms">
              <motion.div
                initial="rest"
                whileHover="hover"
                className="aspect-[4/3] cursor-pointer overflow-hidden rounded-lg bg-surface-2"
              >
                <motion.div
                  variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
                  transition={{ duration: 0.5 }}
                  className="grid h-full w-full place-items-center bg-brand-tint"
                >
                  <Sparkles size={28} strokeWidth={ICON_STROKE} className="text-brand" />
                </motion.div>
              </motion.div>
            </MotionDemo>
          </div>
        </Section>

        {/* ── Icons ──────────────────────────────────────────────────────── */}
        <Section
          id="icons"
          title="Icons"
          description="Lucide at stroke 1.75 — Lucide's default of 2 is too heavy beside 15px button text. Sizes pair to control heights so icons sit on the cap height, not above it."
        >
          <div className="flex flex-wrap items-end gap-6 rounded-lg bg-surface p-6 shadow-e1">
            {(Object.entries(iconSize) as [string, number][]).map(([name, size]) => (
              <div key={name} className="text-center">
                <div className="grid h-12 place-items-center text-ink">
                  <Search size={size} strokeWidth={ICON_STROKE} />
                </div>
                <p className="text-caption text-muted">
                  {name} · {size}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {[Heart, Star, ShieldCheck, Tag, Zap, Sparkles].map((Icon, index) => (
              <span
                key={index}
                className="grid h-11 w-11 place-items-center rounded-md bg-surface text-ink-2 shadow-e1"
              >
                <Icon size={iconSize.md} strokeWidth={ICON_STROKE} />
              </span>
            ))}
          </div>
        </Section>

        {/* ── Layout ─────────────────────────────────────────────────────── */}
        <Section
          id="layout"
          title="Layout"
          description="Two columns on mobile is deliberate — one wide column shows too few items per screen for browsing to feel productive."
        >
          <div className="grid gap-3 md:grid-cols-2">
            <TokenTable
              title="Breakpoints"
              rows={Object.entries(breakpoints).map(([k, v]) => [k, `${v}px`])}
            />
            <TokenTable
              title="Control heights"
              rows={Object.entries(controlHeight).map(([k, v]) => [k, `${v}px`])}
            />
            <TokenTable
              title="Grid"
              rows={[
                ["columns", `${grid.columns.base} / ${grid.columns.md} / ${grid.columns.xl}`],
                ["gutter", `${grid.gutter.base}px / ${grid.gutter.md}px`],
                ["card aspect", aspect.card],
              ]}
            />
            <TokenTable
              title="Z-index"
              rows={Object.entries(zIndex).map(([k, v]) => [k, String(v)])}
            />
          </div>

          <h3 className="mb-3 mt-10 text-title text-ink">Listing grid</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="overflow-hidden rounded-lg bg-surface shadow-e1">
                <div
                  className="skeleton w-full"
                  style={{ aspectRatio: aspect.card }}
                  aria-hidden
                />
                <div className="space-y-1.5 p-3">
                  <p className="text-price-md tabular text-ink">₹2,200</p>
                  <p className="clamp-2 text-body-sm text-ink-2">Hero Sprint cycle, 26 inch</p>
                  <p className="text-caption text-muted">IIT Bombay · 4h ago</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}

/* ── Local helpers ────────────────────────────────────────────────────────*/

function MotionDemo({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line p-4">
      <p className="mb-1 text-body-sm font-medium text-ink">{title}</p>
      <Spec label="" value={note} />
      <div className="mt-4">{children}</div>
    </div>
  );
}

function TokenTable({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="overflow-hidden rounded-lg bg-surface shadow-e1">
      <p className="border-b border-line px-4 py-3 text-body-sm font-semibold text-ink">{title}</p>
      <dl className="divide-y divide-line">
        {rows.map(([key, value]) => (
          <div key={key} className="flex justify-between px-4 py-2.5">
            <dt className="text-body-sm text-muted">{key}</dt>
            <dd className="text-body-sm tabular text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
