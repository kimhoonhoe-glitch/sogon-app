import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#B4A7D6',
        secondary: '#F5E6D3',
        accent: '#A8E6CF',
        background: '#FFFEF7',
        text: '#2D3436',
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(180, 167, 214, 0.3), 0 4px 6px -2px rgba(180, 167, 214, 0.15)',
      },
    },
  },
  plugins: [],
}
export default config
