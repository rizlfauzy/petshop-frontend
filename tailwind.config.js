/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./public/styles/**/*.{css,scss}"],
  theme: {
    extend: {
      colors: {
        primary: "#402218"
      },
    },
  },
  plugins: [],
};

