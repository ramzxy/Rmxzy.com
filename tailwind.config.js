const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Satoshi", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-geist-pixel-square)", "monospace"],
        display: ["var(--font-geist-pixel-square)", ...defaultTheme.fontFamily.sans],
        "pixel-square": ["var(--font-geist-pixel-square)", "monospace"],
        "pixel-grid": ["var(--font-geist-pixel-grid)", "monospace"],
        "pixel-circle": ["var(--font-geist-pixel-circle)", "monospace"],
        "pixel-triangle": ["var(--font-geist-pixel-triangle)", "monospace"],
        "pixel-line": ["var(--font-geist-pixel-line)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial":
          "radial-gradient(50% 50% at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in": "fade-in 1s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        typing: "typing 3s steps(30) 1s forwards",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(57, 255, 20, 0.15)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(57, 255, 20, 0.3)",
          },
        },
        typing: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [
    ...(process.env.NODE_ENV === "development"
      ? [require("tailwindcss-debug-screens")]
      : []),
  ],
};
