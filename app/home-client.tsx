"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAsciiText, ansiShadow } from "react-ascii-text";
import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import type { BlogPostSummary } from "../lib/blog";
import { CommandPalette } from "./components/command-palette";
import { ScrollProgress } from "./components/scroll-progress";
import { SocialDock } from "./components/social-dock";
import { TerminalText } from "./components/terminal-text";
import { ThemeToggle } from "./components/theme-toggle";
import { featuredProjects } from "./data/projects";
import { work } from "./data/work";
import styles from "./home.module.css";

const Particles = dynamic(() => import("./components/particles"), { ssr: false });

type HomePost = Omit<BlogPostSummary, "searchText">;

const navigation = [
  { index: "01", name: "work", href: "#work" },
  { index: "02", name: "writing", href: "#writing" },
  { index: "03", name: "about", href: "#about" },
];

function shortDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <header className={styles.sectionHeading}>
      <motion.div
        className={styles.sectionHeadingMeta}
        initial={reduceMotion ? false : { opacity: 0, transform: "translateY(0.75rem)" }}
        whileInView={{ opacity: 1, transform: "translateY(0)" }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <span>{index}</span>
        <span>{eyebrow}</span>
      </motion.div>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, transform: "translateY(1.25rem)" }}
        whileInView={{ opacity: 1, transform: "translateY(0)" }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.55, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </motion.div>
    </header>
  );
}

export default function Home({ latestPosts }: { latestPosts: HomePost[] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [ambienceReady, setAmbienceReady] = useState(false);
  const reduceMotion = useReducedMotion();
  const asciiTextRef = useAsciiText({
    animationCharacters: "▒░█",
    animationCharacterSpacing: 1,
    animationDelay: 5000,
    animationDirection: "down",
    animationInterval: 20,
    animationLoop: !reduceMotion,
    animationSpeed: 80,
    font: ansiShadow,
    text: ["R M X Z Y"],
  }) as RefObject<HTMLPreElement>;

  useEffect(() => {
    if (reduceMotion) return;

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => setAmbienceReady(true), { timeout: 700 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(() => setAmbienceReady(true), 250);
    return () => globalThis.clearTimeout(timeoutId);
  }, [reduceMotion]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  return (
    <main id="main-content" className={styles.page}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <ScrollProgress />

      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo} aria-label="rmxzy home">
            rmxzy<span>_</span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Primary navigation">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <span>{item.index}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className={styles.headerTools}>
            <button
              type="button"
              className={styles.paletteButton}
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
            >
              <span>command</span>
              <kbd>Ctrl K</kbd>
            </button>
            <ThemeToggle />
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            className={styles.mobileNav}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            aria-label="Mobile navigation"
          >
            {navigation.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.045, duration: 0.25 }}
              >
                <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <span>{item.index}</span>
                  {item.name}
                </Link>
              </motion.div>
            ))}
            <Link
              href="mailto:me@rmxzy.com"
              className={styles.mobileContact}
              onClick={() => setMobileMenuOpen(false)}
            >
              me@rmxzy.com ↗
            </Link>
            <Link
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileResume}
              onClick={() => setMobileMenuOpen(false)}
            >
              resume ↗
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>

      <section className={styles.hero}>
        {!reduceMotion && ambienceReady && (
          <div className={styles.heroParticles} aria-hidden>
            <Particles className={styles.particleCanvas} quantity={220} />
          </div>
        )}

        <div className={styles.shell}>
          <motion.div
            className={styles.heroStatus}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span><i /> open to interesting work</span>
            <span>Enschede, NL · <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">resume ↗</Link></span>
          </motion.div>

          <motion.div
            className={styles.asciiStage}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="sr-only">Ilia Mirzaali — software engineer and hacker, known online as rmxzy</h1>
            <pre
              ref={reduceMotion ? undefined : asciiTextRef}
              aria-label="rmxzy"
              className={styles.asciiWordmark}
            >{`██████╗ ███╗   ███╗██╗  ██╗███████╗██╗   ██╗
██╔══██╗████╗ ████║╚██╗██╔╝╚══███╔╝╚██╗ ██╔╝
██████╔╝██╔████╔██║ ╚███╔╝   ███╔╝  ╚████╔╝
██╔══██╗██║╚██╔╝██║ ██╔██╗  ███╔╝    ╚██╔╝
██║  ██║██║ ╚═╝ ██║██╔╝ ██╗███████╗   ██║
╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝`}</pre>

            <div className={styles.heroTagline}>
              {reduceMotion ? (
                <span>hacker · systems engineer · fullstack</span>
              ) : (
                <TerminalText text="hacker · systems engineer · fullstack" speed={40} delay={900} />
              )}
            </div>

            <SocialDock className={styles.heroSocialDock} />
          </motion.div>

          <Link href="#work" className={styles.scrollCue}>
            <span>next</span>
            <motion.i
              aria-hidden
              animate={reduceMotion ? undefined : { y: [0, 3, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
            >↓</motion.i>
            <strong>work</strong>
          </Link>
        </div>
      </section>

      <section id="work" className={styles.section}>
        <div className={styles.shell}>
          <SectionHeading
            index="01"
            eyebrow="selected work"
            title="Built, shipped, and still alive."
            description="Security work, public products, and low-level systems that made it past the prototype."
          />

          <div className={styles.workList}>
            {work.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={item.url} target="_blank" rel="noopener noreferrer" className={styles.workRow}>
                  <span className={styles.rowIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <div className={styles.rowTitle}>
                    <span>{item.role}</span>
                    <h3>{item.title}</h3>
                  </div>
                  <div className={styles.rowSummary}>
                    <p>{item.description}</p>
                    <div className={styles.rowTags}>{item.tech.slice(0, 3).map((tech) => <span key={tech}>{tech}</span>)}</div>
                  </div>
                  <span className={styles.rowArrow} aria-hidden>↗</span>
                </Link>
              </motion.article>
            ))}
          </div>

          <div id="projects" className={styles.projectGroup}>
            <div className={styles.subheading}>
              <span>independent systems</span>
              <Link href="https://github.com/ramzxy" target="_blank" rel="noopener noreferrer">all repositories ↗</Link>
            </div>

            <div className={styles.projectList}>
              {featuredProjects.map((project, index) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                >
                  <Link href={project.github ?? project.demo ?? "#"} target="_blank" rel="noopener noreferrer" className={styles.projectRow}>
                    <span className={styles.rowIndex}>{String(index + 3).padStart(2, "0")}</span>
                    <h3>{project.title}</h3>
                    <div className={styles.projectSummary}>
                      <p>{project.description}</p>
                      <span>{project.tech.slice(0, 3).join(" · ")}</span>
                    </div>
                    <i aria-hidden>↗</i>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="writing" className={`${styles.section} ${styles.writingSection}`}>
        <div className={styles.shell}>
          <SectionHeading
            index="02"
            eyebrow="recent writing"
            title="What I found underneath."
            description="Security research, systems programming, and projects that refused to stay small."
          />

          <div className={styles.writingList}>
            {latestPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                style={{ "--entry-accent": post.accent } as CSSProperties}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/blog/${post.slug}`} className={styles.writingRow}>
                  {post.thumbnail && (
                    <div className={styles.writingImage}>
                      <Image src={post.thumbnail} alt="" fill quality={95} sizes="(max-width: 700px) 100vw, 240px" />
                    </div>
                  )}
                  <div className={styles.writingCopy}>
                    <div className={styles.writingMeta}>
                      <span>{post.categories[0] ?? "Writing"}</span>
                      <time dateTime={post.publishedAt}>{shortDate(post.publishedAt)}</time>
                      <span>{post.readingTime} min</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                  </div>
                  <span className={styles.rowArrow} aria-hidden>↗</span>
                </Link>
              </motion.article>
            ))}
          </div>

          <div className={styles.sectionAction}>
            <Link href="/blog">open all writing <span>↗</span></Link>
          </div>
        </div>
      </section>

      <section id="about" className={`${styles.section} ${styles.aboutSection}`}>
        <div className={styles.shell}>
          <SectionHeading index="03" eyebrow="about" title="I need to know what’s underneath." />

          <div className={styles.aboutGrid}>
            <div className={styles.aboutCopy}>
              <p>
                I’m Ilia, a computer science student and engineer in the Netherlands. My work moves between systems programming, offensive security, and web products people actually use.
              </p>
              <p>
                I’m happiest when a project makes me open the layer below it: a kernel, protocol, executable format, distributed state machine, or whatever else is hiding the interesting part.
              </p>
            </div>

            <div className={styles.aboutDetails}>
              <div>
                <span>working around</span>
                <p>C++ · eBPF · Linux · TypeScript · security research</p>
              </div>
              <div>
                <span>elsewhere</span>
                <p>
                  <Link href="https://github.com/ramzxy" target="_blank" rel="noopener noreferrer">GitHub ↗</Link>
                  <Link href="https://linkedin.com/in/rmxzy" target="_blank" rel="noopener noreferrer">LinkedIn ↗</Link>
                  <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume ↗</Link>
                </p>
              </div>
            </div>
          </div>

          <div id="connect" className={styles.contactBlock}>
            <span>Have something worth building or breaking?</span>
            <Link href="mailto:me@rmxzy.com">me@rmxzy.com <i>↗</i></Link>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <span>© {new Date().getFullYear()} Ilia Mirzaali</span>
          <span>rmxzy, on the internet</span>
        </div>
      </footer>

      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
    </main>
  );
}
