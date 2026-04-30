"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  openPalette: () => void;
};

const groups: { title: string; items: { keys: string[]; label: string }[] }[] = [
  {
    title: "navigate",
    items: [
      { keys: ["1"], label: "go to work" },
      { keys: ["2"], label: "go to projects" },
      { keys: ["3"], label: "go to about" },
      { keys: ["4"], label: "open blog" },
      { keys: ["5"], label: "go to contact" },
    ],
  },
  {
    title: "open",
    items: [
      { keys: ["g"], label: "open github" },
      { keys: ["t"], label: "toggle theme" },
    ],
  },
  {
    title: "interface",
    items: [
      { keys: ["⌘", "K"], label: "command palette" },
      { keys: ["?"], label: "this help" },
      { keys: ["esc"], label: "close overlay" },
    ],
  },
];

export const ShortcutsOverlay = ({ open, setOpen, openPalette }: Props) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[90] flex items-center justify-center px-4"
        >
          <div
            className="absolute inset-0 bg-[var(--void)]/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-lg border border-[var(--ash)] bg-[var(--graphite)] shadow-[0_0_60px_var(--phosphor-glow)] font-mono"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--ash)] bg-[var(--smoke)]">
              <div className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
                <span className="w-2 h-2 rounded-full bg-[var(--phosphor)]" />
                <span>~/help</span>
              </div>
              <span className="text-[10px] text-[var(--text-ghost)] uppercase tracking-wider">
                esc to close
              </span>
            </div>

            <div className="p-5 space-y-5">
              {groups.map((g) => (
                <div key={g.title}>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--phosphor)] opacity-60 mb-2">
                    // {g.title}
                  </div>
                  <div className="space-y-1.5">
                    {g.items.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between text-sm text-[var(--text-medium)]"
                      >
                        <span>{item.label}</span>
                        <div className="flex items-center gap-1">
                          {item.keys.map((k) => (
                            <kbd
                              key={k}
                              className="font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--smoke)] border border-[var(--ash)] text-[var(--text-bright)] min-w-[24px] text-center"
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={openPalette}
                className="w-full mt-2 px-3 py-2 rounded border border-[var(--ash)] hover:border-[var(--phosphor)] text-sm text-[var(--text-dim)] hover:text-[var(--phosphor)] transition-colors text-left"
              >
                <span className="text-[var(--phosphor)]">$</span> open command
                palette
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
