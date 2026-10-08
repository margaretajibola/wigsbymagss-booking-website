/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        julius: ["var(--font-julius)", "sans-serif"],
        italiana: ["var(--font-italiana)", "serif"],
      },
    },
  },
  plugins: [],
};
