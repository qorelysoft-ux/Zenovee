import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'premium-dark': '#0a0e27',
        'premium-darker': '#050812',
        'glow-purple': '#a78bfa',
        'glow-blue': '#60a5fa',
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)',
        'gradient-dark': 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(96, 165, 250, 0.1) 100%)',
        'gradient-hero': 'radial-gradient(ellipse 80% 80% at 50% 20%, rgba(167, 139, 250, 0.15) 0%, rgba(96, 165, 250, 0.05) 100%)',
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(167, 139, 250, 0.3)',
        'glow-blue': '0 0 30px rgba(96, 165, 250, 0.3)',
        'glow-lg': '0 0 60px rgba(167, 139, 250, 0.2)',
        'glass-sm': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-lg': '0 8px 64px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(167, 139, 250, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(167, 139, 250, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.glass': {
          '@apply rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md': {},
        },
        '.glass-lg': {
          '@apply rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-glass-lg': {},
        },
        '.btn-premium': {
          '@apply rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 font-semibold text-white shadow-glow-purple hover:shadow-lg transition-all duration-300 hover:scale-105': {},
        },
        '.btn-secondary': {
          '@apply rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-all duration-300': {},
        },
        '.card-premium': {
          '@apply glass p-6 hover:border-white/20 transition-all duration-300': {},
        },
        '.text-gradient': {
          '@apply bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent': {},
        },
      })
    }),
  ],
}

export default config
