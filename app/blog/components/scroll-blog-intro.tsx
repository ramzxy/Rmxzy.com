"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { BlogPostSummary } from "../../../lib/blog";

function introDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function ScrollBlogIntro({ latest }: { latest: BlogPostSummary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const mediaScale = useTransform(scrollYProgress, [0, 0.72], [0.68, 1]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.3, 0.58], [1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.58], [0, -70]);
  const latestOpacity = useTransform(scrollYProgress, [0.38, 0.68, 1], [0, 1, 1]);
  const latestY = useTransform(scrollYProgress, [0.38, 0.72], [48, 0]);
  const shadeOpacity = useTransform(scrollYProgress, [0, 0.58, 1], [0.42, 0.22, 0.55]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className={`scroll-blog-intro${reduceMotion ? " is-reduced" : ""}`}
      aria-labelledby="blog-intro-title"
    >
      <div className="scroll-blog-intro__sticky">
        <motion.div
          className="scroll-blog-intro__media"
          style={{
            scale: reduceMotion ? 1 : mediaScale,
          }}
        >
          {latest.thumbnail && (
            <Image
              src={latest.thumbnail}
              alt=""
              fill
              priority
              quality={95}
              sizes="100vw"
            />
          )}
          <motion.div
            className="scroll-blog-intro__shade"
            style={{ opacity: reduceMotion ? 0.58 : shadeOpacity }}
          />
          <div className="scroll-blog-intro__scanline" aria-hidden />
        </motion.div>

        <motion.div
          className="scroll-blog-intro__copy"
          style={{
            opacity: reduceMotion ? 1 : introOpacity,
            y: reduceMotion ? 0 : introY,
          }}
        >
          <span className="scroll-blog-intro__path">~/rmxzy/writing</span>
          <h1 id="blog-intro-title">Things worth writing down.</h1>
          <p>Systems, security, and projects that got a little out of hand.</p>
        </motion.div>

        <motion.div
          className="scroll-blog-intro__latest"
          style={{
            opacity: reduceMotion ? 1 : latestOpacity,
            y: reduceMotion ? 0 : latestY,
          }}
        >
          <div className="scroll-blog-intro__latest-meta">
            <span>latest entry</span>
            <time dateTime={latest.publishedAt}>{introDate(latest.publishedAt)}</time>
            <span>{latest.readingTime} min</span>
          </div>
          <Link href={`/blog/${latest.slug}`}>
            <h2>{latest.title}</h2>
            <span>read entry <span aria-hidden>→</span></span>
          </Link>
        </motion.div>

        {!reduceMotion && (
          <div className="scroll-blog-intro__prompt" aria-hidden>
            <span>scroll to open</span>
            <div><motion.i style={{ scaleY: progressScale }} /></div>
          </div>
        )}
      </div>
    </section>
  );
}
