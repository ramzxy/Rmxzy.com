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
    default: "rmxzy",
    template: "%s | rmxzy.com",
  },
  description: "Hacker • Fullstack • Distributed Systems",
  metadataBase: new URL("https://rmxzy.com"),
  openGraph: {
    title: "rmxzy",
    description: "Hacker • Fullstack • Distributed Systems",
    url: "https://rmxzy.com",
    siteName: "rmxzy",
    locale: "en-US",
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
    title: "rmxzy",
    card: "summary_large_image",
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
  name: "Ilia",
  alternateName: "rmxzy",
  url: "https://rmxzy.com",
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
    "https://blog.rmxzy.com",
    "https://ramsy.eu",
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "NL",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
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