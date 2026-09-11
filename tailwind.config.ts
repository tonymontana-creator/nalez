import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand:   '#0070F3',
        accent:  '#FF4500',
        success: '#00C853',
        danger:  '#FF1744',
        surface: '#111111',
        border:  '#1F1F1F',
      },
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(0,112,243,0.25)',
      },
    },
  },
  plugins: [],
}
export default config
