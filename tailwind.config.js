/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/renderer/**/*.{html,ts,tsx,js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
