"use client";

// Motion primitives for DealNote, built on Motion (motion.dev, npm
// `motion` 14.14.0, MIT, formerly Framer Motion), imported from
// `motion/react`. One file, three effects, nothing else:
//
// - Reveal: fade + 12px rise, 250ms, once, when scrolled into view
//   (Loop 5: review-animations sub-300ms rule + userinterface-wiki
//   timing-under-300ms; was 350ms in Loop 4).
//   /terms and /privacy use a CSS-only opacity fade instead (`.fade-in`
//   in globals.css) so those pages carry no Motion JS at all.
// - CountUp: number counter, 250ms, adapted from the React Bits CountUp pattern
//   (reactbits.dev/text-animations/count-up): a MotionValue animated on
//   first view, rounded through useTransform. React Bits ships no package;
//   the pattern is re-implemented here against Motion, not copied verbatim
//   (the component source tab on reactbits.dev is JS-rendered and could
//   not be fetched from this sandbox).
// - SpotlightCard: React Bits SpotlightCard pattern, restrained to one
//   faint pink wash that follows the pointer on the pricing card only.
//   No glow, no color gradient as decoration.
//
// Reduced motion: <MotionConfig reducedMotion="user"> in the layout
// disables transform/layout animation for users who ask for it, while
// opacity still animates; CountUp jumps straight to the final value.
// Every wrapper carries class `motion-fade` so the print stylesheet can
// force final state (opacity 1, no transform) — print and PDF output
// must never show a half-animated page. PDFs use lib/pdf-html.ts and
// never touch this file.

import { useEffect, useRef, type ReactNode } from "react";
import {
  animate,
  MotionConfig,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

// Strong ease-out per review-animations STANDARDS (cubic-bezier 0.23, 1,
// 0.32, 1); the built-in "easeOut" is too weak. Duration 250ms per the
// sub-300ms UI rule (Loop 5, was 350ms in Loop 4).
const DURATION = 0.25;
const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: DURATION, ease: EASE }}>
      {children}
    </MotionConfig>
  );
}

/** Fade + small rise when scrolled into view. One shot, 250ms max. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className ? `motion-fade ${className}` : "motion-fade"}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: DURATION, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container: children wrapped in <StaggerItem> enter 40ms apart
    (Loop 5: userinterface-wiki physics-no-excessive-stagger wants under
    50ms; review-animations allows 30-80ms; was 70ms in Loop 4). */
export function Stagger({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="motion-fade"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="motion-fade"
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: DURATION } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Animated number counter (React Bits CountUp pattern, see header).
 * `immediate` animates on mount instead of waiting for the element to
 * scroll into view. Use it for headline numbers (the audit score):
 * with the inView gate the score read "0" on load whenever the card
 * sat just below the fold (Neon recheck, 28 Nov 2026: score card top
 * 820px in an 800px viewport, counter stuck at 0 until scrolled to). */
export function CountUp({ to, immediate = false }: { to: number; immediate?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-40px" });
  const inView = immediate || seen;
  const reduce = useReducedMotion();
  const value = useMotionValue(reduce ? to : 0);
  // Ceiling, not rounding: the counter must land cleanly on the final
  // value instead of flashing the value below it at the end of the
  // animation (Neon whole-site audit P2-1: the sample score read 82
  // before settling on 83). The final value is exact either way.
  const rounded = useTransform(value, (v) => String(Math.ceil(v)));
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      value.set(to);
      return;
    }
    const controls = animate(value, to, { duration: DURATION, ease: EASE });
    return () => controls.stop();
  }, [inView, reduce, to, value]);
  return (
    <motion.span ref={ref} className="motion-fade">
      {rounded}
    </motion.span>
  );
}

/** One faint pink wash following the pointer. Pricing card only. */
export function SpotlightCard({ children, className }: { children: ReactNode; className?: string }) {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const background = useMotionTemplate`radial-gradient(240px circle at ${x}px ${y}px, rgb(190 24 93 / 0.07), transparent 70%)`;
  return (
    <motion.div
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onMouseLeave={() => {
        x.set(-400);
        y.set(-400);
      }}
    >
      <motion.div
        aria-hidden
        className="spotlight-overlay"
        style={{ position: "absolute", inset: 0, background, pointerEvents: "none" }}
      />
      <div style={{ position: "relative" }}>{children}</div>
    </motion.div>
  );
}
