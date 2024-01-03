/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}", "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"],
  theme: {
    extend: {},
    screens: {
      'mobile': '200px',
      'tablet1': '730px',
      'tablet': '980px',
      'laptop': '1200px',
      'desktop1': '1700px',
      'desktop2': '1950px',
      'desktop3': '2200px'
    },
  },
  plugins: [],
}

