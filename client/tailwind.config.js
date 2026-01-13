/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0c', // The deep black from the screenshots
        surface: '#16161a',    // Card/Section background
        accent: '#3b82f6',     // The "Start Focus" blue
        "accent-orange": '#f97316', // Tag orange
        "slate-custom": '#24242b',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}