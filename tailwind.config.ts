import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#24180f",
        mocha: "#4b3024",
        champagne: "#e8c98c",
        amber: "#a64b24",
        oat: "#f8f2e7",
        linen: "#fffaf1",
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "serif"],
      },
      boxShadow: {
        soft: "0 24px 70px rgba(75, 48, 36, 0.14)",
        button: "0 14px 30px rgba(166, 75, 36, 0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;
