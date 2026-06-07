/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans SC', 'sans-serif'],
      },
      colors: {
        warm: {
          50: '#fffbeb',
          100: '#fff7ed',
          200: '#ffedd5',
          300: '#fed7aa',
          400: '#fdba74',
          500: '#fb923c',
          600: '#f97316',
          700: '#ea580c',
        },
      },
      animation: {
        'breathe': 'breathe 2s ease-in-out infinite',
        'breathe-ring': 'breathe-ring 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(249, 115, 22, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(249, 115, 22, 0)' },
        },
        'breathe-ring': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
