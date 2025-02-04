import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navbar: "#282828", // Color de fondo del navbar
        text: "#FFFFFF", // Texto blanco
      },
      fontFamily: {
        sans: ["Arial", "sans-serif"], // Fuente básica, puedes cambiarla si lo necesitas
      },
    },
  },
  plugins: [],
} satisfies Config;
