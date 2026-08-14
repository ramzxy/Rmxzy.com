"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./site-header.module.css";
import { ThemeToggle } from "./theme-toggle";

const CommandPalette = dynamic(
  () => import("./command-palette").then((module) => module.CommandPalette),
  { ssr: false },
);

type SectionId = "work" | "projects" | "writing" | "about";

const navigation: Array<{
  index: string;
  name: string;
  id: SectionId;
  href: string;
}> = [
  { index: "01", name: "work", id: "work", href: "/#work" },
  { index: "02", name: "projects", id: "projects", href: "/#projects" },
  { index: "03", name: "notes", id: "writing", href: "/#writing" },
  { index: "04", name: "about", id: "about", href: "/#about" },
];

type SiteHeaderProps = {
  activeSection?: SectionId;
};

export function SiteHeader({ activeSection }: SiteHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [visibleSection, setVisibleSection] = useState<SectionId | undefined>(
    activeSection,
  );
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (activeSection) {
      setVisibleSection(activeSection);
      return;
    }

    if (pathname !== "/") {
      setVisibleSection(undefined);
      return;
    }

    let frame = 0;
    const updateSection = () => {
      frame = 0;
      const marker = window.scrollY + window.innerHeight * 0.34;
      let nextSection: SectionId | undefined;

      for (const item of navigation) {
        const section = document.getElementById(item.id);
        if (section && section.offsetTop <= marker) nextSection = item.id;
      }

      setVisibleSection(nextSection);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateSection);
    };

    updateSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [activeSection, pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMobileMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    const focusFirstLink = window.requestAnimationFrame(() => {
      mobileNavRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    });

    const handleMenuKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const navControls = Array.from(
        mobileNavRef.current?.querySelectorAll<HTMLElement>("a, button") ?? [],
      );
      const controls = [menuButtonRef.current, ...navControls].filter(
        (control): control is HTMLElement => Boolean(control),
      );
      if (!controls.length) return;

      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleMenuKeys);
    return () => {
      window.cancelAnimationFrame(focusFirstLink);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleMenuKeys);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [mobileMenuOpen]);

  const navHref = (item: (typeof navigation)[number]) =>
    item.id === "writing" && activeSection === "writing" ? "/blog" : item.href;

  const openPaletteFromMenu = () => {
    setMobileMenuOpen(false);
    window.requestAnimationFrame(() => setPaletteOpen(true));
  };

  return (
    <>
      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo} aria-label="rmxzy home">
            RMXZY
          </Link>

          <nav className={styles.desktopNav} aria-label="Primary navigation">
            {navigation.map((item) => {
              const active = visibleSection === item.id;

              return (
                <Link
                  key={item.id}
                  href={navHref(item)}
                  className={active ? styles.activeNav : undefined}
                  aria-current={active ? (activeSection ? "page" : "location") : undefined}
                >
                  <span className={styles.navIndex}>{item.index}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className={styles.headerTools}>
            <button
              ref={menuButtonRef}
              type="button"
              className={styles.paletteButton}
              onClick={() => setPaletteOpen(true)}
              aria-label="Open site index"
            >
              <span>index</span>
              <kbd>Ctrl K</kbd>
            </button>
            <span className={styles.themeSlot}>
              <ThemeToggle />
            </span>
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <span>{mobileMenuOpen ? "close" : "menu"}</span>
              <i aria-hidden>{mobileMenuOpen ? "×" : "+"}</i>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className={styles.mobileBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden
            />
            <motion.nav
              ref={mobileNavRef}
              id="mobile-navigation"
              className={styles.mobileNav}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Mobile navigation"
            >
              <div className={styles.mobileChapters}>
                {navigation.map((item) => {
                  const active = visibleSection === item.id;

                  return (
                    <Link
                      key={item.id}
                      href={navHref(item)}
                      className={active ? styles.activeNav : undefined}
                      aria-current={active ? (activeSection ? "page" : "location") : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{item.index}</span>
                      <strong>{item.name}</strong>
                      <i aria-hidden>↘</i>
                    </Link>
                  );
                })}
              </div>

              <div className={styles.mobileUtilities}>
                <button type="button" onClick={openPaletteFromMenu}>
                  site index
                </button>
                <a href="mailto:me@rmxzy.com">email</a>
                <Link
                  href="https://github.com/ramzxy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github ↗
                </Link>
              </div>

              <div className={styles.mobileTheme}>
                <span>appearance</span>
                <ThemeToggle />
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
    </>
  );
}
