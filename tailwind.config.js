/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#080808',
          900: '#0e0e0e',
          850: '#141414',
          800: '#1a1a1a',
          750: '#212121',
          700: '#2a2a2a',
          600: '#3a3a3a',
        },
        sand: {
          50: '#f5f1ea',
          100: '#e8e4df',
          200: '#d4cec3',
          300: '#b0a99f',
          400: '#8a8479',
          500: '#5e5950',
        },
        gold: {
          300: '#e1c789',
          400: '#d4b572',
          500: '#c4a35a',
          600: '#a4863f',
          700: '#8b6914',
          800: '#5a4408',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.22em',
      },
      boxShadow: {
        editorial: '0 24px 60px -20px rgba(0,0,0,0.7)',
        gold: '0 0 0 1px rgba(196,163,90,0.35), 0 12px 30px -10px rgba(196,163,90,0.25)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out both',
        'fade-in': 'fadeIn 0.4s ease-out both',
        'sheet-up': 'sheetUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        sheetUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
