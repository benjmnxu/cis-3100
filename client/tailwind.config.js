/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],  
  theme: {
    extend: {
      colors: {
        cream: "#faf3e0",
      },
    },
  },
  plugins: [],
};
