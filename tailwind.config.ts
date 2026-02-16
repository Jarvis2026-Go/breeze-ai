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
        "breeze-dark": {
          DEFAULT: "#2F3E46",
          light: "#3A4F58",
          dark: "#243238",
        },
        teal: {
          DEFAULT: "#4ECDC4",
          light: "#7EDBD5",
          dark: "#3AB5AD",
        },
        "breeze-gray": "#F0F4F3",
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
      boxShadow: {
        "glow-teal": "0 4px 24px -4px rgba(78, 205, 196, 0.25)",
        "glow-coral": "0 4px 24px -4px rgba(255, 107, 107, 0.25)",
        "glow-purple": "0 4px 24px -4px rgba(99, 102, 241, 0.25)",
        "glow-emerald": "0 4px 24px -4px rgba(16, 185, 129, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
