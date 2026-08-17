import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#0a0a0b",
          900: "#121214",
          800: "#1a1a1d",
          700: "#232326",
        },
        gold: {
          400: "#e8c974",
          500: "#d4af37",
          600: "#b8932c",
        },
        electric: {
          400: "#5eb8ff",
          500: "#2f8fe0",
          600: "#1c6fc0",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(circle at top, rgba(212,175,55,0.12), transparent 60%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
