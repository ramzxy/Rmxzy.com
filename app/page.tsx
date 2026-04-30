"use client";

import { useEffect, useState, RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAsciiText, ansiShadow } from "react-ascii-text";
import Link from "next/link";
import { ArrowDown, MapPin, Clock, Menu, X, BookOpen, ArrowRight } from "lucide-react";

import Particles from "./components/particles";
import { CustomCursor } from "./components/custom-cursor";
import { TerminalText } from "./components/terminal-text";
import { ProjectCard } from "./components/project-card";
import { CompactProjectRow } from "./components/compact-project-row";
import { WorkCard } from "./components/work-card";
import { SocialDock } from "./components/social-dock";
import { SectionHeader } from "./components/section-header";
import { ThemeToggle } from "./components/theme-toggle";
import { CommandPalette } from "./components/command-palette";
import { ShortcutsOverlay } from "./components/shortcuts-overlay";
import { ConsoleEasterEgg } from "./components/console-easter-egg";
import { GitHubActivity } from "./components/github-activity";
import { ScrollProgress } from "./components/scroll-progress";
import { featuredProjects, otherProjects } from "./data/projects";
import { work } from "./data/work";

// Navigation items with numbered prefixes
const navigation = [
  { index: "01", name: "work", href: "#work" },
  { index: "02", name: "projects", href: "#projects" },
  { index: "03", name: "about", href: "#about" },
  { index: "04", name: "blog", href: "https://blog.rmxzy.com" },
  { index: "05", name: "contact", href: "#connect" },
];

export default function Home() {
  const [currentTime, setCurrentTime] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<"linux" | "fedora" | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // ASCII text for hero
  const asciiTextRef = useAsciiText({
    animationCharacters: "▒░█",
    animationCharacterSpacing: 1,
    animationDelay: 5000,
    animationDirection: "down",
    animationInterval: 20,
    animationLoop: true,
    animationSpeed: 80,
    font: ansiShadow,
    text: ["R M X Z Y"],
  }) as RefObject<HTMLPreElement>;

  // Detect Linux/Fedora users (always show fedora toast in dev)
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isFedora = ua.includes("fedora");
    const isLinux = ua.includes("linux") && !ua.includes("android");
    const isDev = process.env.NODE_ENV === "development";

    const variant = isFedora || isDev ? "fedora" : isLinux ? "linux" : null;
    if (!variant) return;

    const timer = setTimeout(() => setToast(variant), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Global keyboard shortcuts. Skip when typing in inputs or when modifier
  // keys are pressed (those are reserved for browser/OS shortcuts and the
  // palette listener handles its own ⌘K).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      };

      switch (e.key) {
        case "?":
          e.preventDefault();
          setShortcutsOpen((v) => !v);
          break;
        case "Escape":
          setShortcutsOpen(false);
          setIsMobileMenuOpen(false);
          break;
        case "1":
          scrollTo("work");
          break;
        case "2":
          scrollTo("projects");
          break;
        case "3":
          scrollTo("about");
          break;
        case "4":
          window.open("https://blog.rmxzy.com", "_blank", "noopener");
          break;
        case "5":
          scrollTo("connect");
          break;
        case "g":
          window.open("https://github.com/ramzxy", "_blank", "noopener");
          break;
        case "t": {
          const html = document.documentElement;
          html.classList.add("theme-transitioning");
          const next =
            html.getAttribute("data-theme") === "light" ? "dark" : "light";
          html.setAttribute("data-theme", next);
          window.dispatchEvent(new Event("theme-change"));
          try {
            localStorage.setItem("theme", next);
          } catch {}
          window.setTimeout(
            () => html.classList.remove("theme-transitioning"),
            380,
          );
          break;
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <ConsoleEasterEgg />
      <ScrollProgress />

      {/* Background Particles - Fixed to cover entire screen */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Particles
          className="w-full h-full"
          quantity={300}
        />
      </div>

      <CustomCursor />

      {/* Fixed navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-mono text-base text-[var(--text-bright)] hover:text-[var(--phosphor)] transition-colors">
            rmxzy<span className="text-[var(--phosphor)]">_</span>
          </Link>

          {/* Nav items */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.index}
                href={item.href}
                className="group flex items-center gap-2 font-mono text-base text-[var(--text-dim)] hover:text-[var(--phosphor)] transition-colors"
              >
                <span className="text-[var(--phosphor)] opacity-40 group-hover:opacity-100 transition-opacity">
                  [{item.index}]
                </span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Palette trigger, theme toggle, mobile menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
              className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-[var(--ash)] hover:border-[var(--phosphor)] bg-[var(--graphite)]/50 hover:bg-[var(--smoke)] transition-colors group"
            >
              <span className="font-mono text-xs text-[var(--text-dim)] group-hover:text-[var(--phosphor)] transition-colors">
                ⌘K
              </span>
            </button>
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative z-50 p-2 text-[var(--text-bright)] hover:text-[var(--phosphor)] transition-colors"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-[var(--obsidian)]/95 backdrop-blur-md md:hidden flex flex-col"
          >
            {/* Terminal header */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="px-6 pt-24 pb-10 font-mono text-xs text-[var(--text-dim)] flex items-center gap-2"
            >
              <span className="text-[var(--phosphor)]">$</span>
              <span>ls /rmxzy</span>
            </motion.div>

            {/* Items: stagger in left-to-right with a phosphor caret on hover */}
            <nav className="flex-1 flex flex-col gap-5 px-6">
              {navigation.map((item, i) => (
                <motion.div
                  key={item.index}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -16, opacity: 0 }}
                  transition={{
                    delay: 0.08 + i * 0.06,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center gap-4 font-mono text-3xl text-[var(--text-bright)] hover:text-[var(--phosphor)] transition-colors"
                  >
                    <span className="font-mono text-[var(--phosphor)] text-sm w-6 opacity-50 group-hover:opacity-100 transition-opacity">
                      [{item.index}]
                    </span>
                    <span>{item.name}</span>
                    <span className="text-[var(--phosphor)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      →
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="px-6 pb-12 font-mono text-xs text-[var(--text-ghost)]"
            >
              tap outside or × to close
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6">
        
        {/* Status Bar Container - Aligned with Navbar */}
        <div className="absolute top-24 w-full max-w-4xl px-0 hidden lg:flex justify-between items-start pointer-events-none">
            {/* Location & Time */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col gap-4 font-mono text-sm text-[var(--text-dim)]"
            >
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-[var(--phosphor)]" />
                <span>Netherlands</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-[var(--phosphor)]" />
                <span>{currentTime}</span>
              </div>
            </motion.div>

            {/* Status: availability + live github activity */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col items-end gap-3 pointer-events-auto"
            >
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="w-2 h-2 rounded-full bg-[var(--phosphor)] animate-pulse" />
                <span className="text-[var(--text-dim)]">available for work</span>
              </div>
              <GitHubActivity />
            </motion.div>
        </div>

        {/* Main ASCII name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* The ascii hero. Pre-render the static glyphs as the LCP element
              so the page paints meaningful content on first frame; the
              react-ascii-text hook then takes over and animates. */}
          <pre
            ref={asciiTextRef}
            aria-label="rmxzy"
            className="text-[8px] sm:text-[10px] md:text-sm lg:text-base whitespace-pre text-[var(--text-bright)] leading-none tracking-tight select-none"
            style={{
              fontFamily: '"Martian Mono", "Courier New", monospace',
              textShadow: `
                0 0 10px var(--phosphor-glow),
                0 0 30px var(--phosphor-glow),
                0 0 60px var(--phosphor-glow)
              `,
            }}
          >{`██████╗ ███╗   ███╗██╗  ██╗███████╗██╗   ██╗
██╔══██╗████╗ ████║╚██╗██╔╝╚══███╔╝╚██╗ ██╔╝
██████╔╝██╔████╔██║ ╚███╔╝   ███╔╝  ╚████╔╝
██╔══██╗██║╚██╔╝██║ ██╔██╗  ███╔╝    ╚██╔╝
██║  ██║██║ ╚═╝ ██║██╔╝ ██╗███████╗   ██║
╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   `}</pre>

          {/* Tagline with terminal effect */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 text-center"
          >
            <TerminalText
              text="hacker • systems engineer • fullstack"
              speed={40}
              delay={1200}
              className="text-[var(--text-dim)] text-base md:text-lg"
            />
          </motion.div>
        </motion.div>

        {/* Social dock at bottom of hero */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
          <SocialDock />
        </div>

        {/* Scroll cue: terse terminal-style "next" pointer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <Link
            href="#work"
            aria-label="Scroll to work section"
            className="group inline-flex items-center gap-3 font-mono text-sm px-3 py-1.5 rounded border border-transparent hover:border-[var(--ash)] hover:bg-[var(--smoke)]/40 transition-colors"
          >
            <span className="text-[var(--text-dim)] group-hover:text-[var(--phosphor)] transition-colors">
              next
            </span>
            <motion.span
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="text-[var(--phosphor)]"
            >
              ↓
            </motion.span>
            <span className="text-[var(--text-bright)] group-hover:text-[var(--phosphor)] transition-colors">
              work
            </span>
          </Link>
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* WORK SECTION */}
      {/* ============================================ */}
      <section id="work" className="relative pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            index="01"
            title="WORK"
            subtitle="Live sites I've built and shipped for organizations."
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {work.map((w, i) => (
              <WorkCard key={w.id} work={w} delay={i * 0.12} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PROJECTS SECTION */}
      {/* ============================================ */}
      <section id="projects" className="relative pt-12 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            index="02"
            title="PROJECTS"
            subtitle="Side projects, from low-level systems to weekend hacks."
            className="mb-16"
          />

          {/* Featured projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {featuredProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} delay={i * 0.12} />
            ))}
          </div>

          {/* More projects: compact terminal-style list */}
          {otherProjects.length > 0 && (
            <>
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono text-xs text-[var(--phosphor)] opacity-60">
                  // more
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-[var(--ash)] to-transparent" />
              </div>

              <div className="rounded-lg border border-[var(--ash)] bg-[var(--graphite)]/40 divide-y divide-[var(--ash)]/40 overflow-hidden">
                {otherProjects.map((project, i) => (
                  <CompactProjectRow
                    key={project.id}
                    project={project}
                    delay={i * 0.06}
                  />
                ))}
              </div>
            </>
          )}

          {/* View all link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link
              href="https://github.com/ramzxy"
              target="_blank"
              className="inline-flex items-center gap-2 font-mono text-base text-[var(--text-dim)] hover:text-[var(--phosphor)] transition-colors group"
            >
              <span>view all on github</span>
              <span className="text-[var(--phosphor)] group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* BLOG SECTION - Latest Post */}
      {/* ============================================ */}
      <section className="relative pt-8 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Section label */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-sm text-[var(--phosphor)] opacity-60">
                // latest post
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-[var(--ash)] to-transparent" />
            </div>

            {/* Blog card */}
            <Link
              href="https://blog.rmxzy.com/2026/01/27/chokerjoker-blog/"
              target="_blank"
              className="group block"
            >
              <div className="relative overflow-hidden rounded-lg border border-[var(--ash)] bg-[var(--graphite)] p-6 transition-all duration-500 hover:border-[var(--phosphor)] hover:shadow-[0_0_40px_var(--phosphor-glow)]">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[var(--smoke)] border border-[var(--ash)] flex items-center justify-center">
                    <BookOpen size={24} className="text-[var(--phosphor)]" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs text-[var(--text-ghost)]">
                        2026-01-27
                      </span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--smoke)] border border-[var(--ash)] text-[var(--phosphor)]">
                        Game AI
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-display text-[var(--text-bright)] group-hover:text-[var(--phosphor)] transition-colors duration-300 truncate">
                      Building ChokerJoker, the award-winning Quarto solver
                    </h3>
                    <p className="mt-1 text-sm text-[var(--text-dim)] line-clamp-1 md:line-clamp-none">
                      Java game AI with alpha-beta pruning. Search the entire tree, or run out of time
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 hidden md:flex items-center">
                    <ArrowRight 
                      size={20} 
                      className="text-[var(--text-ghost)] group-hover:text-[var(--phosphor)] group-hover:translate-x-1 transition-all duration-300" 
                    />
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 right-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gradient-to-r from-transparent via-[var(--phosphor)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                </div>
              </div>
            </Link>

            {/* View all link */}
            <div className="mt-4 text-right">
              <Link
                href="https://blog.rmxzy.com"
                target="_blank"
                className="inline-flex items-center gap-2 font-mono text-sm text-[var(--text-dim)] hover:text-[var(--phosphor)] transition-colors group"
              >
                <span>view all posts</span>
                <span className="text-[var(--phosphor)] group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* ABOUT SECTION */}
      {/* ============================================ */}
      <section id="about" className="relative py-32 px-6 bg-[var(--graphite)]">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            index="03"
            title="ABOUT"
            className="mb-16"
          />

          <div className="grid md:grid-cols-2 gap-12">
            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-lg bg-[var(--smoke)] border border-[var(--ash)]">
                <p className="text-[var(--text-medium)] text-base md:text-lg leading-relaxed">
                  Hey, I'm <span className="text-[var(--phosphor)]">Ilia</span>, online I go by <span className="font-mono text-[var(--text-bright)]">rmxzy</span>.
                </p>
                <p className="mt-4 text-[var(--text-medium)] text-base md:text-lg leading-relaxed">
                  CS student in the Netherlands, into low-level systems and the things that make computers actually do work. C++ for the deep stuff (Redis clones, kernel-side eBPF, VPN clients, emulators), TypeScript for shipping things on the web.
                </p>
                <p className="mt-4 text-[var(--text-medium)] leading-relaxed">
                  I founded <Link href="https://ramsy.eu" target="_blank" className="font-mono text-[var(--text-bright)] hover:text-[var(--phosphor)] transition-colors">ramsy.eu</Link>, an AI-augmented offensive security firm, and ship sites for organizations I care about.
                </p>
                <p className="mt-4 text-[var(--text-medium)] leading-relaxed">
                  When I'm not coding, you'll find me on Codeforces grinding algorithms or in a terminal somewhere.
                </p>
              </div>
            </motion.div>

            {/* Skills/Interests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h3 className="font-mono text-base text-[var(--phosphor)] mb-4">// interests</h3>
                <div className="flex flex-wrap gap-2">
                  {["Systems Programming", "Operating Systems", "Distributed Systems", "Networks", "Security", "Algorithms"].map((skill) => (
                    <span
                      key={skill}
                      className="font-mono text-xs px-3 py-1.5 rounded bg-[var(--smoke)] border border-[var(--ash)] text-[var(--text-dim)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-mono text-base text-[var(--phosphor)] mb-4">// technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {["C++", "TypeScript", "Python", "PHP", "Linux", "eBPF", "Bash", "React", "Next.js", "Node.js", "MySQL", "Redis"].map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-xs px-3 py-1.5 rounded bg-[var(--smoke)] border border-[var(--ash)] text-[var(--text-dim)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Currently working on */}
              <div className="p-4 rounded-lg border border-[var(--ash)] bg-[var(--smoke)]">
                <h3 className="font-mono text-base text-[var(--text-dim)] mb-2">// currently building</h3>
                <Link
                  href="https://github.com/ramzxy/Cedis"
                  target="_blank"
                  className="flex items-center gap-2 text-[var(--text-bright)] hover:text-[var(--phosphor)] transition-colors group"
                >
                  <span className="font-mono">Cedis</span>
                  <span className="text-[var(--text-dim)]">-</span>
                  <span className="text-base text-[var(--text-medium)]">Redis clone in C++</span>
                  <span className="text-[var(--phosphor)] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CONNECT SECTION */}
      {/* ============================================ */}
      <section id="connect" className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            index="04"
            title="CONNECT"
            subtitle="Let's build something together."
            className="mb-16"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            <p className="text-[var(--text-medium)] text-base md:text-lg max-w-md mb-8">
              I'm always interested in hearing about new projects, collaborations, or just chatting about distributed systems and low-level programming.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="mailto:me@rmxzy.com"
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-[var(--graphite)] border border-[var(--ash)] font-mono text-[var(--text-bright)] transition-all duration-300 hover:border-[var(--phosphor)] hover:shadow-[0_0_30px_var(--phosphor-glow)]"
              >
                <span className="text-[var(--phosphor)]">$</span>
                <span>say_hello</span>
                <span className="text-[var(--phosphor)] group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-6 py-4 rounded-lg border border-[var(--ash)] font-mono text-[var(--text-dim)] transition-colors hover:border-[var(--phosphor)] hover:text-[var(--phosphor)]"
              >
                <span className="text-[var(--text-ghost)] group-hover:text-[var(--phosphor)] transition-colors">
                  $
                </span>
                <span>cat resume.pdf</span>
              </Link>
            </div>

            <div className="mt-12">
              <SocialDock />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="py-8 px-6 border-t border-[var(--ash)]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-mono text-sm text-[var(--text-ghost)]">
            © {new Date().getFullYear()} rmxzy
          </span>
          <span className="font-mono text-sm text-[var(--text-ghost)]">
            crafted with<span className="text-[var(--phosphor)]"> ♥ </span>and too much coffee
          </span>
        </div>
      </footer>

      {/* Command palette + keyboard shortcuts overlay */}
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
      <ShortcutsOverlay
        open={shortcutsOpen}
        setOpen={setShortcutsOpen}
        openPalette={() => {
          setShortcutsOpen(false);
          setPaletteOpen(true);
        }}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 left-6 z-50 max-w-xs"
          >
            <div className="relative flex items-start gap-3 px-4 py-3 rounded-lg bg-[var(--graphite)] border border-[var(--ash)] shadow-lg">
              <span className="font-mono text-sm text-[var(--phosphor)] shrink-0 mt-0.5">$</span>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-mono text-sm text-[var(--text-medium)]">
                  {toast === "fedora"
                    ? "fedora it is... ilia or angelos?"
                    : "fellow linux user detected"}
                </span>
                <span className="font-mono text-xs text-[var(--text-ghost)]">
                  {toast === "fedora" ? "~/ dnf install a-brain" : "~/ uname -a"}
                </span>
              </div>
              <button
                onClick={() => setToast(null)}
                className="shrink-0 ml-2 text-[var(--text-ghost)] hover:text-[var(--phosphor)] transition-colors"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
