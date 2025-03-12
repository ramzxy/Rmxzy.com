"use client";

import Link from "next/link";
import React, { useEffect, useState, RefObject } from "react";
import Particles from "./components/particles";
import { useAsciiText, bloody, alligator } from "react-ascii-text";

const navigation = [
  { name: "Contact", href: "/contact" },
  { name: "Blog", href: "https://blog.rmxzy.com" },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  // Initialize the ASCII text with the useAsciiText hook
  const asciiTextRef = useAsciiText({
    animationCharacters: "▒░█",
    animationCharacterSpacing: 1,
    animationDelay: 4500,
    animationDirection: "down",
    animationInterval: 20,
    animationLoop: true,
    animationSpeed: 37,
    font: bloody,
    text: ["R M X Z Y"],
  }) as RefObject<HTMLPreElement>;

  // Handle client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden relative">
      <nav className="my-16 animate-fade-in relative z-50">
        <ul className="flex items-center justify-center gap-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm duration-500 text-zinc-400 hover:text-zinc-200"
            >
              {item.name}
            </Link>
          ))}
        </ul>
      </nav>
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <Particles
        className="absolute inset-0 z-10 animate-fade-in pointer-events-none"
        quantity={100}
      />
      
      {/* Replace the hardcoded ASCII art with the react-ascii-text component */}
      <pre 
        ref={asciiTextRef}
        className="py-3.5 px-0.5 z-20 text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-Courier New text-xs sm:text-sm md:text-base whitespace-pre bg-clip-text"
        style={{
          textShadow: `
            0 0 5px rgba(255, 255, 255, 0.5),
            0 0 10px rgba(255, 255, 255, 0.4),
            0 0 15px rgba(255, 255, 255, 0.3),
            0 0 20px rgba(150, 150, 255, 0.2)
          `,
          filter: 'brightness(1) contrast(1.05)'
        }}
      ></pre>

      <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div className="my-16 text-center animate-fade-in relative z-50">
        <h2 className="text-sm text-zinc-500">
          Today im working on {" "}
          <Link
            target="_blank"
            href="https://github.com/ramzxy/Kazem"
            className="underline duration-500 hover:text-zinc-300"
          >
            Kazem
          </Link> to create an undetected backdoor in your computer.
        </h2>
      </div>
    </div>
  );
}
