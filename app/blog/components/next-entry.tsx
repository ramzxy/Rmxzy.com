"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type CSSProperties } from "react";
import type { BlogPostSummary } from "../../../lib/blog";

type Props = {
  post: BlogPostSummary;
  direction: "older" | "newer";
};

function shortDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function NextEntry({ post, direction }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });
  const mediaScale = useTransform(scrollYProgress, [0, 0.75], [0.94, 1]);
  const contentY = useTransform(scrollYProgress, [0.15, 0.78], [36, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.15, 0.58], [0.35, 1]);

  return (
    <section
      ref={sectionRef}
      className="next-entry"
      style={{ "--next-accent": post.accent } as CSSProperties}
      aria-labelledby="next-entry-title"
    >
      <Link href={`/blog/${post.slug}`} className="next-entry__link">
        <motion.div
          className="next-entry__media"
          style={{ scale: reduceMotion ? 1 : mediaScale }}
        >
          {post.thumbnail && (
            <Image
              src={post.thumbnail}
              alt=""
              fill
              quality={95}
              sizes="100vw"
            />
          )}
          <div className="next-entry__shade" />
        </motion.div>

        <motion.div
          className="next-entry__content"
          style={{
            y: reduceMotion ? 0 : contentY,
            opacity: reduceMotion ? 1 : contentOpacity,
          }}
        >
          <div className="next-entry__meta">
            <span>{direction === "older" ? "next entry" : "back toward newer"}</span>
            <span>{post.categories[0] ?? "Writing"}</span>
            <time dateTime={post.publishedAt}>{shortDate(post.publishedAt)}</time>
          </div>
          <div className="next-entry__title-row">
            <h2 id="next-entry-title">{post.title}</h2>
            <span className="next-entry__arrow" aria-hidden>↗</span>
          </div>
          <p>{post.description}</p>
        </motion.div>
      </Link>
    </section>
  );
}
