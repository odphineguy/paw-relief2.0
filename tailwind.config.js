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
          // Primary Brand - Professional Blue
          primary: {
            DEFAULT: "#0284c7", // sky-600
            hover: "#0369a1",   // sky-700
            light: "#e0f2fe",   // sky-100
          },
          
          // Legacy Mappings (Updated values)
          "background-light": "#f8fafc", // slate-50
          "background-dark": "#0f172a",  // slate-900
          
          "foreground-light": "#0f172a", // slate-900
          "foreground-dark": "#f8fafc",  // slate-50
          
          "subtle-light": "#64748b", // slate-500
          "subtle-dark": "#94a3b8",  // slate-400
          
          "card-light": "#ffffff",
          "card-dark": "#1e293b", // slate-800
          
          "border-light": "#e2e8f0", // slate-200
          "border-dark": "#334155",  // slate-700

          // Semantic Status Colors
          success: "#10b981", // emerald-500
          warning: "#f59e0b", // amber-500
          error: "#ef4444",   // red-500
          info: "#3b82f6",    // blue-500
        },
        fontFamily: {
          display: ["Epilogue", "sans-serif"],
          body: ["Inter", "sans-serif"],
        },
        borderRadius: {
          DEFAULT: "0.5rem",
          md: "0.375rem",
          lg: "0.5rem", // Reduced rounding for more professional look
          xl: "0.75rem",
          '2xl': "1rem",
          full: "9999px"
        },
        boxShadow: {
            'soft': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            'up': '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
        }
      },
    },
    plugins: [],
    darkMode: "class"
  }