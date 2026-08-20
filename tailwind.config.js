/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FAF8F5',
          100: '#F5F1E8',
          200: '#EBE5D8',
          300: '#DDD4C0',
          800: '#4A463F',
          900: '#24221F',
        },
        ink: {
          DEFAULT: '#24221F',
          muted: '#8E897F',
          light: '#B5B0A6',
          dark: '#141312',
        },
        stamp: {
          ivory: '#FFFDF8',
          white: '#FFFFFF',
          cream: '#F4EBD9',
          pink: '#FBE8E8',
          blue: '#E3EDF5',
          green: '#E5EDE5',
          black: '#222222',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Noto Serif SC"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        stamp: '0 8px 30px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        'stamp-lg': '0 16px 40px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.08)',
        paper: '0 1px 3px rgba(0,0,0,0.05), 0 10px 25px -5px rgba(0,0,0,0.04)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(var(--rot, 0deg))' },
          '50%': { transform: 'translateY(-6px) rotate(var(--rot, 0deg))' },
        }
      }
    },
  },
  plugins: [],
}
