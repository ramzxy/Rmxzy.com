"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Preview = {
  title: string;
  description: string;
  image?: string;
};

const knownPreviews: Record<string, Preview> = {
  "github.com/ramzxy/quarto": {
    title: "ChokerJoker / Quarto",
    description: "The award-winning Quarto solver and its full source code.",
    image: "/images/quarto.jpg",
  },
  "github.com/ramzxy/ilia.beer": {
    title: "ilia.beer on GitHub",
    description: "Source for the buy-me-a-beer platform and video pipeline.",
    image: "/images/beer.png",
  },
  "ilia.beer": {
    title: "ilia.beer",
    description: "Buy Ilia a beer and get a personal video toast in return.",
    image: "/images/beer.png",
  },
  "2025.bapc.eu": {
    title: "BAPC 2025",
    description: "The 2025 Benelux Algorithm Programming Contest.",
  },
};

function previewFor(url: string): { domain: string; preview: Preview } {
  try {
    const parsed = new URL(url);
    const key = `${parsed.hostname.replace(/^www\./, "")}${parsed.pathname.replace(/\/$/, "")}`;
    const domain = parsed.hostname.replace(/^www\./, "");
    return {
      domain,
      preview: knownPreviews[key] ?? knownPreviews[domain] ?? {
        title: domain,
        description: "Open this source in a new tab.",
      },
    };
  } catch {
    return {
      domain: url,
      preview: { title: url, description: "Open this source in a new tab." },
    };
  }
}

export function LinkPreview({ url, children }: { url: string; children: ReactNode }) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const tooltipId = useId();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const { domain, preview } = previewFor(url);

  const show = () => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (!rect) return;
    const halfCard = Math.min(164, window.innerWidth / 2 - 12);
    setPosition({
      left: Math.max(halfCard, Math.min(window.innerWidth - halfCard, rect.left + rect.width / 2)),
      top: rect.top - 12,
    });
    setOpen(true);
  };

  return (
    <span className="link-preview-anchor">
      <a
        ref={anchorRef}
        href={url}
        target="_blank"
        rel="noreferrer"
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={show}
        onMouseLeave={() => setOpen(false)}
        onFocus={show}
        onBlur={() => setOpen(false)}
      >
        {children}
      </a>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
            <motion.span
              id={tooltipId}
              role="tooltip"
              className="link-preview-card"
              style={{ left: position.left, top: position.top }}
              initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="link-preview-card__bar">
                <span>{domain}</span>
                <span aria-hidden>↗</span>
              </span>
              {preview.image ? (
                <span className="link-preview-card__image">
                  <img src={preview.image} alt="" />
                </span>
              ) : (
                <span className="link-preview-card__fallback" aria-hidden>
                  <span>$ open {domain}</span>
                  <i />
                  <i />
                  <i />
                </span>
              )}
              <span className="link-preview-card__copy">
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

