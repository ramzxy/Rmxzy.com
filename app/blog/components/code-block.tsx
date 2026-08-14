"use client";

import { isValidElement, useRef, useState, type ReactNode } from "react";

export function CodeBlock({ children }: { children: ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  const childClassName = isValidElement<{ className?: string }>(children)
    ? children.props.className ?? ""
    : "";
  const language = /language-([\w-]+)/.exec(childClassName)?.[1] ?? "code";

  const copy = async () => {
    const text = preRef.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("error");
    }
    window.setTimeout(() => setState("idle"), 1800);
  };

  return (
    <div className="code-block">
      <div className="code-block__bar">
        <span>{language}</span>
        <button type="button" onClick={copy} aria-live="polite">
          {state === "copied" ? "copied" : state === "error" ? "failed" : "copy"}
        </button>
      </div>
      <pre ref={preRef}>{children}</pre>
    </div>
  );
}
