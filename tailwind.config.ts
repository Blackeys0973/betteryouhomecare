import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#08090c",
        surface: "#111318",
        line: "rgba(242,237,228,0.12)",
        bone: "#f2ede4",
        lilac: "#c9a7ff",
        brand: { DEFAULT: "#3f9be0", dark: "#0a73b0" },
        plum: { DEFAULT: "#b351eb", deep: "#1a1028" },
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
