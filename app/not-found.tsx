"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TerminalText } from "./components/terminal-text";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[var(--obsidian)] text-[var(--text-bright)]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl rounded-lg border border-[var(--ash)] bg-[var(--graphite)] shadow-[0_0_60px_var(--phosphor-glow)] font-mono overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--ash)] bg-[var(--smoke)] text-xs">
          <div className="flex items-center gap-2 text-[var(--text-dim)]">
            <span className="w-2 h-2 rounded-full bg-[var(--ember)]" />
            <span>~/404</span>
          </div>
          <span className="text-[10px] text-[var(--text-ghost)] uppercase tracking-wider">
            HTTP 404
          </span>
        </div>

        <div className="p-6 space-y-3 text-sm">
          <div className="flex gap-2">
            <span className="text-[var(--phosphor)]">$</span>
            <TerminalText text="cat ./that-page" speed={28} />
          </div>
          <div className="text-[var(--ember)]">
            cat: ./that-page: No such file or directory
          </div>

          <div className="flex gap-2 pt-3">
            <span className="text-[var(--phosphor)]">$</span>
            <TerminalText text="ls /" speed={28} delay={900} />
          </div>
          <div className="text-[var(--text-medium)] flex flex-wrap gap-x-6 gap-y-1">
            <Link
              href="/#work"
              className="hover:text-[var(--phosphor)] transition-colors"
            >
              work/
            </Link>
            <Link
              href="/#projects"
              className="hover:text-[var(--phosphor)] transition-colors"
            >
              projects/
            </Link>
            <Link
              href="/#about"
              className="hover:text-[var(--phosphor)] transition-colors"
            >
              about/
            </Link>
            <Link
              href="https://blog.rmxzy.com"
              className="hover:text-[var(--phosphor)] transition-colors"
            >
              blog/
            </Link>
            <Link
              href="/#connect"
              className="hover:text-[var(--phosphor)] transition-colors"
            >
              contact/
            </Link>
          </div>

          <div className="flex gap-2 pt-4 items-center">
            <span className="text-[var(--phosphor)]">$</span>
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-[var(--text-bright)] hover:text-[var(--phosphor)] transition-colors"
            >
              <span>cd ~</span>
              <span className="text-[var(--phosphor)] group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
