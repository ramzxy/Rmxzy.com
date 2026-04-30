"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import { GlitchText } from "./glitch-text";

export interface Project {
  id: string;
  index: number;
  title: string;
  description: string;
  tagline?: string;
  image?: string;
  tech: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
}

interface ProjectCardProps {
  project: Project;
  delay?: number;
}

export const ProjectCard = ({ project, delay = 0 }: ProjectCardProps) => {
  const indexStr = String(project.index).padStart(2, "0");
  const primaryHref = project.demo || project.github;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative h-full"
    >
      <div className="relative overflow-hidden rounded-lg border border-[var(--ash)] bg-[var(--graphite)] transition-all duration-500 hover:border-[var(--phosphor)] hover:shadow-[0_0_40px_var(--phosphor-glow)] h-full flex flex-col">
        {/* Project image */}
        {project.image && (
          <div className="relative aspect-video overflow-hidden flex-shrink-0">
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
              />
            </motion.div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--graphite)] via-transparent to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="relative p-6 space-y-4 flex flex-col flex-1">
          <div className="flex items-start gap-4">
            <span className="font-mono text-[var(--phosphor)] text-sm opacity-60">
              {indexStr}
            </span>
            <div className="flex-1">
              <h3 className="text-xl font-display text-[var(--text-bright)] group-hover:text-[var(--phosphor)] transition-colors duration-300">
                {primaryHref ? (
                  // The title link is stretched via ::after to make the whole
                  // card clickable without nesting <a> elements.
                  <Link
                    href={primaryHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                  >
                    <GlitchText text={project.title} />
                  </Link>
                ) : (
                  <GlitchText text={project.title} />
                )}
              </h3>
            </div>
          </div>

          <p className="text-[var(--text-medium)] text-sm leading-relaxed line-clamp-3">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-auto pt-4">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="font-mono text-xs px-2 py-1 rounded bg-[var(--smoke)] text-[var(--text-dim)] border border-[var(--ash)]"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Source/demo links sit above the stretched title link via z-10. */}
          <div className="flex gap-4 pt-2 relative z-10">
            {project.github && (
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--text-dim)] hover:text-[var(--phosphor)] transition-colors"
              >
                <Github size={16} />
                <span className="font-mono">source</span>
              </Link>
            )}
            {project.demo && (
              <Link
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--text-dim)] hover:text-[var(--phosphor)] transition-colors"
              >
                <ExternalLink size={16} />
                <span className="font-mono">demo</span>
              </Link>
            )}
          </div>
        </div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-24 h-24 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gradient-to-r from-transparent via-[var(--phosphor)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
        </div>
      </div>
    </motion.article>
  );
};
