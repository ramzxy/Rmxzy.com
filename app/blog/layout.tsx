import type { Metadata } from "next";
import { SiteHeader } from "../components/site-header";
import { BlogFooter } from "./components/blog-footer";

export const metadata: Metadata = {
  title: {
    default: "Writing",
    template: "%s | rmxzy writing",
  },
  description:
    "Writing by Ilia Mirzaali about systems programming, security research, game AI, and building software.",
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    title: "Writing by Ilia Mirzaali — rmxzy",
    description:
      "Notes on systems, security, and software by Ilia Mirzaali.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="blog-shell">
      <a className="skip-link" href="#blog-content">Skip to writing</a>
      <SiteHeader activeSection="writing" />
      {children}
      <BlogFooter />
    </div>
  );
}
