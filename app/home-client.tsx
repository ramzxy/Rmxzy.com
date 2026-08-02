"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useAsciiText, ansiShadow } from "react-ascii-text";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import type { BlogPostSummary } from "../lib/blog";
import { ScrollProgress } from "./components/scroll-progress";
import { SiteHeader } from "./components/site-header";
import { SocialDock } from "./components/social-dock";
import { TerminalText } from "./components/terminal-text";
import { featuredProjects } from "./data/projects";
import { work, type Work } from "./data/work";
import styles from "./home.module.css";

const Particles = dynamic(() => import("./components/particles"), { ssr: false });

type HomePost = Omit<BlogPostSummary, "searchText">;

const projectSignals: Record<string, { input: string; output: string }> = {
  khor: { input: "syscalls", output: "sound" },
  cedis: { input: "RESP bytes", output: "state" },
  emuchip8: { input: "opcode", output: "pixels" },
};

const scrollSpring = {
  stiffness: 110,
  damping: 26,
  mass: 0.45,
  restDelta: 0.001,
};

type FeaturedProject = (typeof featuredProjects)[number];

function WorkCase({ item, index }: { item: Work; index: number }) {
  const articleRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start end", "end start"],
  });
  const easedProgress = useSpring(scrollYProgress, scrollSpring);
  const indexY = useTransform(easedProgress, [0, 1], [10, -12]);
  const identityY = useTransform(easedProgress, [0, 1], [24, -18]);
  const detailsY = useTransform(easedProgress, [0, 1], [10, -8]);

  return (
    <motion.article
      ref={articleRef}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.58, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={item.url} target="_blank" rel="noopener noreferrer" className={styles.workEntry}>
        <motion.span
          className={styles.workIndex}
          style={{ y: reduceMotion ? 0 : indexY }}
          aria-hidden
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>
        <motion.div className={styles.workIdentity} style={{ y: reduceMotion ? 0 : identityY }}>
          <span className={styles.workRole}>{item.role}</span>
          <h3>{item.title}</h3>
        </motion.div>
        <motion.div className={styles.workDetails} style={{ y: reduceMotion ? 0 : detailsY }}>
          <p>{item.description}</p>
          <div className={styles.workFooter}>
            <div className={styles.workTags}>{item.tech.slice(0, 3).map((tech) => <span key={tech}>{tech}</span>)}</div>
            <span className={styles.workOpen}>visit <i aria-hidden>↗</i></span>
          </div>
        </motion.div>
      </Link>
    </motion.article>
  );
}

function ProjectEntry({ project, index }: { project: FeaturedProject; index: number }) {
  const reduceMotion = useReducedMotion();
  const isPrimary = index === 0;

  return (
    <motion.article
      initial={reduceMotion ? false : {
        opacity: 0,
        x: isPrimary ? 0 : 24,
        y: isPrimary ? 30 : 0,
      }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-6%" }}
      transition={{
        duration: 0.58,
        delay: index * 0.09,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link href={project.github ?? project.demo ?? "#"} target="_blank" rel="noopener noreferrer" className={styles.projectTile}>
        <div className={styles.projectTopline}>
          <span>{String(index + 3).padStart(2, "0")}</span>
          <span>{project.tech[0]}</span>
        </div>
        <div className={styles.projectCopy}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
        <div className={styles.projectSignal} aria-hidden>
          <span>{projectSignals[project.id]?.input ?? "input"}</span>
          <motion.i
            initial={reduceMotion ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.48, delay: 0.22 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
          />
          <span>{projectSignals[project.id]?.output ?? "output"}</span>
        </div>
        <div className={styles.projectFooter}>
          <span>{project.tech.slice(0, 3).join(" · ")}</span>
          <span>source <i aria-hidden>↗</i></span>
        </div>
      </Link>
    </motion.article>
  );
}

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

  return (
    <main id="main-content" className={styles.page}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <ScrollProgress />

      <SiteHeader />

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
            title="The work that stuck."
            description="Selection of my works that are actually deployed and used."
          />

          <div className={styles.workList}>
            {work.map((item, index) => (
              <WorkCase key={item.id} item={item} index={index} />
            ))}
          </div>

          <div id="projects" className={styles.projectGroup}>
            <div className={styles.subheading}>
              <span>03—05 / built out of curiosity</span>
              <Link href="https://github.com/ramzxy" target="_blank" rel="noopener noreferrer">all repositories ↗</Link>
            </div>

            <div className={styles.projectShelf}>
              {featuredProjects.map((project, index) => (
                <ProjectEntry key={project.id} project={project} index={index} />
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
            title="Stories I like to share"
            description="Security research, systems programming, and projects that were too cool to keep silent."
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
          <SectionHeading index="03" eyebrow="about" title="About me" />

          <div className={styles.aboutGrid}>
            <div className={styles.aboutCopy}>
              <p>
                I’m Ilia, a computer science student and engineer from <Link href="https://en.wikipedia.org/wiki/Israel">Iran</Link> who moved to the Netherlands. My work spans systems programming, offensive security, and web products people actually use.
              </p>
              <p>
                I really enjoy good music and art, and I play the <Link href="https://en.wikipedia.org/wiki/Setar">Setar</Link>. Growing up with Eastern philosophy and Persian poetry also shaped my love of philosophy.
              </p>
              <p>
                What draws me to a project is usually how cool it sounds in my head, so whatever you see here probably sounded cool af to me at some point :)
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

    </main>
  );
}
