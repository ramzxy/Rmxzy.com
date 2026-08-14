import Link from "next/link";
import styles from "./social-dock.module.css";

/* Every destination that is actually Ilia's, with its real handle printed —
   the dock is an index of evidence, not a row of logos. */
const socials = [
  { name: "github", handle: "ramzxy", href: "https://github.com/ramzxy" },
  { name: "email", handle: "me@rmxzy.com", href: "mailto:me@rmxzy.com" },
  { name: "x", handle: "@ramsyTheDream", href: "https://x.com/ramsyTheDream" },
  { name: "telegram", handle: "Rmsy0x", href: "https://t.me/Rmsy0x" },
  { name: "instagram", handle: "mirza.ilia", href: "https://www.instagram.com/mirza.ilia/" },
  { name: "codeforces", handle: "Rmsy0x", href: "https://codeforces.com/profile/Rmsy0x" },
  { name: "goodreads", handle: "ilia mirzaali", href: "https://www.goodreads.com/user/show/192390307" },
  { name: "resume", handle: "pdf", href: "/Resume.pdf" },
];

export function SocialDock({ className = "" }: { className?: string }) {
  return (
    <nav className={`${styles.dock} ${className}`} aria-label="Find Ilia elsewhere">
      <span className={styles.label}>elsewhere</span>
      <div className={styles.grid}>
        {socials.map((social) => {
          const external = !social.href.startsWith("mailto:");

          return (
            <Link
              key={social.name}
              href={social.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className={styles.link}
            >
              <span className={styles.service}>{social.name}</span>
              <strong className={styles.handle}>{social.handle}</strong>
              <i aria-hidden>↗</i>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
