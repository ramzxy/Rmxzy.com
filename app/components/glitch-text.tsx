"use client";

import { useEffect, useRef, useState } from "react";

// No block elements or wide glyphs; they swamp the character they stand in for.
const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#%01";

const pick = () =>
  SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];

type Props = {
  text: string;
  className?: string;
  /** ms between glyph swaps. */
  interval?: number;
  /** Characters either side of the pointer to disturb. 0 = only the hovered one. */
  radius?: number;
};

/**
 * Scrambles the character under the pointer, tailing off over `radius`.
 * Substitutes are never written into the document text — the real character
 * is hidden in place and the stand-in painted over it by `.glitch-char` in
 * global.css, so the line can never reflow under the cursor.
 */
export const GlitchText = ({
  text,
  className,
  interval = 110,
  radius = 0,
}: Props) => {
  const chars = Array.from(text);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (active < 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Spaces aren't given elements, so they simply drop out of the band and
    // the indices either side of them stay correct.
    const band: { node: HTMLSpanElement; chance: number }[] = [];
    for (let offset = -radius; offset <= radius; offset++) {
      const node = charRefs.current[active + offset];
      if (!node) continue;
      band.push({
        node,
        // 1 at the centre, tailing to 0 at the edge of the band.
        chance: 1 - Math.abs(offset) / (radius + 1),
      });
    }

    const clear = (node: HTMLSpanElement) => {
      delete node.dataset.scrambling;
      node.style.removeProperty("--glitch-glyph");
    };

    const tick = () => {
      for (const { node, chance } of band) {
        // Outer characters spend part of each tick showing their real glyph,
        // which is what makes the disturbance fade outwards instead of
        // ending at a hard edge.
        if (Math.random() < chance) {
          node.dataset.scrambling = "";
          // JSON.stringify yields a correctly quoted and escaped CSS string.
          node.style.setProperty("--glitch-glyph", JSON.stringify(pick()));
        } else {
          clear(node);
        }
      }
    };

    tick();
    const id = window.setInterval(tick, interval);

    return () => {
      window.clearInterval(id);
      for (const { node } of band) clear(node);
    };
  }, [active, interval, radius, text]);

  return (
    <span
      className={className}
      onPointerMove={(event) => {
        // Touch has no hover state to speak of — a tap would strand
        // characters mid-scramble until the next interaction.
        if (event.pointerType !== "mouse") return;
        const index = (event.target as HTMLElement).dataset?.glitchIndex;
        const next = index === undefined ? -1 : Number(index);
        setActive((previous) => (previous === next ? previous : next));
      }}
      onPointerLeave={() => setActive(-1)}
    >
      {chars.map((char, index) =>
        // Spaces stay as plain text nodes: nothing to scramble, and keeping
        // them out of spans leaves normal whitespace collapsing and line
        // breaking exactly as they were.
        char === " " ? (
          " "
        ) : (
          <span
            key={index}
            className="glitch-char"
            data-glitch-index={index}
            ref={(node) => {
              charRefs.current[index] = node;
            }}
          >
            {char}
          </span>
        ),
      )}
    </span>
  );
};
