/**
 * TypeScript mirror of the CSS token layer.
 *
 * These exist for the values JavaScript needs to *read* — motion timings for
 * Framer Motion, breakpoints for media-query hooks, sizing maps for component
 * variants. Colour, type and spacing are deliberately absent: those live in
 * CSS only, because duplicating them here would create two sources of truth
 * and guarantee drift.
 *
 * Anything here that also appears in `globals.css` must match it exactly.
 */

/* ── Motion ────────────────────────────────────────────────────────────────
   Cubic-bezier arrays, in the tuple form Framer Motion expects. */
export const easing = {
  /** The house curve. Decelerates hard, settles without overshoot. */
  out: [0.32, 0.72, 0, 1],
  /** Softer landing, for elements arriving from off-screen. */
  entrance: [0.16, 1, 0.3, 1],
  /** Symmetric — for things already on screen moving to a new position. */
  standard: [0.4, 0, 0.2, 1],
  /** Exits only. Never use for entrances; it reads as sluggish. */
  exit: [0.4, 0, 1, 1],
} as const;

export const duration = {
  instant: 0.1,
  fast: 0.16,
  base: 0.24,
  entrance: 0.3,
  sheet: 0.38,
  exit: 0.16,
} as const;

/* ── Layout ────────────────────────────────────────────────────────────────*/
export const breakpoints = {
  xs: 416,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const chrome = {
  topbarHeight: 64,
  tabbarHeight: 62,
  containerMax: 1240,
} as const;

/**
 * The listing grid. Two columns on mobile is deliberate — one wide column
 * shows too few items per screen for browsing to feel productive, and every
 * major marketplace converges on two.
 */
export const grid = {
  columns: { base: 2, md: 3, xl: 4 },
  gutter: { base: 12, md: 16 },
} as const;

export const zIndex = {
  base: 0,
  sticky: 20,
  chrome: 40,
  overlay: 60,
  modal: 70,
  toast: 90,
} as const;

/* ── Component sizing ──────────────────────────────────────────────────────
   One height scale shared by every control, so a Button, Input and Select
   placed side by side line up without anyone reaching for a magic number. */
export const controlHeight = {
  sm: 36,
  md: 44,
  lg: 52,
} as const;

export type ControlSize = keyof typeof controlHeight;

/**
 * Icon sizes, paired to control sizes. Lucide's default is 24, which is too
 * heavy next to 15px button text — 16/18 sits correctly on the cap height.
 */
export const iconSize = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  "2xl": 32,
} as const;

export type IconSize = keyof typeof iconSize;

/** Lucide strokes at 2 by default; 1.75 matches our type weight ceiling. */
export const ICON_STROKE = 1.75;

/** Which icon size belongs inside which control. */
export const controlIcon: Record<ControlSize, number> = {
  sm: iconSize.sm,
  md: iconSize.md,
  lg: iconSize.lg,
};

/* ── Media ─────────────────────────────────────────────────────────────────
   Listing photos are portrait: a 4:5 frame shows more of a cycle, a jacket
   or a stack of books than a square does, and it lets two columns fill a
   phone screen without cropping the subject out. */
export const aspect = {
  card: "4 / 5",
  hero: "4 / 3",
  thumb: "1 / 1",
  banner: "16 / 9",
} as const;
