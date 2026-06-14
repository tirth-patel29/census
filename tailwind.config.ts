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
        saffron: {
          50: "#fff8f0",
          100: "#ffefd6",
          200: "#ffd9a3",
          300: "#ffbe66",
          400: "#ff9f33",
          500: "#FF9933",
          600: "#e67e00",
          700: "#b85f00",
          800: "#8a4700",
          900: "#5c3000",
        },
        navy: {
          50: "#f0f4ff",
          100: "#dce6ff",
          200: "#b8ccff",
          300: "#80a5ff",
          400: "#4d7dff",
          500: "#1a55ff",
          600: "#0033cc",
          700: "#002299",
          800: "#001166",
          900: "#000080",
        },
        "gov-bg": "#f5f7fa",
        "gov-card": "#ffffff",
        "gov-border": "#dde2e8",
        "gov-text": "#1a2332",
        "gov-muted": "#6b7787",
      },
      fontFamily: {
        gujarati: ["Noto Sans Gujarati", "sans-serif"],
        sans: ["Noto Sans Gujarati", "Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.08)",
        "card-hover": "0 4px 16px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
