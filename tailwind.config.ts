import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: {
          50: "#eefdf5",
          100: "#d6fae6",
          500: "#0f9d58",
          600: "#0b7d46",
          700: "#0a6238",
        },
      },
    },
  },
  plugins: [],
};

export default config;
