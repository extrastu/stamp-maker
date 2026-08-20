/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7059E8',
          hover: '#5F48DB',
          light: '#F4F1FD',
          border: '#D8CFFB',
        },
        paper: {
          50: '#FAF8F5',
          100: '#F7F6F2',
          200: '#EBE7DF',
          300: '#DDD8CE',
          800: '#4A463F',
          900: '#24221F',
        },
        ink: {
          DEFAULT: '#1E1E22',
          muted: '#8A8A93',
          light: '#B5B5BE',
          dark: '#141416',
        },
        darkbg: {
          DEFAULT: '#141418',
          card: '#1F1F26',
          pill: '#2B2B36',
          border: '#353542',
        },
        stamp: {
          ivory: '#FFFDF8',
          white: '#FFFFFF',
          cream: '#FCE5B5',
          green: '#85D386',
          pink: '#F7B8CE',
          blue: '#96C7EB',
          black: '#1E1E1E',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        stamp: '0 12px 36px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        'stamp-lg': '0 20px 48px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08)',
        card: '0 2px 12px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)',
      },
    },
  },
  plugins: [],
}
