import { notFound } from "next/navigation";
import { Navigation } from "../../components/nav";
import React from "react";

export default function ProjectPage() {
  return (
    <div className="relative min-h-screen bg-[#0C0C0C]">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-300 sm:text-4xl">
            Project Details
          </h2>
          <p className="mt-4 text-zinc-500">
            This project is currently unavailable.
          </p>
        </div>
        <div className="w-full h-px bg-zinc-800" />
        
        <div className="flex items-center justify-center py-20">
          <p className="text-zinc-400">Project details are currently under development.</p>
        </div>
      </div>
    </div>
  );
}
