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
          DEFAULT: '#FFF4DD', // Warm custard paper background from codex-resets
          dark: '#1E1915',
        },
        card: '#FFFDF7', // Milky white sticker card
        ink: {
          DEFAULT: '#26201A', // Deep warm espresso ink
          2: '#5C5347',
          3: '#877B6B',
        },
        accent: {
          DEFAULT: '#FF5C2B', // Punchy loud tangerine orange from codex-resets
          hover: '#EE4518',
          tint: '#FFEAE4',
        },
        sun: {
          DEFAULT: '#FFD84D', // Sunny yellow
          hover: '#FFE070',
          tint: '#FFF7D6',
        },
        rose: {
          DEFAULT: '#FFB9CC', // Pastel rose
          tint: '#FFF0F4',
        },
        sky: {
          DEFAULT: '#A5DCFF', // Pastel sky blue
          tint: '#EBF6FF',
        },
        mint: {
          DEFAULT: '#A8F0C6', // Pastel mint
          tint: '#EDFCF3',
        },
        sand: '#F1E3C4', // Subtle inset fill
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"PingFang SC"', '"Hiragino Sans GB"', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
        display: ['"Arial Rounded MT Bold"', '-apple-system', 'BlinkMacSystemFont', '"PingFang SC"', 'sans-serif'],
      },
      boxShadow: {
        neo: '3px 3px 0 #26201A',
        'neo-sm': '2px 2px 0 #26201A',
        'neo-lg': '4px 4px 0 #26201A',
        'neo-xl': '6px 6px 0 #26201A',
        'neo-white': '3px 3px 0 #FFFFFF',
        'neo-white-sm': '2px 2px 0 #FFFFFF',
      },
      borderWidth: {
        neo: '2px',
        'neo-thick': '2.5px',
      },
    },
  },
  plugins: [],
}
