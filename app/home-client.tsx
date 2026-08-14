"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ansiShadow, useAsciiText } from "react-ascii-text";
import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import type { BlogPostSummary } from "../lib/blog";
import { ConsoleEasterEgg } from "./components/console-easter-egg";
import { ScrollProgress } from "./components/scroll-progress";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { SocialDock } from "./components/social-dock";
import { TerminalText } from "./components/terminal-text";
import { LinkPreview } from "./blog/components/link-preview";
import { featuredProjects, otherProjects, type Project } from "./data/projects";
import { work, type Work } from "./data/work";
import styles from "./home.module.css";

type HomePost = Omit<BlogPostSummary, "searchText">;

/* The hero cutout is drawn from the fankit's figure plates and changes on each
   visit. Intrinsic sizes differ a lot between them (1.07 to 1.85), so the
   poster is sized by height in CSS and every plate reads at the same scale. */
const heroPlates = [
  { src: "/art/dedsec/plates/screamer-10.webp", width: 1000, height: 605 },
  { src: "/art/dedsec/plates/screamer-11.webp", width: 1000, height: 861 },
  { src: "/art/dedsec/plates/screamer-12.webp", width: 1000, height: 677 },
  { src: "/art/dedsec/plates/screamer-13.webp", width: 1000, height: 801 },
  { src: "/art/dedsec/plates/screamer-14.webp", width: 1000, height: 816 },
  { src: "/art/dedsec/plates/mummy-01.webp", width: 1000, height: 931 },
  { src: "/art/dedsec/plates/mummy-05.webp", width: 1000, height: 559 },
  { src: "/art/dedsec/plates/mummy-07.webp", width: 1000, height: 540 },
] as const;

function WorkRow({ item, index }: { item: Work; index: number }) {
  return (
    <article className={styles.workRow}>
      <Link
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.workRowLink}
      >
        <span className={styles.workIndex}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className={styles.workIdentity}>
          <h3>{item.title}</h3>
          <span>{item.role}</span>
        </div>
        <p>{item.description}</p>
        <div className={styles.techLine}>
          {item.tech.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <span className={styles.rowArrow} aria-hidden>
          ↗
        </span>
      </Link>
    </article>
  );
}

function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const href = project.github ?? project.demo;
  if (!href) return null;

  return (
    <article
      className={`${styles.projectPanel} ${index === 0 ? styles.projectLead : ""}`}
    >
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.projectPanelLink}
      >
        <span className={styles.projectNumber}>
          {String(project.index).padStart(2, "0")}
        </span>
        <div className={styles.projectText}>
          <div className={styles.projectTitleLine}>
            <h3>{project.title}</h3>
            <span>source</span>
          </div>
          <p>{project.description}</p>
          <div className={styles.techLine}>
            {project.tech.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>
        <span className={styles.projectArrow} aria-hidden>
          ↗
        </span>
      </Link>
    </article>
  );
}

function ProjectIndexRow({ project }: { project: Project }) {
  const href = project.github ?? project.demo;
  if (!href) return null;

  return (
    <article className={styles.projectIndexRow}>
      <Link href={href} target="_blank" rel="noopener noreferrer">
        <span>{String(project.index).padStart(2, "0")}</span>
        <h3>{project.title}</h3>
        <p>{project.tagline ?? project.description}</p>
        <div className={styles.techLine}>
          {project.tech.slice(0, 3).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <i aria-hidden>↗</i>
      </Link>
    </article>
  );
}

function shortDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

function PostRow({ post, index }: { post: HomePost; index: number }) {
  return (
    <article className={styles.postRow}>
      <Link href={`/blog/${post.slug}`}>
        <span className={styles.postIndex}>
          {String(index + 1).padStart(2, "0")}
        </span>
        {post.thumbnail && (
          <div className={styles.postImage}>
            <Image
              src={post.thumbnail}
              alt=""
              fill
              quality={85}
              sizes="(max-width: 620px) calc(100vw - 4rem), (max-width: 820px) 9rem, 11.5rem"
            />
          </div>
        )}
        <div className={styles.postBody}>
          <h3>{post.title}</h3>
          <p>{post.description}</p>
        </div>
        <div className={styles.postMeta}>
          <span className={styles.postCategory}>
            {post.categories[0] ?? "note"}
          </span>
          <time className={styles.postDate} dateTime={post.publishedAt}>
            {shortDate(post.publishedAt)}
          </time>
          <span className={styles.postReading}>{post.readingTime} min</span>
        </div>
        <span className={styles.rowArrow} aria-hidden>
          ↗
        </span>
      </Link>
    </article>
  );
}

export default function Home({ latestPosts }: { latestPosts: HomePost[] }) {
  const reduceMotion = useReducedMotion();
  const asciiTextRef = useAsciiText({
    animationCharacters: "▒░█<>/",
    animationCharacterSpacing: 1,
    animationDelay: 4200,
    animationDirection: "down",
    animationInterval: 22,
    animationLoop: !reduceMotion,
    animationSpeed: 72,
    font: ansiShadow,
    text: ["RMXZY"],
  }) as RefObject<HTMLPreElement>;

  /* Chosen after mount rather than during render: picking at render time makes
     the server and client disagree on which plate is in the markup, which is a
     hydration mismatch. Holding it back one paint also avoids fetching one
     plate for the server's guess and a second for the shuffle. */
  const [plate, setPlate] = useState<(typeof heroPlates)[number] | null>(null);

  useEffect(() => {
    setPlate(heroPlates[Math.floor(Math.random() * heroPlates.length)]);
  }, []);

  return (
    <main id="main-content" className={styles.page} tabIndex={-1}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <ScrollProgress />
      <SiteHeader />

      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroGrid} aria-hidden />
        <div className={styles.shell}>
          <div className={styles.heroMeta}>
            <span>Ilia Mirzaali / rmxzy</span>
            <span>52° 13′ 21″ N, 6° 53′ 33″ E</span>
            <Link href="mailto:me@rmxzy.com">me@rmxzy.com ↗</Link>
          </div>

          <div className={styles.heroStage}>
            {plate && (
              <div
                className={styles.heroPoster}
                style={{ "--poster-plate": `url("${plate.src}")` } as CSSProperties}
                aria-hidden
              >
                <Image
                  src={plate.src}
                  alt=""
                  width={plate.width}
                  height={plate.height}
                  priority
                  sizes="(max-width: 620px) 118vw, (max-width: 820px) 78vw, 42vw"
                />
              </div>
            )}

            <motion.div
              className={styles.heroCopy}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1
                id="hero-title"
                className={styles.heroWordmark}
                aria-label="rmxzy"
              >
                <pre ref={asciiTextRef} aria-hidden />
              </h1>
              <p aria-label="hacker · systems engineer · fullstack">
                {reduceMotion ? (
                  <span>hacker · systems engineer · fullstack</span>
                ) : (
                  <span aria-hidden>
                    <TerminalText
                      text="hacker · systems engineer · fullstack"
                      speed={40}
                      delay={900}
                    />
                  </span>
                )}
              </p>
              <div className={styles.heroActions}>
                <Link href="#work">work ↓</Link>
                <Link href="/blog">writing ↗</Link>
                <Link
                  href="https://github.com/ramzxy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub ↗
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="work" className={styles.workSection}>
        <div className={styles.shell}>
          <header className={styles.sectionHeader}>
            <span>01</span>
            <h2>Work</h2>
            <div className={styles.sectionAside}>
              <em className={styles.sectionCount}>{work.length} selected roles</em>
            </div>
          </header>

          <div className={styles.workRows}>
            {work.map((item, index) => (
              <WorkRow key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>

        <div className={styles.tagBandWrap} aria-hidden>
          <div className={styles.tagBand}>
            <Image
              src="/art/rmxzy-tag-clean.webp"
              alt=""
              width={1899}
              height={828}
              sizes="100vw"
            />
          </div>
          <Image
            src="/art/dedsec/hand-reach.webp"
            alt=""
            width={814}
            height={942}
            sizes="(max-width: 820px) 30vw, 15rem"
            className={styles.tagHand}
          />
        </div>

        <div id="projects" className={`${styles.shell} ${styles.codeSection}`}>
          <header className={styles.sectionHeader}>
            <span>02</span>
            <h2>Projects</h2>
            <div className={styles.sectionAside}>
              <em className={styles.sectionCount}>
                {featuredProjects.length + otherProjects.length} indexed
              </em>
              <Link
                href="https://github.com/ramzxy"
                target="_blank"
                rel="noopener noreferrer"
              >
                all repositories ↗
              </Link>
            </div>
          </header>

          <div className={styles.projectCanvas}>
            {featuredProjects.map((project, index) => (
              <ProjectPanel key={project.id} project={project} index={index} />
            ))}
          </div>

          <div className={styles.projectIndex}>
            {otherProjects.map((project) => (
              <ProjectIndexRow key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <div className={styles.reaperBreak} aria-hidden>
        <Image
          src="/art/dedsec/reaper-05.webp"
          alt=""
          width={1200}
          height={815}
          sizes="(max-width: 620px) 42rem, (max-width: 820px) 44rem, 58rem"
        />
      </div>

      <section id="writing" className={styles.writingSection}>
        <div className={styles.shell}>
          <header
            className={`${styles.sectionHeader} ${styles.sectionHeaderDark}`}
          >
            <span>03</span>
            <h2>Notes</h2>
            <div className={styles.sectionAside}>
              <em className={styles.sectionCount}>
                {latestPosts.length} recent
              </em>
              <Link href="/blog">full archive ↗</Link>
            </div>
          </header>

          <div className={styles.postList}>
            <div className={styles.postListHeader} aria-hidden="true">
              <span>no.</span>
              <span>cover</span>
              <span>note</span>
              <span>topic</span>
              <span>date</span>
              <span>read</span>
              <span />
            </div>
            {latestPosts.map((post, index) => (
              <PostRow key={post.slug} post={post} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className={styles.aboutSection}>
        <div className={styles.shell}>
          <header className={styles.sectionHeader}>
            <span>04</span>
            <h2>About me</h2>
          </header>

          <div className={styles.aboutGrid}>
            <div className={styles.aboutArt} aria-hidden>
              <Image
                src="/art/dedsec/brain-jar.webp"
                alt=""
                width={504}
                height={665}
                sizes="(max-width: 620px) 9rem, (max-width: 820px) 10rem, 15rem"
              />
            </div>

            <div className={styles.aboutCopy}>
              <div className={styles.aboutBio}>
                <p>
                  I’m Ilia, a computer science student and engineer from{" "}
                  <LinkPreview url="https://en.wikipedia.org/wiki/Israel">
                    Iran
                  </LinkPreview>{" "}
                  who moved to the Netherlands. My work spans systems
                  programming, offensive security, and web products people
                  actually use.
                </p>
                <p>
                  I really enjoy good music and art, and I play the{" "}
                  <LinkPreview url="https://en.wikipedia.org/wiki/Setar">
                    Setar
                  </LinkPreview>
                  . Growing up with Eastern philosophy and Persian poetry also
                  shaped my love of philosophy.
                </p>
                <p>
                  What draws me to a project is usually how cool it sounds in my
                  head, so whatever you see here probably sounded cool af to me
                  at some point :)
                </p>
              </div>

              <dl className={styles.aboutFacts}>
                <div>
                  <dt>languages</dt>
                  <dd>C · C++ · Java · Python · TypeScript</dd>
                </div>
                <div>
                  <dt>systems / security</dt>
                  <dd>Linux internals · eBPF · containerization</dd>
                </div>
                <div>
                  <dt>networking / backend</dt>
                  <dd>
                    Express · Boost.Asio · FastAPI · PostgreSQL · Redis ·
                    MongoDB
                  </dd>
                </div>
                <div>
                  <dt>web / infra</dt>
                  <dd>Vue · React · Next.js · Docker · AWS · Cloudflare</dd>
                </div>
                <div>
                  <dt>elsewhere</dt>
                  <dd className={styles.aboutLinks}>
                    <Link
                      href="https://github.com/ramzxy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub ↗
                    </Link>
                    <Link
                      href="https://linkedin.com/in/rmxzy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn ↗
                    </Link>
                    <Link
                      href="/Resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Resume ↗
                    </Link>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div id="connect" className={`${styles.shell} ${styles.contactRow}`}>
          <Link href="mailto:me@rmxzy.com" className={styles.emailLink}>
            me@rmxzy.com <span>↗</span>
          </Link>
          <SocialDock className={styles.contactDock} />
        </div>
      </section>

      <SiteFooter />

      <ConsoleEasterEgg />
    </main>
  );
}
