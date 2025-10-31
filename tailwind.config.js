/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#f190e6",
          "background-light": "#f6f7f8",
          "background-dark": "#11121",
          "foreground-light": "#0e151b",
          "foreground-dark": "#f0f2f3",
          "subtle-light": "#4e7997",
          "subtle-dark": "#a0b4c3",
          "card-light": "#ffffff",
          "card-dark": "#1a252f",
          "border-light": "#e7eef3",
          "border-dark": "#2c3b4a"
        },
        fontFamily: {
          display: ["Epilogue", "sans-serif"]
        },
        borderRadius: {
          DEFAULT: "0.5rem",
          lg: "1rem",
          xl: "1.5rem",
          full: "9999px"
        }
      },
    },
    plugins: [],
    darkMode: "class"
  }