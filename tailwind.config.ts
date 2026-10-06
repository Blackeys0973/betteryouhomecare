import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b2540",
        brand: { DEFAULT: "#0a73b0", light: "#559ec8", dark: "#07507b" },
        plum: { DEFAULT: "#b351eb", soft: "#f3e6fc" },
        teal: "#006d77",
        cream: "#faf7f2",
        sand: "#f1ebe1",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
