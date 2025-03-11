"use client";
import { Github, Mail, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";

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
	{
		icon: <Linkedin size={20} />,
		href: "https://www.linkedin.com/in/ilia-mirzaali-3187b8282/",
		label: "Linkedin",
		handle: "Ilia Mirzaali",
	},
];

export default function Example() {
	return (
		<div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
			<Navigation />
			<div className="container flex items-center justify-center min-h-screen px-4 mx-auto">
				<div className="grid w-full grid-cols-1 gap-8 mx-auto mt-32 sm:mt-0 sm:grid-cols-3 lg:gap-16">
					{socials.map((s) => (
						<Card>
							<Link
								href={s.href}
								target="_blank"
								className="p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24 lg:pb-48 md:p-16"
							>
								<span
									className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
									aria-hidden="true"
								/>
								<span className="relative z-10 flex items-center justify-center w-14 h-14 text-base duration-1000 border rounded-full text-zinc-300 group-hover:text-zinc-100 group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange">
									{s.icon}
								</span>{" "}
								<div className="z-10 flex flex-col items-center">
									<span className="lg:text-2xl font-medium duration-150 xl:text-4xl text-zinc-300 group-hover:text-zinc-100 font-display">
										{s.handle}
									</span>
									<span className="mt-4 text-base md:text-lg text-center duration-1000 text-zinc-500 group-hover:text-zinc-300">
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
