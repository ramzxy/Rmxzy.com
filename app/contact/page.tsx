"use client";
import { Github, Mail, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import Particles from "../components/particles";
import React, { useEffect, useState, RefObject } from "react";
import { useAsciiText, bloody } from "react-ascii-text";

const socials = [
	{
		icon: <Twitter size={20} />,
		href: "https://twitter.com/ramsyTheDream",
		label: "Twitter",
		handle: "@ramsyTheDream",
	},
	{
		icon: <Mail size={20} />,
		href: "mailto:iliamirzaali.uni@gmail.com",
		label: "Email",
		handle: "iliamirzaali.uni@gmail.com",
	},
	{
		icon: <Github size={20} />,
		href: "https://github.com/ramzxy",
		label: "Github",
		handle: "ramzxy",
	},
];

export default function Example() {
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
		text: ["C O N T A C T"],
	}) as RefObject<HTMLPreElement>;

	// Handle client-side rendering
	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
			<Particles
				className="absolute inset-0 z-10 pointer-events-none"
				quantity={100}
			/>
			<Navigation />
			<div className="container flex flex-col items-center justify-center min-h-screen px-4 mx-auto">
				{/* ASCII text header */}
				<pre 
					ref={asciiTextRef}
					className="py-2 px-0.5 z-20 text-transparent bg-white cursor-default text-edge-outline font-Courier New text-2xs sm:text-xs md:text-sm whitespace-pre bg-clip-text mb-12 scale-75 md:scale-90"
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
				
				<div className="grid w-full grid-cols-1 gap-8 mx-auto sm:grid-cols-3 lg:gap-16 z-20">
					{socials.map((s) => (
						<Card key={s.label}>
							<Link
								href={s.href}
								target="_blank"
								className="p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24 lg:pb-48 md:p-16"
							>
								<span
									className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
									aria-hidden="true"
								/>
								<span className="relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange">
									{s.icon}
								</span>{" "}
								<div className="z-10 flex flex-col items-center">
									<span className="lg:text-xl font-medium duration-150 xl:text-3xl text-zinc-200 group-hover:text-white font-display">
										{s.handle}
									</span>
									<span className="mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200">
										{s.label}
									</span>
								</div>
							</Link>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
