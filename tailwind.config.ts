import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B2A4A",
          light: "#243556",
          dark: "#141F38",
        },
        teal: {
          DEFAULT: "#2EC4B6",
          light: "#5DD4C8",
          dark: "#1FA396",
        },
        coral: {
          DEFAULT: "#FF6B6B",
          light: "#FF9999",
          dark: "#E54545",
        },
        positive: "#22C55E",
        negative: "#FF6B6B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
