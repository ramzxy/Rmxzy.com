"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const routes = [
  { href: "/#work", label: "work" },
  { href: "/#projects", label: "projects" },
  { href: "/blog", label: "writing" },
  { href: "/#about", label: "about" },
];

export default function NotFound() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="notfound">
      <motion.section
        className="notfound__sheet"
        initial={reduceMotion ? false : { opacity: 0, y: 18, rotate: -0.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="notfound__masthead">
          <span>RMXZY / 404</span>
          <span>page not found</span>
        </div>

        <div className="notfound__content">
          <p className="notfound__eyebrow">wrong turn / page unavailable</p>
          <h1>404</h1>
          {/* The strike sits in the flow between the numeral and the headline.
              Positioned absolutely it landed on whatever the sheet's height
              happened to put under it — the headline and two index links. */}
          <div className="notfound__strike" aria-hidden>
            NOT HERE / NOT HERE / NOT HERE / NOT HERE /
          </div>
          <h2>That page isn&apos;t here.</h2>
          <p>
            Maybe I moved it. Maybe the link is old. Either way, there is nothing here now.
          </p>
          <Image
            src="/art/dedsec/pc-trash.webp"
            alt=""
            width={300}
            height={363}
            sizes="5.5rem"
            className="notfound__trash"
            aria-hidden
          />
        </div>

        <nav className="notfound__index" aria-label="Site sections">
          {routes.map((route, index) => (
            <Link key={route.href} href={route.href}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {route.label}
              <i aria-hidden>↗</i>
            </Link>
          ))}
        </nav>

        <Link href="/" className="notfound__return">
          go back home <span>→</span>
        </Link>

        <div className="notfound__stamp" aria-hidden>
          <span>misplaced</span>
          <strong>RMXZY</strong>
          <span>still online</span>
        </div>
      </motion.section>
    </main>
  );
}
