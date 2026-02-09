"use client";

import React, { useRef, useEffect } from "react";

interface ParticlesProps {
	className?: string;
	quantity?: number;
	refresh?: boolean;
}

type Circle = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	alpha: number;
	targetAlpha: number;
	dx: number;
	dy: number;
};

type Explosion = {
	x: number;
	y: number;
	radius: number;
	maxRadius: number;
	alpha: number;
	sparks: Spark[];
};

type Spark = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	alpha: number;
	size: number;
};

const ATTRACT_RADIUS = 200;
const ATTRACT_FORCE = 0.08;
const EXPLODE_RADIUS = 180;
const EXPLODE_FORCE = 10;
const FRICTION = 0.96;
const SPARK_COUNT = 12;

export default function Particles({
	className = "",
	quantity = 300,
	refresh = false,
}: ParticlesProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasContainerRef = useRef<HTMLDivElement>(null);
	const context = useRef<CanvasRenderingContext2D | null>(null);
	const circles = useRef<Circle[]>([]);
	const explosions = useRef<Explosion[]>([]);
	const mouse = useRef({ x: -9999, y: -9999 });
	const canvasSize = useRef({ w: 0, h: 0 });
	const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
	const particleColorRef = useRef("255, 255, 255");

	const resizeCanvas = () => {
		if (canvasContainerRef.current && canvasRef.current && context.current) {
			circles.current.length = 0;
			canvasSize.current.w = canvasContainerRef.current.offsetWidth;
			canvasSize.current.h = canvasContainerRef.current.offsetHeight;
			canvasRef.current.width = canvasSize.current.w * dpr;
			canvasRef.current.height = canvasSize.current.h * dpr;
			canvasRef.current.style.width = `${canvasSize.current.w}px`;
			canvasRef.current.style.height = `${canvasSize.current.h}px`;
			context.current.scale(dpr, dpr);
		}
	};

	const circleParams = (): Circle => {
		const x = Math.floor(Math.random() * canvasSize.current.w);
		const y = Math.floor(Math.random() * canvasSize.current.h);

		const screenSize = Math.max(canvasSize.current.w, canvasSize.current.h);
		const baseSize = Math.random() * 1.2 + 0.3;
		const sizeMultiplier = Math.min(1.5, Math.max(0.7, screenSize / 2000));
		const size = Math.min(2, Math.max(0.6, baseSize * sizeMultiplier));

		const alpha = 0;
		const targetAlpha = parseFloat((Math.random() * 0.5 + 0.2).toFixed(2));
		const dx = (Math.random() - 0.5) * 0.2;
		const dy = (Math.random() - 0.5) * 0.2;
		return { x, y, vx: 0, vy: 0, size, alpha, targetAlpha, dx, dy };
	};

	const drawCircle = (circle: Circle, update = false) => {
		if (context.current) {
			context.current.beginPath();
			context.current.arc(circle.x, circle.y, circle.size, 0, 2 * Math.PI);
			context.current.fillStyle = `rgba(${particleColorRef.current}, ${circle.alpha})`;
			context.current.fill();

			if (!update) {
				circles.current.push(circle);
			}
		}
	};

	const clearContext = () => {
		if (context.current) {
			context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
		}
	};

	const drawParticles = () => {
		clearContext();
		for (let i = 0; i < quantity; i++) {
			drawCircle(circleParams());
		}
	};

	const initCanvas = () => {
		resizeCanvas();
		drawParticles();
	};

	const remapValue = (
		value: number,
		start1: number,
		end1: number,
		start2: number,
		end2: number,
	): number => {
		const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
		return remapped > 0 ? remapped : 0;
	};

	const drawExplosions = () => {
		if (!context.current) return;
		const ctx = context.current;
		const color = particleColorRef.current;

		for (let i = explosions.current.length - 1; i >= 0; i--) {
			const exp = explosions.current[i];

			// Expanding ring
			if (exp.alpha > 0.01) {
				ctx.beginPath();
				ctx.arc(exp.x, exp.y, exp.radius, 0, 2 * Math.PI);
				ctx.strokeStyle = `rgba(${color}, ${exp.alpha * 0.6})`;
				ctx.lineWidth = 1.5;
				ctx.stroke();

				// Inner glow ring
				ctx.beginPath();
				ctx.arc(exp.x, exp.y, exp.radius * 0.6, 0, 2 * Math.PI);
				ctx.strokeStyle = `rgba(${color}, ${exp.alpha * 0.3})`;
				ctx.lineWidth = 0.5;
				ctx.stroke();
			}

			// Sparks
			for (const spark of exp.sparks) {
				if (spark.alpha > 0.01) {
					ctx.beginPath();
					ctx.arc(spark.x, spark.y, spark.size, 0, 2 * Math.PI);
					ctx.fillStyle = `rgba(${color}, ${spark.alpha})`;
					ctx.fill();
				}

				spark.x += spark.vx;
				spark.y += spark.vy;
				spark.vx *= 0.97;
				spark.vy *= 0.97;
				spark.alpha *= 0.985;
				spark.size *= 0.99;
			}

			// Expand ring and fade
			exp.radius += (exp.maxRadius - exp.radius) * 0.06;
			exp.alpha *= 0.98;

			// Remove when fully faded
			if (exp.alpha < 0.005 && exp.sparks.every((s) => s.alpha < 0.005)) {
				explosions.current.splice(i, 1);
			}
		}
	};

	const animate = () => {
		clearContext();
		const { w, h } = canvasSize.current;
		const mx = mouse.current.x;
		const my = mouse.current.y;

		for (let i = circles.current.length - 1; i >= 0; i--) {
			const circle = circles.current[i];

			// Alpha fade based on edge proximity
			const closestEdge = Math.min(
				circle.x - circle.size,
				w - circle.x - circle.size,
				circle.y - circle.size,
				h - circle.y - circle.size,
			);
			const edgeFactor = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
			if (edgeFactor > 1) {
				circle.alpha += 0.04;
				if (circle.alpha > circle.targetAlpha) {
					circle.alpha = circle.targetAlpha;
				}
			} else {
				circle.alpha = circle.targetAlpha * edgeFactor;
			}

			// Mouse attraction — pull nearby particles toward cursor
			const adx = mx - circle.x;
			const ady = my - circle.y;
			const dist = Math.sqrt(adx * adx + ady * ady);
			if (dist < ATTRACT_RADIUS && dist > 1) {
				const strength = ATTRACT_FORCE * (1 - dist / ATTRACT_RADIUS);
				circle.vx += (adx / dist) * strength;
				circle.vy += (ady / dist) * strength;
			}

			// Apply friction to velocity
			circle.vx *= FRICTION;
			circle.vy *= FRICTION;

			// Update position (natural drift + velocity)
			circle.x += circle.dx + circle.vx;
			circle.y += circle.dy + circle.vy;

			// Out of bounds — respawn
			if (
				circle.x < -circle.size ||
				circle.x > w + circle.size ||
				circle.y < -circle.size ||
				circle.y > h + circle.size
			) {
				circles.current.splice(i, 1);
				drawCircle(circleParams());
			} else {
				drawCircle(circle, true);
			}
		}

		// Draw explosion effects on top
		drawExplosions();
	};

	// Main setup
	useEffect(() => {
		if (canvasRef.current) {
			context.current = canvasRef.current.getContext("2d");
		}
		initCanvas();

		let animId = 0;
		const tick = () => {
			animate();
			animId = window.requestAnimationFrame(tick);
		};
		tick();

		const handleMouseMove = (e: MouseEvent) => {
			if (canvasRef.current) {
				const rect = canvasRef.current.getBoundingClientRect();
				mouse.current.x = e.clientX - rect.left;
				mouse.current.y = e.clientY - rect.top;
			}
		};

		const handleClick = (e: MouseEvent) => {
			if (canvasRef.current) {
				const rect = canvasRef.current.getBoundingClientRect();
				const cx = e.clientX - rect.left;
				const cy = e.clientY - rect.top;

				// Scatter particles
				for (const circle of circles.current) {
					const edx = circle.x - cx;
					const edy = circle.y - cy;
					const dist = Math.sqrt(edx * edx + edy * edy);
					if (dist < EXPLODE_RADIUS && dist > 0) {
						const force = EXPLODE_FORCE * (1 - dist / EXPLODE_RADIUS);
						circle.vx += (edx / dist) * force;
						circle.vy += (edy / dist) * force;
					}
				}

				// Spawn explosion visual
				const sparks: Spark[] = [];
				for (let j = 0; j < SPARK_COUNT; j++) {
					const angle = (Math.PI * 2 * j) / SPARK_COUNT + (Math.random() - 0.5) * 0.4;
					const speed = 3 + Math.random() * 4;
					sparks.push({
						x: cx,
						y: cy,
						vx: Math.cos(angle) * speed,
						vy: Math.sin(angle) * speed,
						alpha: 0.7 + Math.random() * 0.3,
						size: 1 + Math.random() * 1.5,
					});
				}
				explosions.current.push({
					x: cx,
					y: cy,
					radius: 2,
					maxRadius: 80 + Math.random() * 40,
					alpha: 0.8,
					sparks,
				});
			}
		};

		window.addEventListener("resize", initCanvas);
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mousedown", handleClick);

		return () => {
			window.cancelAnimationFrame(animId);
			window.removeEventListener("resize", initCanvas);
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mousedown", handleClick);
		};
	}, []);

	useEffect(() => {
		initCanvas();
	}, [refresh]);

	// Theme color detection
	useEffect(() => {
		const updateColor = () => {
			const theme = document.documentElement.getAttribute("data-theme");
			particleColorRef.current = theme === "light" ? "0, 0, 0" : "255, 255, 255";
		};
		updateColor();

		const handleThemeChange = () => {
			updateColor();
			initCanvas();
		};
		window.addEventListener("theme-change", handleThemeChange);
		return () => window.removeEventListener("theme-change", handleThemeChange);
	}, []);

	return (
		<div className={className} ref={canvasContainerRef} aria-hidden="true">
			<canvas ref={canvasRef} />
		</div>
	);
}
