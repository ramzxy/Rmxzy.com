"use client";

import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./site-footer.module.css";

const chapters = [
  { index: "01", name: "work", href: "/#work" },
  { index: "02", name: "projects", href: "/#projects" },
  { index: "03", name: "notes", href: "/blog" },
  { index: "04", name: "about", href: "/#about" },
];

const faces = ["^_^", ">_<", "o_o", "•_•", "x_x", "*_*", "@_@", "~_~"];

function FooterFace() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const advance = () => setIndex((current) => (current + 1) % faces.length);

  useEffect(() => {
    if (reduceMotion) return;
    const interval = window.setInterval(advance, 5200);
    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  return (
    <button
      type="button"
      className={styles.face}
      onClick={advance}
      aria-label="Change the footer face"
    >
      <span aria-hidden>[ {faces[index]} ]</span>
    </button>
  );
}

export function SiteFooter() {
  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.indexRow}>
          <Link href="/" className={styles.wordmark} aria-label="rmxzy home">
            RMXZY
          </Link>
          <nav className={styles.chapters} aria-label="Footer navigation">
            {chapters.map((chapter) => (
              <Link key={chapter.index} href={chapter.href}>
                <span>{chapter.index}</span>
                <strong>{chapter.name}</strong>
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.colophon}>
          <span>© {new Date().getFullYear()} Ilia Mirzaali</span>
          <span className={styles.typeNote}>Set in Whyte Inktrap</span>
          <FooterFace />
          <div className={styles.utilities}>
            <a href="mailto:me@rmxzy.com">email</a>
            <a href="/feed.xml">rss</a>
            <button type="button" onClick={backToTop}>top ↑</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
