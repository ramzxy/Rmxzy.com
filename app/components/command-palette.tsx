"use client";

import { Command } from "cmdk";
import { useEffect, useState } from "react";
import styles from "./command-palette.module.css";

type Action = {
  id: string;
  label: string;
  detail: string;
  group: "pages" | "elsewhere" | "actions";
  perform: () => void;
  keywords?: string[];
};

type CommandPaletteProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const go = (id: string) => () => {
    setOpen(false);
    requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.location.href = `/#${id}`;
    });
  };

  const openUrl = (url: string, newTab = true) => () => {
    setOpen(false);
    if (newTab) window.open(url, "_blank", "noopener,noreferrer");
    else window.location.href = url;
  };

  const toggleTheme = () => {
    setOpen(false);
    const root = document.documentElement;
    root.classList.add("theme-transitioning");
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    window.dispatchEvent(new CustomEvent("theme-change", { detail: next }));
    try {
      localStorage.setItem("theme", next);
    } catch {}
    window.setTimeout(() => root.classList.remove("theme-transitioning"), 380);
  };

  const actions: Action[] = [
    { id: "work", label: "Work", detail: "01", group: "pages", perform: go("work"), keywords: ["jobs", "ramsy", "drone"] },
    { id: "projects", label: "Projects", detail: "02", group: "pages", perform: go("projects"), keywords: ["code", "khor", "cedis"] },
    { id: "writing", label: "Writing", detail: "03", group: "pages", perform: openUrl("/blog", false), keywords: ["blog", "notes", "articles"] },
    { id: "about", label: "About", detail: "04", group: "pages", perform: go("about"), keywords: ["bio", "skills", "ilia"] },
    { id: "github", label: "GitHub", detail: "ramzxy", group: "elsewhere", perform: openUrl("https://github.com/ramzxy") },
    { id: "codeforces", label: "Codeforces", detail: "Rmsy0x", group: "elsewhere", perform: openUrl("https://codeforces.com/profile/Rmsy0x") },
    { id: "ramsy", label: "ramsy.eu", detail: "security", group: "elsewhere", perform: openUrl("https://ramsy.eu") },
    { id: "email", label: "Email Ilia", detail: "me@rmxzy.com", group: "actions", perform: openUrl("mailto:me@rmxzy.com", false), keywords: ["contact"] },
    { id: "resume", label: "Open resume", detail: "PDF", group: "actions", perform: openUrl("/Resume.pdf"), keywords: ["cv"] },
    { id: "theme", label: "Switch paper / ink", detail: "theme", group: "actions", perform: toggleTheme, keywords: ["dark", "light"] },
  ];

  const groupLabels: Record<Action["group"], string> = {
    pages: "On this site",
    elsewhere: "Elsewhere",
    actions: "Actions",
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Site index"
      className={styles.dialog}
    >
      <div className={styles.backdrop} onClick={() => setOpen(false)} aria-hidden />
      <div className={styles.panel}>
        <div className={styles.masthead}>
          <span>RMXZY / INDEX</span>
          <span>Esc closes</span>
        </div>

        <div className={styles.search}>
          <span aria-hidden>find</span>
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="pages, projects, links"
            autoFocus
          />
        </div>

        <Command.List className={styles.list}>
          <Command.Empty className={styles.empty}>
            Nothing here matches “{search}”.
          </Command.Empty>

          {(["pages", "elsewhere", "actions"] as const).map((group) => (
            <Command.Group
              key={group}
              heading={<span>{groupLabels[group]}</span>}
              className={styles.group}
            >
              {actions.filter((action) => action.group === group).map((action, index) => (
                <Command.Item
                  key={action.id}
                  value={`${action.label} ${(action.keywords ?? []).join(" ")}`}
                  onSelect={action.perform}
                  className={styles.item}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{action.label}</strong>
                  <small>{action.detail}</small>
                  <i aria-hidden>↗</i>
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>

        <div className={styles.footer}>
          <span>↑↓ move</span>
          <span>Enter open</span>
          <span>Ctrl K</span>
        </div>
      </div>
    </Command.Dialog>
  );
}
