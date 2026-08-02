"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import type { TocItem } from "../../../lib/blog";
import { useArticleReadingProgress } from "./article-reading-frame";

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const fallbackProgress = useMotionValue(0);
  const readingProgress = useArticleReadingProgress() ?? fallbackProgress;

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
      { rootMargin: "-15% 0px -72% 0px", threshold: [0, 1] },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav className="article-toc" aria-label="On this page">
      <div className="article-toc__thread" aria-hidden>
        <span />
        <motion.i style={{ scaleY: readingProgress }} />
      </div>
      <span className="article-toc__title">on this page</span>
      <ol>
        {items.map((item) => (
          <li key={item.id} data-depth={item.depth}>
            <a href={`#${item.id}`} className={activeId === item.id ? "is-active" : undefined}>
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
