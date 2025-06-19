/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        'dark-bg': '#121212',
        'dark-text': '#E5E5E5',
        'light-bg': '#FFFFFF',
        'light-text': '#000000',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0.3' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        bounceIn: 'bounceIn 0.6s ease-out',
      },
    },
  },
  plugins: [],
};
