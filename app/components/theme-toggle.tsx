"use client";

import { useEffect, useState } from "react";
import styles from "./theme-toggle.module.css";

type Theme = "dark" | "light";

const getActiveTheme = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";

export const ThemeToggle = () => {
  // The visual state is driven by <html data-theme>, which is set by the
  // blocking head script before first paint. React only tracks the value for
  // the accessible label, so hydration cannot move or restyle the control.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(getActiveTheme());

    const syncTheme = () => {
      setTheme(getActiveTheme());
    };
    window.addEventListener("theme-change", syncTheme);
    return () => window.removeEventListener("theme-change", syncTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = getActiveTheme() === "dark" ? "light" : "dark";
    // Apply the transition class briefly so colors interpolate when the data
    // attribute swaps the CSS variables, then remove it so hover transitions
    // remain snappy.
    const root = document.documentElement;
    root.classList.add("theme-transitioning");
    setTheme(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch {}
    root.setAttribute("data-theme", newTheme);
    window.dispatchEvent(new CustomEvent("theme-change", { detail: newTheme }));
    window.setTimeout(() => root.classList.remove("theme-transitioning"), 380);
  };

  const nextMode = theme === "light" ? "ink" : "paper";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={styles.toggle}
      aria-label={theme ? `Switch to ${nextMode} mode` : "Switch appearance"}
      aria-pressed={theme === null ? undefined : theme === "light"}
    >
      <span className={styles.plates} aria-hidden>
        <i className={styles.inkPlate} />
        <i className={styles.paperPlate} />
      </span>
      <span className={styles.labels} aria-hidden>
        <span className={styles.inkLabel}>ink</span>
        <span className={styles.paperLabel}>paper</span>
      </span>
    </button>
  );
};
