"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin phosphor scroll-progress line at the very top of the viewport.
 * Driven by framer-motion's scroll progress + a soft spring so it doesn't
 * jitter at high scroll velocity.
 */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 22,
    mass: 0.4,
    restDelta: 0.0005,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[80] bg-[var(--phosphor)] opacity-70 pointer-events-none shadow-[0_0_10px_var(--phosphor-glow)]"
    />
  );
};
