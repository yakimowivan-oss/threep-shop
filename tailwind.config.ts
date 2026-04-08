import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#A9342A',
        accent: '#F29774',
        bg: '#000000',
      },
      fontFamily: {
        onder: ['ONDER', 'sans-serif'],
        involve: ['Involve', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
