"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Project } from "./project-card";

interface CompactProjectRowProps {
  project: Project;
  delay?: number;
}

export const CompactProjectRow = ({ project, delay = 0 }: CompactProjectRowProps) => {
  const indexStr = String(project.index).padStart(2, "0");
  const href = project.demo || project.github;

  const Inner = (
    <div className="group flex items-center gap-3 md:gap-4 py-3 px-3 md:px-4 rounded-md hover:bg-[var(--smoke)] transition-colors duration-200">
      {/* Index */}
      <span className="font-mono text-sm text-[var(--phosphor)] opacity-50 shrink-0 w-8">
        [{indexStr}]
      </span>

      {/* Title + tagline */}
      <span className="font-mono text-base text-[var(--text-bright)] group-hover:text-[var(--phosphor)] transition-colors shrink-0 flex items-baseline gap-2">
        <span>{project.title}</span>
        {project.tagline && (
          <>
            <span className="text-[var(--text-ghost)] text-sm">-</span>
            <span className="font-mono text-xs sm:text-sm text-[var(--text-dim)]">
              {project.tagline}
            </span>
          </>
        )}
      </span>

      {/* Dotted leader */}
      <span
        aria-hidden
        className="flex-1 self-end mb-2 border-b border-dotted border-[var(--ash)] group-hover:border-[var(--text-dim)] transition-colors min-w-[1rem]"
      />

      {/* Tech (hidden on small screens to keep row compact) */}
      <span className="hidden sm:flex flex-wrap justify-end gap-x-3 gap-y-1 font-mono text-xs text-[var(--text-dim)] shrink-0 max-w-[60%]">
        {project.tech.map((t, i) => (
          <span key={t}>
            {t}
            {i < project.tech.length - 1 && (
              <span className="text-[var(--text-ghost)] opacity-50 ml-3">·</span>
            )}
          </span>
        ))}
      </span>

      <ArrowUpRight
        size={16}
        className="shrink-0 text-[var(--text-ghost)] group-hover:text-[var(--phosphor)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {href ? (
        <Link href={href} target="_blank" rel="noopener noreferrer">
          {Inner}
        </Link>
      ) : (
        Inner
      )}
    </motion.div>
  );
};
