"use client";

import { useScroll, type MotionValue } from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { TocItem } from "../../../lib/blog";

type Props = {
  items: TocItem[];
  children: ReactNode;
};

const ArticleProgressContext = createContext<MotionValue<number> | null>(null);

export function useArticleReadingProgress() {
  return useContext(ArticleProgressContext);
}

export function ArticleReadingFrame({ items, children }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start 72%", "end 82%"],
  });

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => Boolean(heading));

    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -70% 0px", threshold: [0, 1] },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId));
  const activeTitle = items[activeIndex]?.text ?? "Article";

  return (
    <ArticleProgressContext.Provider value={scrollYProgress}>
      <div ref={frameRef} className="article-reading-frame">
        {children}

        {items.length > 0 && (
          <nav className={`mobile-article-nav${open ? " is-open" : ""}`} aria-label="Article sections">
            <div className="mobile-article-nav__panel" id="mobile-article-sections">
              <ol>
                {items.map((item, index) => (
                  <li key={item.id} data-depth={item.depth}>
                    <a
                      href={`#${item.id}`}
                      className={activeId === item.id ? "is-active" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            <button
              type="button"
              className="mobile-article-nav__trigger"
              aria-expanded={open}
              aria-controls="mobile-article-sections"
              onClick={() => setOpen((current) => !current)}
            >
              <span className="mobile-article-nav__signal" aria-hidden />
              <span className="mobile-article-nav__current">
                <small>now reading</small>
                <strong>{activeTitle}</strong>
              </span>
              <span className="mobile-article-nav__count">
                {String(activeIndex + 1).padStart(2, "0")}/{String(items.length).padStart(2, "0")}
              </span>
              <span className="mobile-article-nav__toggle" aria-hidden>{open ? "×" : "+"}</span>
            </button>
          </nav>
        )}
      </div>
    </ArticleProgressContext.Provider>
  );
}
