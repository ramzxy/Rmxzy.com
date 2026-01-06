import "../global.css";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: {
    default: "rmxzy",
    template: "%s | rmxzy.com",
  },
  description: "Hacker • Fullstack • Distributed Systems",
  openGraph: {
    title: "rmxzy",
    description: "Hacker • Fullstack • Distributed Systems",
    url: "https://rmxzy.com",
    siteName: "rmxzy",
    images: [
      {
        url: "https://rmxzy.com/og.png",
        width: 1920,
        height: 1080,
      },
    ],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Analytics />
      </head>
      <body
        className={`${jetbrainsMono.variable} ${
          process.env.NODE_ENV === "development" ? "debug-screens" : ""
        }`}
      >
        {children}
      </body>
    </html>
  );
}