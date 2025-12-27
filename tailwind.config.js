/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pastel-blue': '#E1F5FE', // Light Blue 50
        'pastel-red': '#FFEBEE', // Red 50
        'pastel-green': '#E8F5E9', // Green 50
        'pastel-yellow': '#FFF9C4', // Yellow 100 - Distinct yellow
        'pastel-purple': '#E1BEE7', // Purple 100 - Distinct purple
        'pastel-cream': '#FFFFFF', // Pure white for better contrast
        'accent-blue': '#42A5F5', // Blue 400
        'accent-red': '#FF7043', // Deep Orange 400
        'accent-green': '#66BB6A', // Green 400
        'accent-yellow': '#FBC02D', // Yellow 700 - Gold
        'accent-purple': '#AB47BC', // Purple 400
        'text-soft': '#455A64', // Blue Grey 700
      },
      fontFamily: {
        'display': ['Comfortaa', 'cursive'],
        'body': ['Quicksand', 'sans-serif'],
      },
    },
    plugins: [],
  }
}

