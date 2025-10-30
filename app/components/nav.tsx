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
				className={`fixed inset-x-0 top-0 z-50 duration-200 ${
					isIntersecting
						? "bg-zinc-900/0"
						: "bg-zinc-900/80"
				}`}
			>
				<div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
					<div className="flex justify-between gap-8">

						<Link
							href="https://blog.rmxzy.com"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							Blog
						</Link>
						<Link
							href="/contact"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							Contact
						</Link>
						<Link
							href="https://codeforces.com/profile/Rmsy0x"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							CodeForces
						</Link>
						<Link
							href="https://www.goodreads.com/user/show/192390307"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							GoodReads
						</Link>
					</div>

					<Link
						href="/"
						className="duration-200 text-zinc-300 hover:text-zinc-100"
					>
						<ArrowLeft className="w-6 h-6" />
					</Link>
				</div>
			</div>
		</header>
	);
};
