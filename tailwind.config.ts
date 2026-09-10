import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1B2A4A",
          light: "#2E4166",
          faint: "#7C8AA5",
        },
        paper: {
          DEFAULT: "#FAF7F0",
          dim: "#F2EDE1",
          line: "#DDD5C0",
        },
        seal: {
          DEFAULT: "#B8863B",
          light: "#D4A24C",
          dark: "#8F6A2E",
        },
        moss: {
          DEFAULT: "#3A7D5C",
        },
        rust: {
          DEFAULT: "#B33A3A",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        ruled: "repeating-linear-gradient(transparent, transparent 34px, #DDD5C0 34px, #DDD5C0 35px)",
      },
    },
  },
  plugins: [],
};
export default config;
