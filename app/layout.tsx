import "../global.css";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";

export const metadata: Metadata = {
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8e1d1" },
    { media: "(prefers-color-scheme: dark)", color: "#111011" },
  ],
  title: {
    default: "rmxzy",
    template: "%s | Ilia Mirzaali (rmxzy)",
  },
  description:
    "Ilia Mirzaali, known as rmxzy. I build systems software, security tools, websites, and the occasional project that turns Linux kernel events into sound.",
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
    title: "rmxzy",
    description:
      "Systems software, security tools, websites, and odd experiments by Ilia Mirzaali.",
    url: "https://rmxzy.com",
    siteName: "rmxzy",
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
      "Systems software, security tools, websites, and odd experiments.",
    card: "summary_large_image",
    creator: "@ramsyTheDream",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
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
    "https://rmxzy.com/blog",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","dark")}})()`,
          }}
        />
        <link
          rel="preload"
          href="/fonts/Whyte-Inktrap-500.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
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
        className={
          process.env.NODE_ENV === "development" ? "debug-screens" : undefined
        }
      >
        {children}
      </body>
    </html>
  );
}
