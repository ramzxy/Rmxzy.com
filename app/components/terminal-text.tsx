"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface TerminalTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
  onComplete?: () => void;
}

export const TerminalText = ({
  text,
  speed = 50,
  delay = 0,
  className = "",
  cursor = true,
  onComplete,
}: TerminalTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const typeText = useCallback(() => {
    setIsTyping(true);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  useEffect(() => {
    const timeout = setTimeout(typeText, delay);
    return () => clearTimeout(timeout);
  }, [typeText, delay]);

  // Blinking cursor
  useEffect(() => {
    if (!cursor) return;
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, [cursor]);

  return (
    <span className={`font-mono ${className}`}>
      {displayedText}
      {cursor && (
        <motion.span
          className="inline-block w-[0.6em] h-[1.1em] ml-0.5 align-middle"
          style={{ 
            backgroundColor: "var(--phosphor)",
            opacity: showCursor ? 1 : 0,
          }}
          animate={{ opacity: showCursor && isTyping ? 1 : showCursor ? 0.7 : 0 }}
        />
      )}
    </span>
  );
};

// Multi-line terminal output effect
interface TerminalOutputProps {
  lines: string[];
  lineDelay?: number;
  typeSpeed?: number;
  className?: string;
}

export const TerminalOutput = ({
  lines,
  lineDelay = 150,
  typeSpeed = 30,
  className = "",
}: TerminalOutputProps) => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, index]);
        }, index * lineDelay),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [lines, lineDelay]);

  return (
    <div className={`font-mono space-y-1 ${className}`}>
      {lines.map((line, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-[var(--phosphor)] opacity-50">{">"}</span>
          {visibleLines.includes(index) ? (
            <TerminalText
              text={line}
              speed={typeSpeed}
              cursor={index === lines.length - 1}
            />
          ) : (
            <span className="opacity-0">{line}</span>
          )}
        </div>
      ))}
    </div>
  );
};
