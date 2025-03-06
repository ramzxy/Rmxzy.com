import Link from "next/link";
import React from "react";
import { Navigation } from "../components/nav";

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen pb-16 bg-[#0C0C0C]">
      <Navigation />
      <div className="flex flex-col items-center justify-center w-full h-[80vh]">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-300">
          Projects Coming Soon
        </h1>
        <p className="mt-4 text-zinc-500 text-center max-w-md">
          This section is currently under development. Please check back later.
        </p>
        <Link 
          href="/"
          className="mt-8 px-6 py-3 text-zinc-300 border border-zinc-700 rounded-md hover:bg-zinc-800 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
