const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Segoe UI", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-inktrap)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-inktrap)", ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        "gradient-radial":
          "radial-gradient(50% 50% at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    ...(process.env.NODE_ENV === "development"
      ? [require("tailwindcss-debug-screens")]
      : []),
  ],
};
