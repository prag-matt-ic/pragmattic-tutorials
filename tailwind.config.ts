import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      white: '#F6F6F6',
      green: '#37FFA8',
      cyan: '#37F3FF',
      'light-grey': '#C7C4CC',
      'off-black': '#1E1B23',
      black: '#0A090C',
      transparent: 'transparent',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        'xs-h': { raw: '(max-height: 667px)' },
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
}
export default config
