"use client";

// Motion primitives for DealNote, built on Motion (motion.dev, npm
// `motion` 14.14.0, MIT, formerly Framer Motion), imported from
// `motion/react`. One file, three effects, nothing else:
//
// - Reveal: fade + 12px rise, 350ms, once, when scrolled into view.
//   /terms and /privacy use a CSS-only opacity fade instead (`.fade-in`
//   in globals.css) so those pages carry no Motion JS at all.
// - CountUp: number counter, adapted from the React Bits CountUp pattern
//   (reactbits.dev/text-animations/count-up): a MotionValue animated on
//   first view, rounded through useTransform. React Bits ships no package;
//   the pattern is re-implemented here against Motion, not copied verbatim
//   (the component source tab on reactbits.dev is JS-rendered and could
//   not be fetched from this sandbox).
// - SpotlightCard: React Bits SpotlightCard pattern, restrained to one
//   faint teal wash that follows the pointer on the pricing card only.
//   No glow, no colour gradient as decoration.
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

const DURATION = 0.35;

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: DURATION, ease: "easeOut" }}>
      {children}
    </MotionConfig>
  );
}

/** Fade + small rise when scrolled into view. One shot, 350ms max. */
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

/** Stagger container: children wrapped in <StaggerItem> enter 70ms apart. */
export function Stagger({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="motion-fade"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
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

/** Animated number counter (React Bits CountUp pattern, see header). */
export function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const value = useMotionValue(reduce ? to : 0);
  const rounded = useTransform(value, (v) => String(Math.round(v)));
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      value.set(to);
      return;
    }
    const controls = animate(value, to, { duration: DURATION, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, reduce, to, value]);
  return (
    <motion.span ref={ref} className="motion-fade">
      {rounded}
    </motion.span>
  );
}

/** One faint teal wash following the pointer. Pricing card only. */
export function SpotlightCard({ children, className }: { children: ReactNode; className?: string }) {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const background = useMotionTemplate`radial-gradient(240px circle at ${x}px ${y}px, rgb(15 118 110 / 0.07), transparent 70%)`;
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
