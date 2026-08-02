"use client";

import { useState } from "react";

export function CopyLink() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button type="button" className="copy-link" onClick={copy}>
      {copied ? "link copied" : "copy link"}
    </button>
  );
}

