"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

// Custom Discord icon since lucide doesn't have one
const DiscordIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

// Custom CodeForces icon
const CodeforcesIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M4.5 7.5A1.5 1.5 0 0 1 6 9v10.5a1.5 1.5 0 0 1-3 0V9a1.5 1.5 0 0 1 1.5-1.5zm7.5-3a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-3 0V6a1.5 1.5 0 0 1 1.5-1.5zm7.5 6a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-3 0V12a1.5 1.5 0 0 1 1.5-1.5z" />
  </svg>
);

// Custom GoodReads icon
const GoodreadsIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12.538 17.77c-3.546 0-6.046-2.256-6.046-5.418 0-3.152 2.5-5.412 6.046-5.412 3.545 0 6.045 2.26 6.045 5.412v6.648c0 3.24-2.5 5-5.98 5-2.52 0-4.56-.872-5.28-2.52l1.68-.96c.48 1.08 1.8 1.74 3.6 1.74 2.28 0 4.14-1.2 4.14-3.24v-1.68c-.84 1.2-2.4 2.16-4.2 2.16l-.005-.03zm.12-9.09c-2.52 0-4.32 1.8-4.32 3.66 0 1.86 1.8 3.66 4.32 3.66 2.52 0 4.32-1.8 4.32-3.66 0-1.86-1.8-3.66-4.32-3.66z" />
  </svg>
);

interface Social {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const socials: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/ramzxy",
    icon: <Github size={20} />,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/rmxzy",
    icon: <Linkedin size={20} />,
  },
  {
    name: "Discord",
    href: "https://discord.com/users/rmxzy",
    icon: <DiscordIcon size={20} />,
  },
  {
    name: "CodeForces",
    href: "https://codeforces.com/profile/Rmsy0x",
    icon: <CodeforcesIcon size={20} />,
  },
  {
    name: "GoodReads",
    href: "https://www.goodreads.com/user/show/192390307",
    icon: <GoodreadsIcon size={20} />,
  },
  {
    name: "Email",
    href: "mailto:hello@rmxzy.com",
    icon: <Mail size={20} />,
  },
];

interface SocialDockProps {
  className?: string;
  vertical?: boolean;
}

export const SocialDock = ({ className = "", vertical = false }: SocialDockProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className={`flex ${vertical ? "flex-col" : "flex-row"} gap-2 ${className}`}
    >
      {socials.map((social, index) => (
        <motion.div
          key={social.name}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 1.2 + index * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Link
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-11 h-11 rounded-lg bg-[var(--graphite)] border border-[var(--ash)] text-[var(--text-dim)] transition-all duration-300 hover:border-[var(--phosphor)] hover:text-[var(--phosphor)] hover:shadow-[0_0_20px_var(--phosphor-glow)]"
            aria-label={social.name}
          >
            {/* Icon */}
            <motion.span
              className="relative z-10"
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {social.icon}
            </motion.span>

            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-mono bg-[var(--smoke)] border border-[var(--ash)] text-[var(--text-bright)] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap">
              {social.name}
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};
