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
	color?: string;
};

type Spark = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	alpha: number;
	size: number;
};

type Ship = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	angle: number;
	faction: "rebel" | "empire";
	shootCooldown: number;
	alpha: number;
	targetAlpha: number;
};

type Laser = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	life: number;
	maxLife: number;
	faction: "rebel" | "empire";
};

// Particle constants
const ATTRACT_RADIUS = 200;
const ATTRACT_FORCE = 0.08;
const EXPLODE_RADIUS = 180;
const EXPLODE_FORCE = 10;
const FRICTION = 0.96;
const SPARK_COUNT = 12;

// Ship battle constants
const SHIPS_PER_SIDE = 5;
const SHIP_SIZE = 14;
const SHIP_THRUST = 0.02;
const SHIP_FRICTION = 0.985;
const SHIP_MAX_SPEED = 2.5;
const SHIP_SHOOT_RANGE = 350;
const SHIP_SHOOT_COOLDOWN_MIN = 90;
const SHIP_SHOOT_COOLDOWN_MAX = 220;
const SHIP_EXPLODE_FORCE = 8;
const SHIP_SEPARATION_DIST = 120;
const SHIP_SEPARATION_FORCE = 0.04;
const LASER_SPEED = 4;
const LASER_LIFE = 180;
const LASER_LENGTH = 8;
const EDGE_MARGIN = 200;

// Faction colors
const REBEL_LASER = "100, 180, 255";
const EMPIRE_LASER = "255, 70, 70";
const REBEL_HULL = "70, 130, 200";
const EMPIRE_HULL = "180, 50, 50";

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
	const ships = useRef<Ship[]>([]);
	const lasers = useRef<Laser[]>([]);
	const mouse = useRef({ x: -9999, y: -9999 });
	const canvasSize = useRef({ w: 0, h: 0 });
	const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
	const particleColorRef = useRef("255, 255, 255");

	// ── Canvas setup ──────────────────────────────────

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

	const clearContext = () => {
		if (context.current) {
			context.current.clearRect(
				0,
				0,
				canvasSize.current.w,
				canvasSize.current.h,
			);
		}
	};

	const remapValue = (
		value: number,
		start1: number,
		end1: number,
		start2: number,
		end2: number,
	): number => {
		const remapped =
			((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
		return remapped > 0 ? remapped : 0;
	};

	// ── Particles ─────────────────────────────────────

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

	const drawParticles = () => {
		clearContext();
		for (let i = 0; i < quantity; i++) {
			drawCircle(circleParams());
		}
	};

	// ── Ships ─────────────────────────────────────────

	const createShip = (faction: "rebel" | "empire"): Ship => {
		const { w, h } = canvasSize.current;
		const x =
			faction === "rebel"
				? Math.random() * w * 0.3 + w * 0.05
				: Math.random() * w * 0.3 + w * 0.65;
		const y = Math.random() * (h - EDGE_MARGIN * 2) + EDGE_MARGIN;
		const angle = Math.random() * Math.PI * 2;
		return {
			x,
			y,
			vx: Math.cos(angle) * 0.3,
			vy: Math.sin(angle) * 0.3,
			angle,
			faction,
			shootCooldown: Math.floor(Math.random() * SHIP_SHOOT_COOLDOWN_MAX),
			alpha: 0,
			targetAlpha: 0.6 + Math.random() * 0.25,
		};
	};

	const initShips = () => {
		ships.current = [];
		lasers.current = [];
		for (let i = 0; i < SHIPS_PER_SIDE; i++) {
			ships.current.push(createShip("rebel"));
			ships.current.push(createShip("empire"));
		}
	};

	const drawShipShape = (ctx: CanvasRenderingContext2D, ship: Ship) => {
		ctx.save();
		ctx.translate(ship.x, ship.y);
		ctx.rotate(ship.angle);

		const hullColor = ship.faction === "rebel" ? REBEL_HULL : EMPIRE_HULL;
		const accentColor =
			ship.faction === "rebel" ? REBEL_LASER : EMPIRE_LASER;

		if (ship.faction === "rebel") {
			// Arrow fighter shape
			ctx.beginPath();
			ctx.moveTo(SHIP_SIZE, 0);
			ctx.lineTo(-SHIP_SIZE * 0.6, -SHIP_SIZE * 0.5);
			ctx.lineTo(-SHIP_SIZE * 0.2, 0);
			ctx.lineTo(-SHIP_SIZE * 0.6, SHIP_SIZE * 0.5);
			ctx.closePath();
			ctx.fillStyle = `rgba(${hullColor}, ${ship.alpha * 0.8})`;
			ctx.fill();
			ctx.strokeStyle = `rgba(${accentColor}, ${ship.alpha})`;
			ctx.lineWidth = 1;
			ctx.stroke();
		} else {
			// TIE fighter shape — cockpit + wing struts + panels
			ctx.beginPath();
			ctx.moveTo(0, -SHIP_SIZE * 0.7);
			ctx.lineTo(0, SHIP_SIZE * 0.7);
			ctx.strokeStyle = `rgba(${accentColor}, ${ship.alpha})`;
			ctx.lineWidth = 1;
			ctx.stroke();
			// Top wing panel
			ctx.beginPath();
			ctx.moveTo(-SHIP_SIZE * 0.25, -SHIP_SIZE * 0.7);
			ctx.lineTo(SHIP_SIZE * 0.25, -SHIP_SIZE * 0.7);
			ctx.stroke();
			// Bottom wing panel
			ctx.beginPath();
			ctx.moveTo(-SHIP_SIZE * 0.25, SHIP_SIZE * 0.7);
			ctx.lineTo(SHIP_SIZE * 0.25, SHIP_SIZE * 0.7);
			ctx.stroke();
			// Cockpit
			ctx.beginPath();
			ctx.arc(0, 0, SHIP_SIZE * 0.3, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(${hullColor}, ${ship.alpha * 0.8})`;
			ctx.fill();
			ctx.strokeStyle = `rgba(${accentColor}, ${ship.alpha})`;
			ctx.lineWidth = 0.8;
			ctx.stroke();
		}

		// Engine glow
		ctx.beginPath();
		ctx.arc(-SHIP_SIZE * 0.5, 0, 1.8, 0, Math.PI * 2);
		ctx.fillStyle = `rgba(${accentColor}, ${ship.alpha * 0.6})`;
		ctx.fill();

		ctx.restore();
	};

	const steerAngleToward = (
		current: number,
		target: number,
		amount: number,
	) => {
		let diff = target - current;
		while (diff > Math.PI) diff -= Math.PI * 2;
		while (diff < -Math.PI) diff += Math.PI * 2;
		return current + diff * amount;
	};

	const updateShips = () => {
		const { w, h } = canvasSize.current;
		const cx = w * 0.5;
		const cy = h * 0.5;

		for (const ship of ships.current) {
			// Fade in
			if (ship.alpha < ship.targetAlpha) {
				ship.alpha = Math.min(ship.targetAlpha, ship.alpha + 0.008);
			}

			// ── Edge avoidance: rotate heading toward center ──
			// How close to any edge (0 = at edge, 1 = at margin boundary)
			const edgeL = ship.x / EDGE_MARGIN;
			const edgeR = (w - ship.x) / EDGE_MARGIN;
			const edgeT = ship.y / EDGE_MARGIN;
			const edgeB = (h - ship.y) / EDGE_MARGIN;
			const edgeClosest = Math.min(edgeL, edgeR, edgeT, edgeB);

			if (edgeClosest < 1) {
				// Steer heading toward canvas center
				const toCenterAngle = Math.atan2(cy - ship.y, cx - ship.x);
				const urgency = Math.pow(1 - Math.max(0, edgeClosest), 2);
				ship.angle = steerAngleToward(
					ship.angle,
					toCenterAngle,
					0.06 + urgency * 0.12,
				);
			}

			// ── Separation: steer away from nearby ships ──
			let sepX = 0;
			let sepY = 0;
			for (const other of ships.current) {
				if (other === ship) continue;
				const sx = ship.x - other.x;
				const sy = ship.y - other.y;
				const sd = Math.sqrt(sx * sx + sy * sy);
				if (sd < SHIP_SEPARATION_DIST && sd > 1) {
					const push =
						SHIP_SEPARATION_FORCE *
						(1 - sd / SHIP_SEPARATION_DIST);
					sepX += (sx / sd) * push;
					sepY += (sy / sd) * push;
				}
			}
			if (sepX !== 0 || sepY !== 0) {
				const sepAngle = Math.atan2(sepY, sepX);
				ship.angle = steerAngleToward(ship.angle, sepAngle, 0.03);
			}

			// ── Random wandering: gentle sweeping curves ──
			ship.angle += (Math.random() - 0.5) * 0.04;

			// ── Thrust always forward along heading ──
			ship.vx += Math.cos(ship.angle) * SHIP_THRUST;
			ship.vy += Math.sin(ship.angle) * SHIP_THRUST;

			// Friction
			ship.vx *= SHIP_FRICTION;
			ship.vy *= SHIP_FRICTION;

			// Clamp speed
			const speed = Math.sqrt(ship.vx * ship.vx + ship.vy * ship.vy);
			if (speed > SHIP_MAX_SPEED) {
				ship.vx = (ship.vx / speed) * SHIP_MAX_SPEED;
				ship.vy = (ship.vy / speed) * SHIP_MAX_SPEED;
			}

			// Update position
			ship.x += ship.vx;
			ship.y += ship.vy;

			// Hard clamp — never leave canvas
			ship.x = Math.max(5, Math.min(w - 5, ship.x));
			ship.y = Math.max(5, Math.min(h - 5, ship.y));

			// ── Shoot at nearby enemies (don't chase them) ──
			ship.shootCooldown--;
			if (ship.shootCooldown <= 0) {
				let nearestEnemy: Ship | null = null;
				let nearestDist = Infinity;
				for (const other of ships.current) {
					if (other.faction === ship.faction) continue;
					const dx = other.x - ship.x;
					const dy = other.y - ship.y;
					const d = Math.sqrt(dx * dx + dy * dy);
					if (d < nearestDist) {
						nearestDist = d;
						nearestEnemy = other;
					}
				}

				if (nearestEnemy && nearestDist < SHIP_SHOOT_RANGE) {
					const dx = nearestEnemy.x - ship.x;
					const dy = nearestEnemy.y - ship.y;
					const aimAngle =
						Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.12;

					lasers.current.push({
						x: ship.x + Math.cos(ship.angle) * SHIP_SIZE,
						y: ship.y + Math.sin(ship.angle) * SHIP_SIZE,
						vx: Math.cos(aimAngle) * LASER_SPEED,
						vy: Math.sin(aimAngle) * LASER_SPEED,
						life: LASER_LIFE,
						maxLife: LASER_LIFE,
						faction: ship.faction,
					});

					ship.shootCooldown =
						SHIP_SHOOT_COOLDOWN_MIN +
						Math.floor(
							Math.random() *
								(SHIP_SHOOT_COOLDOWN_MAX -
									SHIP_SHOOT_COOLDOWN_MIN),
						);
				}
			}
		}
	};

	// ── Lasers ────────────────────────────────────────

	const drawLaser = (ctx: CanvasRenderingContext2D, laser: Laser) => {
		const alpha = laser.life / laser.maxLife;
		const color = laser.faction === "rebel" ? REBEL_LASER : EMPIRE_LASER;
		const speed = Math.sqrt(laser.vx * laser.vx + laser.vy * laser.vy);
		if (speed < 0.01) return;

		const nx = laser.vx / speed;
		const ny = laser.vy / speed;
		const x1 = laser.x - nx * LASER_LENGTH * 0.5;
		const y1 = laser.y - ny * LASER_LENGTH * 0.5;
		const x2 = laser.x + nx * LASER_LENGTH * 0.5;
		const y2 = laser.y + ny * LASER_LENGTH * 0.5;

		// Outer glow
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.strokeStyle = `rgba(${color}, ${alpha * 0.25})`;
		ctx.lineWidth = 3;
		ctx.lineCap = "round";
		ctx.stroke();

		// Core beam
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.strokeStyle = `rgba(${color}, ${alpha * 0.8})`;
		ctx.lineWidth = 1.2;
		ctx.stroke();

		// Bright center
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
		ctx.lineWidth = 0.4;
		ctx.stroke();
	};

	const updateLasers = () => {
		const { w, h } = canvasSize.current;

		for (let i = lasers.current.length - 1; i >= 0; i--) {
			const laser = lasers.current[i];
			laser.x += laser.vx;
			laser.y += laser.vy;
			laser.life--;

			if (
				laser.life <= 0 ||
				laser.x < -20 ||
				laser.x > w + 20 ||
				laser.y < -20 ||
				laser.y > h + 20
			) {
				lasers.current.splice(i, 1);
				continue;
			}

			// Collision with enemy ships
			let hit = false;
			for (const ship of ships.current) {
				if (ship.faction === laser.faction) continue;
				const dx = ship.x - laser.x;
				const dy = ship.y - laser.y;
				const d = Math.sqrt(dx * dx + dy * dy);
				if (d < SHIP_SIZE * 1.2) {
					const sparkColor =
						laser.faction === "rebel" ? REBEL_LASER : EMPIRE_LASER;
					const sparks: Spark[] = [];
					for (let j = 0; j < 5; j++) {
						const angle = Math.random() * Math.PI * 2;
						const spd = 1 + Math.random() * 2;
						sparks.push({
							x: laser.x,
							y: laser.y,
							vx: Math.cos(angle) * spd,
							vy: Math.sin(angle) * spd,
							alpha: 0.6 + Math.random() * 0.3,
							size: 0.5 + Math.random() * 0.7,
						});
					}
					explosions.current.push({
						x: laser.x,
						y: laser.y,
						radius: 1,
						maxRadius: 10 + Math.random() * 6,
						alpha: 0.4,
						sparks,
						color: sparkColor,
					});

					// Nudge the hit ship
					ship.vx += laser.vx * 0.2;
					ship.vy += laser.vy * 0.2;

					hit = true;
					break;
				}
			}
			if (hit) {
				lasers.current.splice(i, 1);
			}
		}
	};

	// ── Explosions ────────────────────────────────────

	const drawExplosions = () => {
		if (!context.current) return;
		const ctx = context.current;

		for (let i = explosions.current.length - 1; i >= 0; i--) {
			const exp = explosions.current[i];
			const color = exp.color || particleColorRef.current;

			if (exp.alpha > 0.01) {
				ctx.beginPath();
				ctx.arc(exp.x, exp.y, exp.radius, 0, 2 * Math.PI);
				ctx.strokeStyle = `rgba(${color}, ${exp.alpha * 0.6})`;
				ctx.lineWidth = 1.5;
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(exp.x, exp.y, exp.radius * 0.6, 0, 2 * Math.PI);
				ctx.strokeStyle = `rgba(${color}, ${exp.alpha * 0.3})`;
				ctx.lineWidth = 0.5;
				ctx.stroke();
			}

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

			exp.radius += (exp.maxRadius - exp.radius) * 0.06;
			exp.alpha *= 0.98;

			if (
				exp.alpha < 0.005 &&
				exp.sparks.every((s) => s.alpha < 0.005)
			) {
				explosions.current.splice(i, 1);
			}
		}
	};

	// ── Init ──────────────────────────────────────────

	const initCanvas = () => {
		resizeCanvas();
		drawParticles();
		initShips();
	};

	// ── Animate ───────────────────────────────────────

	const animate = () => {
		clearContext();
		const { w, h } = canvasSize.current;
		const mx = mouse.current.x;
		const my = mouse.current.y;

		// Update & draw particles
		for (let i = circles.current.length - 1; i >= 0; i--) {
			const circle = circles.current[i];

			const closestEdge = Math.min(
				circle.x - circle.size,
				w - circle.x - circle.size,
				circle.y - circle.size,
				h - circle.y - circle.size,
			);
			const edgeFactor = parseFloat(
				remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
			);
			if (edgeFactor > 1) {
				circle.alpha += 0.04;
				if (circle.alpha > circle.targetAlpha)
					circle.alpha = circle.targetAlpha;
			} else {
				circle.alpha = circle.targetAlpha * edgeFactor;
			}

			const adx = mx - circle.x;
			const ady = my - circle.y;
			const dist = Math.sqrt(adx * adx + ady * ady);
			if (dist < ATTRACT_RADIUS && dist > 1) {
				const strength = ATTRACT_FORCE * (1 - dist / ATTRACT_RADIUS);
				circle.vx += (adx / dist) * strength;
				circle.vy += (ady / dist) * strength;
			}

			circle.vx *= FRICTION;
			circle.vy *= FRICTION;
			circle.x += circle.dx + circle.vx;
			circle.y += circle.dy + circle.vy;

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

		// Update ships & lasers
		updateShips();
		updateLasers();

		// Draw lasers
		if (context.current) {
			for (const laser of lasers.current) {
				drawLaser(context.current, laser);
			}
			for (const ship of ships.current) {
				drawShipShape(context.current, ship);
			}
		}

		// Draw explosions on top
		drawExplosions();
	};

	// ── Effects ───────────────────────────────────────

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
						const force =
							EXPLODE_FORCE * (1 - dist / EXPLODE_RADIUS);
						circle.vx += (edx / dist) * force;
						circle.vy += (edy / dist) * force;
					}
				}

				// Scatter ships
				for (const ship of ships.current) {
					const edx = ship.x - cx;
					const edy = ship.y - cy;
					const dist = Math.sqrt(edx * edx + edy * edy);
					if (dist < EXPLODE_RADIUS && dist > 0) {
						const force =
							SHIP_EXPLODE_FORCE * (1 - dist / EXPLODE_RADIUS);
						ship.vx += (edx / dist) * force;
						ship.vy += (edy / dist) * force;
					}
				}

				// Deflect lasers
				for (const laser of lasers.current) {
					const edx = laser.x - cx;
					const edy = laser.y - cy;
					const dist = Math.sqrt(edx * edx + edy * edy);
					if (dist < EXPLODE_RADIUS && dist > 0) {
						const force = 4 * (1 - dist / EXPLODE_RADIUS);
						laser.vx += (edx / dist) * force;
						laser.vy += (edy / dist) * force;
					}
				}

				// Explosion visual
				const sparks: Spark[] = [];
				for (let j = 0; j < SPARK_COUNT; j++) {
					const angle =
						(Math.PI * 2 * j) / SPARK_COUNT +
						(Math.random() - 0.5) * 0.4;
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
			particleColorRef.current =
				theme === "light" ? "0, 0, 0" : "255, 255, 255";
		};
		updateColor();

		const handleThemeChange = () => {
			updateColor();
			initCanvas();
		};
		window.addEventListener("theme-change", handleThemeChange);
		return () =>
			window.removeEventListener("theme-change", handleThemeChange);
	}, []);

	return (
		<div className={className} ref={canvasContainerRef} aria-hidden="true">
			<canvas ref={canvasRef} />
		</div>
	);
}
