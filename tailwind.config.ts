import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#f7f4ef",
        surface: "#ffffff",
        line: "rgba(14,26,43,0.12)",
        bone: "#0e1a2b",
        lilac: "#6a4fe0",
        brand: { DEFAULT: "#0a73b0", dark: "#07507b" },
        plum: { DEFAULT: "#b351eb", deep: "#efe7fb" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.22, 1, 0.36, 1)",
        expo: "cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
