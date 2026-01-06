"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Separate springs for dot (fast/instant) and ring (smooth/slow)
  const dotSpringConfig = { damping: 25, stiffness: 1000, mass: 0.2 }; // Higher stiffness = less lag
  const ringSpringConfig = { damping: 25, stiffness: 300, mass: 0.5 }; // Lower stiffness = nice trail

  const dotX = useSpring(cursorX, dotSpringConfig);
  const dotY = useSpring(cursorY, dotSpringConfig);
  
  const ringX = useSpring(cursorX, ringSpringConfig);
  const ringY = useSpring(cursorY, ringSpringConfig);

  useEffect(() => {
    // Only show on desktop (devices with fine pointer)
    const isPointerFine = window.matchMedia("(pointer: fine)").matches;
    
    if (!isPointerFine) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        !!target.closest("a") ||
        !!target.closest("button") ||
        target.getAttribute("role") === "button" ||
        window.getComputedStyle(target).cursor === "pointer";

      setIsPointer(isClickable);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.body.classList.add("has-custom-cursor");

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.body.classList.remove("has-custom-cursor");
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Main cursor dot - Fast Response */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference hidden md:block"
        style={{
          x: dotX,
          y: dotY,
        }}
      >
        <motion.div
          className="relative"
          style={{ translateX: "-50%", translateY: "-50%" }}
          animate={{
            scale: isPointer ? 2.5 : 1,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
        >
          {/* Inner dot */}
          <div 
            className="w-3 h-3 rounded-full bg-[var(--cursor-color)]"
            style={{
              boxShadow: isPointer 
                ? "0 0 20px var(--phosphor-glow), 0 0 40px var(--phosphor-glow)" 
                : "none"
            }}
          />
        </motion.div>
      </motion.div>

      {/* Trailing ring - Smooth Follow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: ringX,
          y: ringY,
        }}
      >
        <motion.div
          className="relative w-10 h-10 rounded-full border border-[var(--cursor-color)]"
          style={{ translateX: "-50%", translateY: "-50%" }}
          animate={{
            scale: isPointer ? 1.5 : 1,
            opacity: isVisible ? 0.4 : 0,
            borderWidth: isPointer ? "2px" : "1px",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </motion.div>
    </>
  );
};
