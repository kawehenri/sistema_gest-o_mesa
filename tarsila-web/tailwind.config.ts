import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#C65D3A",
          dark: "#A9492B",
          light: "#D97F5E",
        },
        graphite: {
          DEFAULT: "#1F1B18",
          soft: "#2D2926",
        },
        ivory: {
          DEFAULT: "#F8F4EE",
          dark: "#F0E9DF",
        },
        card: "#FFFDFC",
        sage: {
          DEFAULT: "#7A8B6D",
          light: "#9AAE8A",
          bg: "#EDF1EA",
        },
        gold: {
          DEFAULT: "#C89B3C",
          light: "#DDB96A",
          bg: "#FBF5E6",
        },
        sand: {
          DEFAULT: "#E7DDD2",
          dark: "#D4C8BA",
        },
        success: "#4F7A58",
        warning: "#D88A1D",
        error: "#C84332",
        info: "#3E6B89",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(31, 27, 24, 0.08), 0 1px 2px -1px rgba(31, 27, 24, 0.06)",
        "card-hover":
          "0 10px 25px -3px rgba(31, 27, 24, 0.10), 0 4px 6px -4px rgba(31, 27, 24, 0.08)",
        "card-lg":
          "0 20px 40px -8px rgba(31, 27, 24, 0.14), 0 8px 16px -4px rgba(31, 27, 24, 0.08)",
      },
      animation: {
        "pulse-soft": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, rgba(31,27,24,0.72) 0%, rgba(31,27,24,0.32) 60%, rgba(31,27,24,0.08) 100%)",
        "card-gradient":
          "linear-gradient(180deg, rgba(255,253,252,0) 0%, rgba(255,253,252,0.95) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
