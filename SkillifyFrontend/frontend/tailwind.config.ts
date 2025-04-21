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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)", // Define these variables in your CSS or :root
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        // Additional Colors
        info: "#3b82f6", // Light blue
        success: "#34d399", // Light green
        warning: "#fbbf24", // Yellow
        danger: "#f87171", // Light red
      },
      spacing: {
        // Custom spacing options
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
      },
      borderRadius: {
        // Custom border radius options
        "4xl": "2rem",
      },
      boxShadow: {
        // Custom box shadows
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // Plugin for better form elements
    require("@tailwindcss/typography"), // Plugin for typography styles
    require("@tailwindcss/aspect-ratio"), // Plugin for maintaining aspect ratios
  ],
};

export default config;
