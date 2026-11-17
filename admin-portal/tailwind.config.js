/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#030b2a',
          900: '#061a5c',
          850: '#081850',
          800: '#0b1d63',
          700: '#10277c',
          600: '#16369c',
        },
        border: {
          blue: '#1c3a9e',
          light: '#2a4eb8',
        },
        brand: {
          cyan: '#19d3ff',
          blue: '#1e6bff',
          text: '#9fb4e8',
          muted: '#6c85cb',
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(25, 211, 255, 0.3)',
        'glow-blue': '0 0 20px -3px rgba(30, 107, 255, 0.4)',
        'glow-sm': '0 0 10px -2px rgba(25, 211, 255, 0.2)',
        'card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      borderRadius: {
        'card': '14px',
      },
    },
  },
  plugins: [],
}

