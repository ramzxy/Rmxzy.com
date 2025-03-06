"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export const Navigation: React.FC = () => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<header ref={ref}>
			<div
				className={`fixed inset-x-0 top-0 z-50 backdrop-blur duration-200 border-b ${
					isIntersecting
						? "bg-[#0C0C0C]/0 border-transparent"
						: "bg-[#0C0C0C]/80 border-zinc-800"
				}`}
			>
				<div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
					<div className="flex justify-between gap-8">
						{/* Projects link hidden for now
						<Link
							href="/projects"
							className="duration-200 text-[#9B3922]/80 hover:text-[#F2613F]"
						>
							Projects
						</Link>
						*/}
						<Link
							href="/contact"
							className="text-base md:text-lg duration-200 text-zinc-400 hover:text-zinc-200"
						>
							Contact
						</Link>
					</div>

					<Link
						href="/"
						className="duration-200 text-zinc-300 hover:text-zinc-100"
					>
						<ArrowLeft className="w-7 h-7" />
					</Link>
				</div>
			</div>
		</header>
	);
};
