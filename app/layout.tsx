import "../global.css";
import { Inter } from "@next/font/google";
import LocalFont from "@next/font/local";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";

export const metadata: Metadata = {
  title: {
    default: "rmxzy",
    template: "%s | rmxzy.com",
  },
  description: "Software Engineer and 'Ethical' Hacker",
  openGraph: {
    title: "rmxzy",
    description:
      "Software Engineer and 'Ethical' Hacker",
    url: "https://rmxzy.com",
    siteName: "rmxzy.com",
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
    title: "Rmxzy",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/favicon_new.png",
    icon: [
      { url: "/favicon_new.png" },
      { url: "/favicon_new.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicon_new.png" },
      { url: "/favicon_new.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon_new.png",
      },
    ],
  },
};
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
      <head>
        <Analytics />
        <link rel="icon" href="/favicon_new.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon_new.png" type="image/png" />
      </head>
      <body
        className={`bg-black ${process.env.NODE_ENV === "development" ? "debug-screens" : undefined
          }`}
      >
        {children}
      </body>
    </html>
  );
}