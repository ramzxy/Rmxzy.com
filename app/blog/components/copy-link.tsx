"use client";

import { useState } from "react";

export function CopyLink() {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setState("copied");
    } catch {
      setState("error");
    }
    window.setTimeout(() => setState("idle"), 1800);
  };

  return (
    <button type="button" className="copy-link" onClick={copy} aria-live="polite">
      {state === "copied" ? "link copied" : state === "error" ? "copy failed" : "copy link"}
    </button>
  );
}
