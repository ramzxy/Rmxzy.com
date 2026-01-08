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
import { SocialDock } from "./components/social-dock";
import { SectionHeader } from "./components/section-header";
import { ThemeToggle } from "./components/theme-toggle";
import { projects } from "./data/projects";

// Navigation items with numbered prefixes
const navigation = [
  { index: "01", name: "projects", href: "#projects" },
  { index: "02", name: "about", href: "#about" },
  { index: "03", name: "blog", href: "https://blog.rmxzy.com" },
  { index: "04", name: "contact", href: "#connect" },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    setMounted(true);

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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--obsidian)]" />
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
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

          {/* Theme toggle & Mobile Menu */}
          <div className="flex items-center gap-4">
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[var(--obsidian)]/95 backdrop-blur-md md:hidden flex flex-col items-center justify-center gap-8"
          >
            {navigation.map((item) => (
              <Link
                key={item.index}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-mono text-2xl text-[var(--text-bright)] hover:text-[var(--phosphor)] transition-colors flex items-center gap-4"
              >
                <span className="text-[var(--phosphor)] text-sm opacity-50">/{item.index}</span>
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
        
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

            {/* Available status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center gap-2 font-mono text-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--phosphor)] animate-pulse" />
              <span className="text-[var(--text-dim)]">available for work</span>
            </motion.div>
        </div>

        {/* Main ASCII name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center"
        >
          <pre
            ref={asciiTextRef}
            className="font-mono text-[8px] sm:text-[10px] md:text-sm lg:text-base whitespace-pre text-[var(--text-bright)] leading-none tracking-tight select-none"
            style={{
              textShadow: `
                0 0 10px var(--phosphor-glow),
                0 0 30px var(--phosphor-glow),
                0 0 60px var(--phosphor-glow)
              `,
            }}
          />

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

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-sm text-[var(--text-ghost)]">scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={16} className="text-[var(--text-ghost)]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* PROJECTS SECTION */}
      {/* ============================================ */}
      <section id="projects" className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            index="01"
            title="SELECTED WORKS"
            subtitle="Projects I've built, from low-level systems to full-stack applications."
            className="mb-16"
          />

          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                delay={index * 0.15}
              />
            ))}
          </div>

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
      <section className="relative py-16 px-6">
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
              href="https://blog.rmxzy.com/2025/11/27/ilia.beer/"
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
                        2025-11-27
                      </span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--smoke)] border border-[var(--ash)] text-[var(--phosphor)]">
                        Web Dev
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-display text-[var(--text-bright)] group-hover:text-[var(--phosphor)] transition-colors duration-300 truncate">
                      Building ilia.beer, A "Buy Me a Beer" Platform
                    </h3>
                    <p className="mt-1 text-sm text-[var(--text-dim)] line-clamp-1 md:line-clamp-none">
                      PHP backend on Raspberry Pi, video compression with Google Transcoder API
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
            index="02"
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
                  Hey, I'm <span className="text-[var(--phosphor)]">Ilia</span> — but online I go by <span className="font-mono text-[var(--text-bright)]">rmxzy</span>.
                </p>
                <p className="mt-4 text-[var(--text-medium)] text-base md:text-lg leading-relaxed">
                  I'm a CS student passionate about building things that work at scale. Currently exploring distributed systems, low-level programming, and the intersection of performance and elegance.
                </p>
                <p className="mt-4 text-[var(--text-medium)] leading-relaxed">
                  When I'm not coding, you'll find me on CodeForces grinding algorithms or reading about systems design.
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
                  {["Distributed Systems", "Systems Programming", "Databases", "Compilers", "Networks", "Security"].map((skill) => (
                    <span
                      key={skill}
                      className="font-mono text-sm px-3 py-1.5 rounded bg-[var(--smoke)] border border-[var(--ash)] text-[var(--text-dim)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-mono text-base text-[var(--phosphor)] mb-4">// technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {["C++", "Go", "Rust", "TypeScript", "Python", "React", "Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes"].map((tech) => (
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
                  <span className="text-[var(--text-dim)]">—</span>
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
            index="03"
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

            <Link
              href="mailto:me@rmxzy.com"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-[var(--graphite)] border border-[var(--ash)] font-mono text-[var(--text-bright)] transition-all duration-300 hover:border-[var(--phosphor)] hover:shadow-[0_0_30px_var(--phosphor-glow)]"
            >
              <span className="text-[var(--phosphor)]">$</span>
              <span>say_hello</span>
              <span className="text-[var(--phosphor)] group-hover:translate-x-1 transition-transform">→</span>
            </Link>

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
    </main>
  );
}
