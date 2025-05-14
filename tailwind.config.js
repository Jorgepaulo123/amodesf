/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#ff5722',
          600: '#f4511e',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
};
