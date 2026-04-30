"use client";

import { Command } from "cmdk";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  FileText,
  ExternalLink,
  Sun,
  Hash,
  BookOpen,
} from "lucide-react";

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: "navigate" | "open" | "do";
  icon: React.ReactNode;
  perform: () => void;
  keywords?: string[];
};

type CommandPaletteProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

export const CommandPalette = ({ open, setOpen }: CommandPaletteProps) => {
  const [search, setSearch] = useState("");

  // Cmd/Ctrl + K toggles the palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // Reset query each time we open
  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const go = (id: string) => () => {
    setOpen(false);
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const openUrl = (url: string, newTab = true) => () => {
    setOpen(false);
    if (newTab) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = url;
    }
  };

  const toggleTheme = () => {
    setOpen(false);
    const html = document.documentElement;
    html.classList.add("theme-transitioning");
    const next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
    html.setAttribute("data-theme", next);
    window.dispatchEvent(new Event("theme-change"));
    try {
      localStorage.setItem("theme", next);
    } catch {}
    window.setTimeout(
      () => html.classList.remove("theme-transitioning"),
      380,
    );
  };

  const actions: Action[] = [
    // Navigate
    {
      id: "nav-work",
      label: "Go to work",
      hint: "[01]",
      group: "navigate",
      icon: <Hash size={14} />,
      perform: go("work"),
      keywords: ["jobs", "ramsy", "drone"],
    },
    {
      id: "nav-projects",
      label: "Go to projects",
      hint: "[02]",
      group: "navigate",
      icon: <Hash size={14} />,
      perform: go("projects"),
      keywords: ["khor", "cedis", "side"],
    },
    {
      id: "nav-about",
      label: "Go to about",
      hint: "[03]",
      group: "navigate",
      icon: <Hash size={14} />,
      perform: go("about"),
      keywords: ["bio", "skills"],
    },
    {
      id: "nav-connect",
      label: "Go to contact",
      hint: "[05]",
      group: "navigate",
      icon: <Hash size={14} />,
      perform: go("connect"),
      keywords: ["email", "hire", "reach"],
    },

    // Open external
    {
      id: "open-github",
      label: "Open GitHub",
      hint: "github.com/ramzxy",
      group: "open",
      icon: <Github size={14} />,
      perform: openUrl("https://github.com/ramzxy"),
    },
    {
      id: "open-linkedin",
      label: "Open LinkedIn",
      hint: "/in/ramzxy",
      group: "open",
      icon: <Linkedin size={14} />,
      perform: openUrl("https://linkedin.com/in/ramzxy"),
    },
    {
      id: "open-blog",
      label: "Open blog",
      hint: "blog.rmxzy.com",
      group: "open",
      icon: <BookOpen size={14} />,
      perform: openUrl("https://blog.rmxzy.com"),
    },
    {
      id: "open-ramsy",
      label: "Open ramsy.eu",
      hint: "security firm",
      group: "open",
      icon: <ExternalLink size={14} />,
      perform: openUrl("https://ramsy.eu"),
    },
    {
      id: "open-drone",
      label: "Open droneteamtwente.nl",
      hint: "uni team",
      group: "open",
      icon: <ExternalLink size={14} />,
      perform: openUrl("https://droneteamtwente.nl"),
    },
    {
      id: "open-khor",
      label: "Open Khor on GitHub",
      hint: "kernel orchestra",
      group: "open",
      icon: <Github size={14} />,
      perform: openUrl("https://github.com/ramzxy/khor"),
    },
    {
      id: "open-cedis",
      label: "Open Cedis on GitHub",
      hint: "redis clone",
      group: "open",
      icon: <Github size={14} />,
      perform: openUrl("https://github.com/ramzxy/Cedis"),
    },

    // Do
    {
      id: "do-email",
      label: "Email me",
      hint: "me@rmxzy.com",
      group: "do",
      icon: <Mail size={14} />,
      perform: openUrl("mailto:me@rmxzy.com", false),
    },
    {
      id: "do-cv",
      label: "Download resume",
      hint: "PDF",
      group: "do",
      icon: <FileText size={14} />,
      perform: openUrl("/resume.pdf"),
    },
    {
      id: "do-theme",
      label: "Toggle theme",
      hint: "light / dark",
      group: "do",
      icon: <Sun size={14} />,
      perform: toggleTheme,
    },
  ];

  const groupLabels: Record<Action["group"], string> = {
    navigate: "navigate",
    open: "open",
    do: "do",
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--void)]/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Panel */}
      <div className="relative w-full max-w-xl rounded-lg border border-[var(--ash)] bg-[var(--graphite)] shadow-[0_0_60px_var(--phosphor-glow)] overflow-hidden font-mono">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--ash)] bg-[var(--smoke)]">
          <div className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
            <span className="w-2 h-2 rounded-full bg-[var(--phosphor)]" />
            <span>~/rmxzy</span>
          </div>
          <span className="text-[10px] text-[var(--text-ghost)] uppercase tracking-wider">
            esc to close
          </span>
        </div>

        {/* Prompt + input */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--ash)]">
          <span className="text-[var(--phosphor)] text-sm">$</span>
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="type a command... (work, github, email, theme)"
            className="flex-1 bg-transparent outline-none text-sm text-[var(--text-bright)] placeholder:text-[var(--text-ghost)]"
          />
        </div>

        {/* List */}
        <Command.List className="max-h-[50vh] overflow-y-auto py-2">
          <Command.Empty className="px-4 py-6 text-sm text-[var(--text-dim)]">
            <span className="text-[var(--ember)]">command not found:</span>{" "}
            {search}
          </Command.Empty>

          {(["navigate", "open", "do"] as const).map((group) => {
            const items = actions.filter((a) => a.group === group);
            return (
              <Command.Group
                key={group}
                heading={
                  <span className="px-4 text-[10px] uppercase tracking-wider text-[var(--phosphor)] opacity-60">
                    // {groupLabels[group]}
                  </span>
                }
                className="mb-2"
              >
                {items.map((a) => (
                  <Command.Item
                    key={a.id}
                    value={`${a.label} ${(a.keywords || []).join(" ")}`}
                    onSelect={a.perform}
                    className="flex items-center gap-3 px-4 py-2 mx-2 rounded text-sm cursor-pointer text-[var(--text-medium)] data-[selected=true]:bg-[var(--smoke)] data-[selected=true]:text-[var(--text-bright)] data-[selected=true]:border-l-2 data-[selected=true]:border-[var(--phosphor)] data-[selected=true]:pl-[14px] transition-colors"
                  >
                    <span className="text-[var(--text-dim)] shrink-0">
                      {a.icon}
                    </span>
                    <span className="flex-1 truncate">{a.label}</span>
                    {a.hint && (
                      <span className="text-xs text-[var(--text-ghost)] shrink-0">
                        {a.hint}
                      </span>
                    )}
                    <ArrowRight
                      size={12}
                      className="text-[var(--text-ghost)] opacity-0 group-data-[selected=true]:opacity-100 transition-opacity"
                    />
                  </Command.Item>
                ))}
              </Command.Group>
            );
          })}
        </Command.List>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--ash)] bg-[var(--smoke)] text-[10px] text-[var(--text-ghost)] uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
          </div>
          <span>⌘K</span>
        </div>
      </div>
    </Command.Dialog>
  );
};
