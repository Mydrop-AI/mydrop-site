import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: "#e6346c",
          purple: "#c000f5",
          blue: "#0066ff",
          dark: "#0f1019",
        },
      },
    },
  },
  plugins: [],
};

export default config;
