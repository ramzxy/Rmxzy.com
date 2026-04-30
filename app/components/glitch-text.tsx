"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  className?: string;
  /** Total scramble duration in ms. */
  duration?: number;
};

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#__01░▒▓█";

/**
 * Hover the wrapping span and the text scrambles for a moment, with each
 * character resolving left-to-right. Cheap: only runs while hovered, single
 * RAF that bails on mouseleave.
 */
export const GlitchText = ({ text, className, duration = 380 }: Props) => {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);

  // If the source text changes (locale, prop), reset the displayed string.
  useEffect(() => {
    setDisplay(text);
  }, [text]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const tick = () => {
    const elapsed = performance.now() - startRef.current;
    const progress = Math.min(1, elapsed / duration);
    const result = Array.from(text)
      .map((ch, i) => {
        if (ch === " ") return ch;
        const charReveal = i / Math.max(1, text.length);
        if (progress >= charReveal) return ch;
        return SCRAMBLE_CHARS[
          Math.floor(Math.random() * SCRAMBLE_CHARS.length)
        ];
      })
      .join("");
    setDisplay(result);
    if (progress < 1) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      rafRef.current = null;
    }
  };

  const start = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setDisplay(text);
  };

  return (
    <span
      className={className}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
    >
      {display}
    </span>
  );
};
