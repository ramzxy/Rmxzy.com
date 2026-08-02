"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CommandPalette } from "./command-palette";
import styles from "./site-header.module.css";
import { ThemeToggle } from "./theme-toggle";

const navigation = [
  { index: "01", name: "work", href: "/#work" },
  { index: "02", name: "writing", href: "/#writing", section: "writing" },
  { index: "03", name: "about", href: "/#about" },
];

type SiteHeaderProps = {
  activeSection?: "writing";
};

export function SiteHeader({ activeSection }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  const navHref = (item: (typeof navigation)[number]) =>
    activeSection === item.section ? "/blog" : item.href;

  return (
    <>
      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo} aria-label="rmxzy home">
            rmxzy<span>_</span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Primary navigation">
            {navigation.map((item) => {
              const active = activeSection === item.section;

              return (
                <Link
                  key={item.href}
                  href={navHref(item)}
                  className={active ? styles.activeNav : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  <span>{item.index}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className={styles.headerTools}>
            <button
              type="button"
              className={styles.paletteButton}
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
            >
              <span>command</span>
              <kbd>Ctrl K</kbd>
            </button>
            <ThemeToggle />
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            className={styles.mobileNav}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            aria-label="Mobile navigation"
          >
            {navigation.map((item, index) => {
              const active = activeSection === item.section;

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.045, duration: 0.25 }}
                >
                  <Link
                    href={navHref(item)}
                    className={active ? styles.activeNav : undefined}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.index}</span>
                    {item.name}
                  </Link>
                </motion.div>
              );
            })}
            <Link
              href="mailto:me@rmxzy.com"
              className={styles.mobileContact}
              onClick={() => setMobileMenuOpen(false)}
            >
              me@rmxzy.com ↗
            </Link>
            <Link
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileResume}
              onClick={() => setMobileMenuOpen(false)}
            >
              resume ↗
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>

      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
    </>
  );
}
