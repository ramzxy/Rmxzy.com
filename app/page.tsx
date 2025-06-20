"use client";

import Link from "next/link";
import React, { useEffect, useState, RefObject } from "react";
import Particles from "./components/particles";
import { useAsciiText, bloody, alligator, ansiShadow } from "react-ascii-text";

const navigation = [
  { name: "Contact", href: "/contact" },
  { name: "Blog", href: "https://blog.rmxzy.com" },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  // Initialize the ASCII text hooks for mobile and desktop with optimized settings
  const mobileAsciiTextRef = useAsciiText({
    animationCharacters: "▒░█",
    animationCharacterSpacing: 1,
    animationDelay: 5500,
    animationDirection: "down",
    animationInterval: 20,
    animationLoop: true,
    animationSpeed: 40,
    font: ansiShadow,
    text: ["R M X Z Y"],
  }) as RefObject<HTMLPreElement>;
  
  const desktopAsciiTextRef = useAsciiText({
    animationCharacters: "▒░█",
    animationCharacterSpacing: 1,
    animationDelay: 7500,
    animationDirection: "down",
    animationInterval: 20,
    animationLoop: true,
    animationSpeed: 40,
    font: ansiShadow,
    text: ["R M X Z Y"],
  }) as RefObject<HTMLPreElement>;

  // Handle client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden relative">
      <nav className="my-10 animate-fade-in-fast relative z-50">
        <ul className="flex items-center justify-center gap-8">
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
      <Particles
        className="absolute inset-0 z-10 animate-fade-in-fast pointer-events-none"
        quantity={120}
      />
      
      {/* Mobile version (hidden on md and larger screens) */}
      <div className="block md:hidden">
        <pre 
          ref={mobileAsciiTextRef}
          className="py-2 px-0.5 z-20 text-transparent bg-white cursor-default text-edge-outline font-mono text-[10px] whitespace-pre bg-clip-text text-center transform scale-90"
          style={{              
            textShadow: `
            0 0 5px rgba(255, 255, 255, 0.4),
            0 0 10px rgba(255, 255, 255, 0.3),
            0 0 15px rgba(255, 255, 255, 0.3),
            0 0 20px rgba(150, 150, 255, 0.2)
          `,
          filter: 'brightness(1.05) contrast(1.05)',
          fontFamily: 'monospace',
          letterSpacing: '0',
          lineHeight: '1',
          fontStretch: 'normal',
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"calt" 0, "liga" 0'
          }}
        ></pre>
      </div>
      
      {/* Desktop version (hidden on smaller screens) */}
      <div className="hidden md:block w-auto overflow-hidden">
        <div className="flex justify-center items-center">
          <pre 
            ref={desktopAsciiTextRef}
            className="py-4 px-1 z-20 text-transparent bg-white cursor-default text-edge-outline font-['Courier'] text-sm lg:text-base whitespace-pre bg-clip-text"
            style={{
              textShadow: `
                0 0 5px rgba(255, 255, 255, 0.4),
                0 0 10px rgba(255, 255, 255, 0.3),
                0 0 15px rgba(255, 255, 255, 0.3),
                0 0 20px rgba(150, 150, 255, 0.2)
              `,
              filter: 'brightness(1.05) contrast(1.05)',
              fontFamily: 'monospace',
              letterSpacing: '0',
              lineHeight: '1',
              fontStretch: 'normal',
              fontVariantNumeric: 'tabular-nums',
              fontFeatureSettings: '"calt" 0, "liga" 0'
            }}
          ></pre>
        </div>
      </div>

      <div className="my-10 text-center animate-fade-in-fast relative z-50">
        <h2 className="text-xs text-zinc-500">
          Currently working on {" "}
          <Link
            target="_blank"
            href="https://github.com/ramzxy/Cedis"
            className="underline duration-500 hover:text-zinc-300"
          >
            Cedis
          </Link> to create a better redis in C++.
        </h2>
      </div>
    </div>
  );
}
