/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        headspace: {
          orange: '#f58b44',
          'orange-dark': '#f06e1d',
          cream: '#fdf5eb',
          slate: '#4b5161',
          blue: '#52b6de',
        },
        dark: {
          bg: '#1a1a2e',
          'bg-secondary': '#16213e',
          'bg-tertiary': '#0f3460',
          text: '#e8e8e8',
          'text-secondary': '#a8a8a8',
          border: '#2d3748',
        },
      },
    },
  },
  plugins: [],
}
