"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type ArticleScrollIntroProps = {
  post: {
    slug: string;
    title: string;
    description: string;
    publishedAt: string;
    readingTime: number;
    thumbnail?: string;
    category: string;
  };
};

function introDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function ArticleScrollIntro({ post }: ArticleScrollIntroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const mediaScale = useTransform(scrollYProgress, [0, 0.72], [0.7, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.28, 0.58], [1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.58], [0, -64]);
  const detailsOpacity = useTransform(scrollYProgress, [0.38, 0.68, 1], [0, 1, 1]);
  const detailsY = useTransform(scrollYProgress, [0.38, 0.72], [44, 0]);
  const shadeOpacity = useTransform(scrollYProgress, [0, 0.58, 1], [0.52, 0.25, 0.62]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className={`article-scroll-intro${reduceMotion ? " is-reduced" : ""}`}
      aria-labelledby="article-intro-title"
    >
      <div className="article-scroll-intro__sticky">
        <motion.div
          className="article-scroll-intro__media"
          style={{ scale: reduceMotion ? 1 : mediaScale }}
        >
          {post.thumbnail && (
            <Image
              src={post.thumbnail}
              alt=""
              fill
              priority
              quality={95}
              sizes="100vw"
            />
          )}
          <motion.div
            className="article-scroll-intro__shade"
            style={{ opacity: reduceMotion ? 0.62 : shadeOpacity }}
          />
          <div className="article-scroll-intro__scanline" aria-hidden />
        </motion.div>

        <Link href="/blog" className="article-scroll-intro__back">
          <span aria-hidden>←</span> all writing
        </Link>

        <motion.div
          className="article-scroll-intro__title"
          style={{
            opacity: reduceMotion ? 1 : titleOpacity,
            y: reduceMotion ? 0 : titleY,
          }}
        >
          <span className="article-scroll-intro__path">~/rmxzy/writing/{post.slug}</span>
          <h1 id="article-intro-title">{post.title}</h1>
        </motion.div>

        <motion.div
          className="article-scroll-intro__details"
          style={{
            opacity: reduceMotion ? 1 : detailsOpacity,
            y: reduceMotion ? 0 : detailsY,
          }}
        >
          <div className="article-scroll-intro__meta">
            <span>{post.category}</span>
            <time dateTime={post.publishedAt}>{introDate(post.publishedAt)}</time>
            <span>{post.readingTime} min read</span>
          </div>
          <p>{post.description}</p>
        </motion.div>

        {!reduceMotion && (
          <div className="article-scroll-intro__prompt" aria-hidden>
            <span>scroll to read</span>
            <div><motion.i style={{ scaleY: progressScale }} /></div>
          </div>
        )}
      </div>
    </section>
  );
}
