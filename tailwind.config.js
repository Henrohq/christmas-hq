/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Host Grotesk', 'sans-serif'],
        'handwriting': ['Host Grotesk', 'sans-serif'],
        'script': ['Host Grotesk', 'sans-serif'],
        'apple': ['Host Grotesk', 'sans-serif'],
      },
      colors: {
        'christmas-red': '#c41e3a',
        'christmas-green': '#0d5c0d',
        'christmas-gold': '#ffd700',
        'snow': '#f5f5f5',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' },
          '100%': { textShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}


