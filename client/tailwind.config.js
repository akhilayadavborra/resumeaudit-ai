/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        matte: {
          950: "#121113",
          900: "#18171a",
          850: "#1d1c20",
          800: "#232226",
          700: "#2c2b30",
          600: "#38373d",
        },
        accent: {
          orange: {
            DEFAULT: "#ff5a1f",
            light: "#ff8a4c",
            dark: "#c2410c",
          },
          amber: {
            DEFAULT: "#ffb300",
            light: "#ffd166",
            dark: "#b8860b",
          },
        },
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-orange": "0 0 14px rgba(255, 90, 31, 0.32), 0 0 28px rgba(255, 90, 31, 0.14)",
        "glow-amber": "0 0 14px rgba(255, 179, 0, 0.30), 0 0 28px rgba(255, 179, 0, 0.12)",
        "glow-orange-lg": "0 0 24px rgba(255, 90, 31, 0.4), 0 0 52px rgba(255, 90, 31, 0.18)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};