/**
 * Animation timings shared across multiple sections.
 *
 * Per-component GSAP timeline tuning (one-off durations/easings inside a single
 * useEffect) intentionally stays inline — those values describe one specific
 * motion and don't benefit from centralization. This file captures the values
 * that repeat across components or read as configuration rather than motion.
 */

/** Per-item stagger delay (ms) for `<Reveal delay={index * N} />` grids. */
export const REVEAL_STAGGER_MS = {
  CERTIFICATION: 60,
  INSIGHT: 90,
  GLOBAL_PRESENCE: 70,
  PRODUCT_PREVIEW: 90,
  MANIFESTO_PRIMARY: 80,
  MANIFESTO_SECONDARY: 160,
} as const

/** IntersectionObserver thresholds. */
export const INTERSECTION_THRESHOLD = {
  /** When a reveal/count-up element is considered visible enough to trigger. */
  REVEAL: 0.4,
} as const

/** Stats row count-up animation duration (ms). */
export const STATS_COUNTUP_DURATION_MS = 1600

/** Scroll distance (px) past which the site header switches to its solid state. */
export const SCROLL_HEADER_THRESHOLD_PX = 24

/** Marquee strip — one full loop of the scroll-velocity-reactive band (seconds). */
export const MARQUEE_LOOP_SECONDS = 24
