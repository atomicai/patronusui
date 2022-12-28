/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        marshal: ['Marshal', 'sans-serif'],
        dance: ['Dancing Script', 'cursive'],
        caveat: ['Caveat', 'cursive']
      },
      colors: {
        primary: '#A456F0',
        secondary: '#12071f'
      },
      animation: {
        'rocket-blink': 'blinker 1s linear infinite'
      },
      keyframes: {
        blinker: {
          '50%': { opacity: '0' }
        }
      }
    }
  },
  plugins: [require('tailwind-scrollbar')]
}
