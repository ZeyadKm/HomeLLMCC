/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
      },
    },
  },
  plugins: [],
}
