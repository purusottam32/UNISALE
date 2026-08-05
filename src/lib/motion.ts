import type { Transition, Variants } from "framer-motion";
import { duration, easing } from "./design-tokens";

/**
 * Motion presets.
 *
 * Motion here communicates state, never decorates. Three rules hold
 * everywhere:
 *
 *   1. Exit is always faster than entrance — the user has already decided.
 *   2. Springs are for celebration only. Navigation uses eased tweens;
 *      a bouncing page reads as a toy.
 *   3. Movement stays under ~4px and ~1%. Airbnb-scale, not Dribbble-scale.
 *
 * Reduced motion is handled globally by `<MotionProvider>`, so individual
 * components never branch on it.
 */

/* ── Transitions ───────────────────────────────────────────────────────────*/

export const transitions = {
  /** Default for almost everything. */
  base: { duration: duration.base, ease: easing.out },
  /** Hover, colour, opacity — fast enough to feel like a direct response. */
  fast: { duration: duration.fast, ease: easing.standard },
  /** Press feedback. */
  instant: { duration: duration.instant, ease: easing.standard },
  /** Elements arriving from off-screen or from nothing. */
  entrance: { duration: duration.entrance, ease: easing.entrance },
  /** Anything leaving. */
  exit: { duration: duration.exit, ease: easing.exit },

  /** Drawers and bottom sheets. Physical, because the user drags them. */
  sheet: { type: "spring", stiffness: 380, damping: 38, mass: 0.9 },
  /** Shared-layout morphs (`layoutId`). */
  layout: { duration: duration.base, ease: easing.out },
  /**
   * Celebration only — listing published, deal confirmed, rating submitted.
   * The overshoot is the point; never use it for navigation.
   */
  delight: { type: "spring", stiffness: 500, damping: 22 },
} satisfies Record<string, Transition>;

/* ── Primitive variants ────────────────────────────────────────────────────*/

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transitions.base },
  exit: { opacity: 0, transition: transitions.exit },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: transitions.entrance },
  exit: { opacity: 0, y: 4, transition: transitions.exit },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  show: { opacity: 1, scale: 1, transition: transitions.entrance },
  exit: { opacity: 0, scale: 0.98, transition: transitions.exit },
};

/**
 * Staggered reveal for grids and lists.
 *
 * Capped at six children: beyond that the last item's delay exceeds ~200ms
 * and the grid reads as broken rather than choreographed. Pass the child
 * index and let anything past the cap arrive together.
 */
export const STAGGER_CAP = 6;
export const STAGGER_STEP = 0.035;

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: STAGGER_STEP, delayChildren: 0.02 },
  },
};

export const staggerItem: Variants = fadeUp;

/** Delay for item `index`, flattening past the cap. */
export const staggerDelay = (index: number) =>
  Math.min(index, STAGGER_CAP) * STAGGER_STEP;

/* ── Interaction presets ───────────────────────────────────────────────────*/

/**
 * Card lift. 3px and 0.6% — deliberately restrained. The card should feel
 * like it has been picked up, not launched.
 */
export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: { y: -3, scale: 1.006, transition: transitions.fast },
  tap: { scale: 0.995, transition: transitions.instant },
};

/**
 * Image zoom inside a fixed frame. The photo moves; the frame never does.
 * Slow (500ms) because a fast zoom on a photograph reads as a glitch.
 */
export const imageZoom = {
  rest: { scale: 1 },
  hover: { scale: 1.04, transition: { duration: 0.5, ease: easing.out } },
};

/** Button press. Scale only — buttons must not move under the cursor. */
export const pressable = {
  rest: { scale: 1 },
  hover: { scale: 1.01, transition: transitions.fast },
  tap: { scale: 0.975, transition: transitions.instant },
};

/** Icon-only controls can take a slightly deeper press; they are smaller. */
export const pressableIcon = {
  rest: { scale: 1 },
  hover: { scale: 1.06, transition: transitions.fast },
  tap: { scale: 0.92, transition: transitions.instant },
};

/* ── Overlay variants ──────────────────────────────────────────────────────*/

export const scrim: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.fast } },
  exit: { opacity: 0, transition: { duration: duration.exit } },
};

export const sheetUp: Variants = {
  hidden: { y: "100%" },
  show: { y: 0, transition: transitions.sheet },
  exit: { y: "100%", transition: { duration: duration.base, ease: easing.exit } },
};

export const dialogIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: transitions.entrance },
  exit: { opacity: 0, scale: 0.98, y: 4, transition: transitions.exit },
};

/** Dropdowns and popovers grow from their trigger edge. */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: -4 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: duration.fast, ease: easing.out } },
  exit: { opacity: 0, scale: 0.98, y: -2, transition: transitions.exit },
};

export const toastIn: Variants = {
  hidden: { opacity: 0, y: -12, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: transitions.entrance },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: transitions.exit },
};

/* ── Page transitions ──────────────────────────────────────────────────────
   Deliberately minimal: a marketplace is browsed at speed, and a page
   transition the user has to wait through is a tax on every navigation. */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easing.out } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

/* ── Scroll reveal ─────────────────────────────────────────────────────────*/

/**
 * Props for reveal-on-scroll sections. `once: true` matters — re-animating
 * on every scroll-by is the single most common way motion becomes annoying.
 * The negative margin fires the reveal slightly before the element is fully
 * in view, so it has finished by the time the user is looking at it.
 */
export const revealOnScroll = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, margin: "-64px" },
  variants: fadeUp,
} as const;
