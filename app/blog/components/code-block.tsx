"use client";

import { isValidElement, useRef, useState, type ReactNode } from "react";

export function CodeBlock({ children }: { children: ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const childClassName = isValidElement<{ className?: string }>(children)
    ? children.props.className ?? ""
    : "";
  const language = /language-([\w-]+)/.exec(childClassName)?.[1] ?? "code";

  const copy = async () => {
    const text = preRef.current?.textContent ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="code-block">
      <div className="code-block__bar">
        <span>{language}</span>
        <button type="button" onClick={copy}>
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre ref={preRef}>{children}</pre>
    </div>
  );
}

