import "../global.css";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";
import {
  GeistPixelSquare,
  GeistPixelGrid,
  GeistPixelCircle,
  GeistPixelTriangle,
  GeistPixelLine,
} from "geist/font/pixel";

export const metadata: Metadata = {
  title: {
    default: "Ilia Mirzaali — Software Engineer & Hacker (rmxzy)",
    template: "%s | Ilia Mirzaali (rmxzy)",
  },
  description:
    "Ilia Mirzaali (rmxzy) — software engineer in the Netherlands. CS student building low-level systems in C++ (Cedis, eBPF, VPN clients, emulators) and shipping full-stack web.",
  metadataBase: new URL("https://rmxzy.com"),
  keywords: [
    "Ilia Mirzaali",
    "Ilia",
    "Mirzaali",
    "rmxzy",
    "ramzxy",
    "software engineer Netherlands",
    "distributed systems",
    "systems programming",
    "fullstack developer",
    "C++ developer",
    "eBPF",
    "Cedis",
    "ramsy.eu",
  ],
  authors: [{ name: "Ilia Mirzaali", url: "https://rmxzy.com" }],
  creator: "Ilia Mirzaali",
  publisher: "Ilia Mirzaali",
  alternates: {
    canonical: "https://rmxzy.com",
  },
  openGraph: {
    title: "Ilia Mirzaali — Software Engineer & Hacker (rmxzy)",
    description:
      "Ilia Mirzaali (rmxzy) — software engineer working on distributed systems, low-level programming, and full-stack web.",
    url: "https://rmxzy.com",
    siteName: "Ilia Mirzaali — rmxzy",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Ilia Mirzaali — rmxzy",
    description:
      "Software engineer working on distributed systems, low-level programming, and full-stack web.",
    card: "summary_large_image",
    creator: "@ramsyTheDream",
  },
  icons: {
    shortcut: "/favicon.png",
  },
};

// Schema.org Person markup. Lets Google, LinkedIn, Bing etc. show a richer
// knowledge-card / preview when this site is indexed or shared.
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ilia Mirzaali",
  alternateName: ["rmxzy", "ramzxy", "Ilia"],
  givenName: "Ilia",
  familyName: "Mirzaali",
  url: "https://rmxzy.com",
  image: "https://rmxzy.com/favicon.png",
  email: "mailto:me@rmxzy.com",
  jobTitle: "Software Engineer",
  description:
    "CS student building low-level systems in C++ (Redis clones, kernel-side eBPF, VPN clients, emulators) and shipping web work for organizations. Founded ramsy.eu.",
  knowsAbout: [
    "C++",
    "eBPF",
    "Linux",
    "Distributed Systems",
    "Operating Systems",
    "Network Security",
    "Algorithms",
  ],
  sameAs: [
    "https://github.com/ramzxy",
    "https://x.com/ramsyTheDream",
    "https://www.instagram.com/mirza.ilia/",
    "https://t.me/Rmsy0x",
    "https://blog.rmxzy.com",
    "https://ramsy.eu",
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "NL",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Ilia Mirzaali — rmxzy",
  alternateName: "rmxzy.com",
  url: "https://rmxzy.com",
  author: { "@type": "Person", name: "Ilia Mirzaali" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://rmxzy.com" />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${GeistPixelSquare.variable} ${GeistPixelGrid.variable} ${GeistPixelCircle.variable} ${GeistPixelTriangle.variable} ${GeistPixelLine.variable} ${
          process.env.NODE_ENV === "development" ? "debug-screens" : ""
        }`}
      >
        {children}
      </body>
    </html>
  );
}