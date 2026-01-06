"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  index: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionHeader = ({
  index,
  title,
  subtitle,
  className = "",
}: SectionHeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`space-y-2 ${className}`}
    >
      <div className="flex items-center gap-4">
        {/* Index */}
        <span className="font-mono text-sm text-[var(--phosphor)] opacity-60">
          // {index}
        </span>
        
        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-px flex-1 bg-gradient-to-r from-[var(--ash)] to-transparent origin-left"
        />
      </div>

      {/* Title */}
      <h2 className="font-mono text-2xl md:text-3xl text-[var(--text-bright)] tracking-tight">
        {title}
      </h2>

      {/* Optional subtitle */}
      {subtitle && (
        <p className="text-[var(--text-dim)] text-sm max-w-md">
          {subtitle}
        </p>
      )}
    </motion.header>
  );
};
