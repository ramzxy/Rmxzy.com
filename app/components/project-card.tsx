"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";

export interface Project {
  id: string;
  index: number;
  title: string;
  description: string;
  image?: string;
  tech: string[];
  github?: string;
  demo?: string;
}

interface ProjectCardProps {
  project: Project;
  delay?: number;
}

export const ProjectCard = ({ project, delay = 0 }: ProjectCardProps) => {
  const indexStr = String(project.index).padStart(2, "0");

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
                className="object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
              />
            </motion.div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--graphite)] via-transparent to-transparent" />
          </div>
        )}

        {/* Primary Link Overlay - Makes whole card clickable */}
        {(project.demo || project.github) && (
          <Link
            href={project.demo || project.github || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-0"
            aria-label={`View details for ${project.title}`}
          />
        )}

        {/* Content */}
        <div className="relative p-6 space-y-4 pointer-events-none flex flex-col flex-1">
          {/* Index + Title row - Pointer events auto via parent link but text selection allowed if needed, though overlay covers it. 
              Actually overlay covers everything z-0. We need specific interactive elements to be z-10 
          */}
          <div className="flex items-start gap-4">
            <span className="font-mono text-[var(--phosphor)] text-sm opacity-60">
              {indexStr}
            </span>
            <div className="flex-1">
              <h3 className="text-xl font-display text-[var(--text-bright)] group-hover:text-[var(--phosphor)] transition-colors duration-300">
                {project.title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-[var(--text-medium)] text-sm leading-relaxed line-clamp-3">
            {project.description}
          </p>

          {/* Tech stack */}
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

          {/* Links - Explicitly interactive elements need z-10 and pointer-events-auto */}
          <div className="flex gap-4 pt-2 relative z-10 pointer-events-auto">
            {project.github && (
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--text-dim)] hover:text-[var(--phosphor)] transition-colors"
                onClick={(e) => e.stopPropagation()}
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
                onClick={(e) => e.stopPropagation()}
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
