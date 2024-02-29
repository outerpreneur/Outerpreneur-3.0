/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layout/*.liquid",
    "./sections/*.liquid",
    "./snippets/*.liquid",
    "./templates/*.liquid",
    "./locales/*.json",
    "./templates/costumers/*.liquid",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var"],
      },
      gridTemplateRows: {
        "[auto,auto,1fr]": "auto auto 1fr",
      },
      animation: {
        fadeInOut: "fadeInOut 3s ease-in-out infinite",
      },
      keyframes: {
        fadeInOut: {
          "0%": { opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      darkMode: ["selector", '[data-mode="dark"]'],
    },
  },
  plugins: [
    "prettier-plugin-tailwindcss",
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
  ],
};
