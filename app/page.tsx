import Link from "next/link";
import React from "react";
import Particles from "./components/particles";

const navigation = [
  { name: "Contact", href: "/contact" },
  { name: "Blog", href: "https://blog.rmxzy.com" },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-[#0C0C0C] via-[#481E14]/30 to-[#0C0C0C]">
      <nav className="my-16 animate-fade-in">
        <ul className="flex items-center justify-center gap-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm duration-500 text-[#9B3922]/80 hover:text-[#F2613F]"
            >
              {item.name}
            </Link>
          ))}
        </ul>
      </nav>
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-[#481E14]/0 via-[#9B3922]/40 to-[#481E14]/0" />
      <Particles
        className="absolute inset-0 -z-10 animate-fade-in"
        quantity={100}
      />
      <h1 className="py-3.5 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-gradient-to-br from-[#9B3922] via-[#F2613F]/90 to-[#9B3922] cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text ">
        Rmxzy
      </h1>

      <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-[#481E14]/0 via-[#9B3922]/40 to-[#481E14]/0" />
      <div className="my-16 text-center animate-fade-in">
        <h2 className="text-sm text-[#9B3922]/90 ">
          Today im working on {" "}
          <Link
            target="_blank"
            href="https://rmxzy.com"
            className="underline duration-500 hover:text-zinc-300"
          >
            rmxzy.com
          </Link> to create an undected backdoor in your computer.
        </h2>
      </div>
    </div>
  );

}
