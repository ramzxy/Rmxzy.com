"use client";

import { useScroll, type MotionValue } from "framer-motion";
import { createContext, useContext, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ArticleProgressContext = createContext<MotionValue<number> | null>(null);

export function useArticleReadingProgress() {
  return useContext(ArticleProgressContext);
}

export function ArticleReadingFrame({ children }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start 72%", "end 82%"],
  });

  return (
    <ArticleProgressContext.Provider value={scrollYProgress}>
      <div ref={frameRef} className="article-reading-frame">{children}</div>
    </ArticleProgressContext.Provider>
  );
}
