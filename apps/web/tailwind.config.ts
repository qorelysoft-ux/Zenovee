import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Ultra Premium Dark Mode
        'premium-dark': '#0B0F19',
        'premium-darker': '#111827',
        'premium-secondary': '#0B0F19',
        
        // Primary Gradient Colors
        'primary-purple': '#7C5CFF',
        'primary-blue': '#5B9CFF',
        'accent-glow': '#8B5CF6',
        
        // Light Mode
        'light-bg': '#F9FAFB',
        'light-section': '#FFFFFF',
        'light-border': '#E5E7EB',
        
        // Text Colors
        'text-light': '#FFFFFF',
        'text-dark': '#111827',
        'text-secondary': '#6B7280',
        
        // Legacy compatibility
        'glow-purple': '#7C5CFF',
        'glow-blue': '#5B9CFF',
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #7C5CFF 0%, #5B9CFF 100%)',
        'gradient-dark': 'linear-gradient(135deg, rgba(124, 92, 255, 0.1) 0%, rgba(91, 156, 255, 0.1) 100%)',
        'gradient-hero': 'radial-gradient(ellipse 80% 80% at 50% 20%, rgba(124, 92, 255, 0.15) 0%, rgba(91, 156, 255, 0.05) 100%)',
      },
      boxShadow: {
        // Dark mode glows (premium purple/blue)
        'glow-purple': '0 0 30px rgba(124, 92, 255, 0.3)',
        'glow-blue': '0 0 30px rgba(91, 156, 255, 0.3)',
        'glow-accent': '0 0 30px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 60px rgba(124, 92, 255, 0.2)',
        
        // Glass morphism
        'glass-sm': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-lg': '0 8px 64px rgba(0, 0, 0, 0.4)',
        
        // Light mode shadows (subtle soft gray)
        'light-sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'light-md': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'light-lg': '0 8px 32px rgba(0, 0, 0, 0.16)',
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
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 92, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(124, 92, 255, 0.6)' },
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
          '@apply inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-purple to-primary-blue px-6 py-3.5 font-semibold text-white shadow-[0_12px_30px_rgba(124,92,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(91,156,255,0.35)]': {},
        },
        '.btn-secondary': {
          '@apply inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10': {},
        },
        '.btn-secondary-dark': {
          '@apply inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-light-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-light-md': {},
        },
        '.card-premium': {
          '@apply rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl shadow-[0_20px_55px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/40 hover:shadow-[0_0_34px_rgba(124,92,255,0.25)]': {},
        },
        '.card-light': {
          '@apply rounded-2xl border border-slate-200 bg-white p-6 shadow-light-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-light-lg': {},
        },
        '.card-glass': {
          '@apply rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl shadow-[0_20px_55px_rgba(15,23,42,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/45 hover:shadow-[0_0_34px_rgba(124,92,255,0.28)]': {},
        },
        '.text-gradient': {
          '@apply bg-gradient-to-r from-primary-purple via-accent-glow to-primary-blue bg-clip-text text-transparent': {},
        },
      })
    }),
  ],
}

export default config
