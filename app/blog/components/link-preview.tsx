"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import styles from "./link-preview.module.css";

type Preview = {
  title: string;
  description: string;
  image?: string;
};

type Placement = "above" | "below";

const knownPreviews: Record<string, Preview> = {
  "en.wikipedia.org/wiki/Israel": {
    title: "Israel — Wikipedia",
    description: "History, geography, politics, and culture of Israel.",
  },
  "en.wikipedia.org/wiki/Setar": {
    title: "Setar — Wikipedia",
    description: "A traditional Persian stringed instrument played with the index finger.",
  },
  "github.com/ramzxy/quarto": {
    title: "ChokerJoker / Quarto",
    description: "The Quarto solver, game engine, and its full source code.",
    image: "/images/quarto.webp",
  },
  "github.com/ramzxy/ilia.beer": {
    title: "ilia.beer on GitHub",
    description: "Source for the buy-me-a-beer platform and video pipeline.",
    image: "/images/beer.webp",
  },
  "ilia.beer": {
    title: "ilia.beer",
    description: "Buy Ilia a beer and get a personal video toast in return.",
    image: "/images/ilia-beer-cover-v3.webp",
  },
  "2025.bapc.eu": {
    title: "BAPC 2025",
    description: "The 2025 Benelux Algorithm Programming Contest.",
  },
};

function previewFor(url: string): { domain: string; preview: Preview } {
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.replace(/^www\./, "");
    const key = `${domain}${parsed.pathname.replace(/\/$/, "")}`;

    return {
      domain,
      preview: knownPreviews[key] ?? knownPreviews[domain] ?? {
        title: domain,
        description: "Open the original page in a new tab.",
      },
    };
  } catch {
    return {
      domain: url,
      preview: {
        title: url,
        description: "Open the original page in a new tab.",
      },
    };
  }
}

export function LinkPreview({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<Placement>("above");
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const { domain, preview } = previewFor(url);

  const clearOpenTimer = () => {
    if (!openTimer.current) return;
    clearTimeout(openTimer.current);
    openTimer.current = null;
  };

  const show = (delay = 0) => {
    clearOpenTimer();

    const reveal = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;

      const halfCard = Math.min(176, window.innerWidth / 2 - 12);
      const nextPlacement: Placement = rect.top > Math.min(300, window.innerHeight * 0.42)
        ? "above"
        : "below";

      setPosition({
        left: Math.max(
          halfCard,
          Math.min(window.innerWidth - halfCard, rect.left + rect.width / 2),
        ),
        top: nextPlacement === "above" ? rect.top - 12 : rect.bottom + 12,
      });
      setPlacement(nextPlacement);
      setOpen(true);
    };

    if (delay === 0) reveal();
    else openTimer.current = setTimeout(reveal, delay);
  };

  const hide = () => {
    clearOpenTimer();
    setOpen(false);
  };

  useEffect(() => {
    return clearOpenTimer;
  }, []);

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const revealOffset = placement === "above" ? 8 : -8;
  const cardStyle = {
    left: position.left,
    top: position.top,
  } as CSSProperties;

  return (
    <span className={styles.anchor}>
      <a
        ref={anchorRef}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={() => show(90)}
        onMouseLeave={hide}
        onFocus={() => show()}
        onBlur={hide}
      >
        {children}
      </a>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.span
                id={tooltipId}
                role="tooltip"
                className={`${styles.card} ${styles[placement]}`}
                data-has-image={preview.image ? "true" : "false"}
                style={cardStyle}
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, y: revealOffset, scale: 0.985 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: revealOffset / 2, scale: 0.99 }
                }
                transition={{
                  duration: reduceMotion ? 0 : 0.18,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span className={styles.bar}>
                  <span>{domain}</span>
                  <span aria-hidden>↗</span>
                </span>

                {preview.image && (
                  <span className={styles.image} aria-hidden>
                    <img src={preview.image} alt="" />
                  </span>
                )}

                <span className={styles.copy}>
                  <strong>{preview.title}</strong>
                  <span>{preview.description}</span>
                </span>
              </motion.span>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </span>
  );
}
