"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Work } from "../data/work";
import { GlitchText } from "./glitch-text";

interface WorkCardProps {
  work: Work;
  delay?: number;
}

export const WorkCard = ({ work, delay = 0 }: WorkCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link
        href={work.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden rounded-lg border border-[var(--ash)] bg-[var(--graphite)] p-8 transition-all duration-500 hover:border-[var(--phosphor)] hover:shadow-[0_0_40px_var(--phosphor-glow)]"
      >
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <span className="font-mono text-xs text-[var(--text-ghost)]">
                {work.role}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-display text-[var(--text-bright)] group-hover:text-[var(--phosphor)] transition-colors duration-300 break-all">
              <GlitchText text={work.title} />
            </h3>
          </div>
          <ArrowUpRight
            size={24}
            className="shrink-0 text-[var(--text-ghost)] group-hover:text-[var(--phosphor)] group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300"
          />
        </div>

        <p className="text-[var(--text-medium)] text-base leading-relaxed mb-6">
          {work.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {work.tech.map((t) => (
            <span
              key={t}
              className="font-mono text-xs px-2 py-1 rounded bg-[var(--smoke)] text-[var(--text-dim)] border border-[var(--ash)]"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gradient-to-r from-transparent via-[var(--phosphor)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
        </div>
      </Link>
    </motion.article>
  );
};
