"use client";

import { useEffect } from "react";

const banner = `
██████  ███    ███ ██   ██ ███████ ██    ██
██   ██ ████  ████  ██ ██     ███   ██  ██
██████  ██ ████ ██   ███     ███     ████
██   ██ ██  ██  ██  ██ ██   ███       ██
██   ██ ██      ██ ██   ██ ███████    ██
`;

export const ConsoleEasterEgg = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Guard against React 18 strict-mode double-invoke logging twice
    const w = window as unknown as { __rmxzyHi?: boolean };
    if (w.__rmxzyHi) return;
    w.__rmxzyHi = true;

    const phosphor = "#39ff14";
    const dim = "#a1a1aa";
    const big = `color:${phosphor};font-family:monospace;font-size:11px;line-height:1.1;text-shadow:0 0 10px ${phosphor}80`;
    const tag = `color:${phosphor};font-weight:700`;
    const text = `color:${dim};font-family:monospace`;

    /* eslint-disable no-console */
    console.log(`%c${banner}`, big);
    console.log(
      "%cwelcome.%c if you're poking around the console, you're my kind of visitor.",
      tag,
      text,
    );
    console.log(
      "%c$%c are you hiring?  →  me@rmxzy.com",
      tag,
      "color:#fafafa;font-family:monospace",
    );
    console.log(
      "%c$%c source for this site:  →  github.com/ramzxy/Rmxzy.com",
      tag,
      text,
    );
    console.log(
      "%cps: try ⌘K or press ? for the keyboard map.",
      "color:#52525b;font-family:monospace;font-style:italic",
    );
    /* eslint-enable no-console */
  }, []);

  return null;
};
