import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CSS variable based colors (shadcn/ui pattern)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Decagon-inspired palette
        primary: {
          DEFAULT: '#5754FF',
          50: '#F0F0FF',
          100: '#E0E0FF',
          200: '#C2C1FF',
          300: '#A3A1FF',
          400: '#8582FF',
          500: '#5754FF',
          600: '#2F2BFF',
          700: '#0700FF',
          800: '#0500C4',
          900: '#040091',
        },
        cyan: {
          DEFAULT: '#4EEBF3',
          50: '#E8FDFE',
          100: '#D1FAFC',
          200: '#A3F5F9',
          300: '#75F0F6',
          400: '#4EEBF3',
          500: '#1AE4EE',
          600: '#14B5BC',
          700: '#0F878C',
          800: '#0A585B',
          900: '#052A2B',
        },
        orange: {
          DEFAULT: '#FF6F22',
          50: '#FFF0E8',
          100: '#FFE1D1',
          200: '#FFC3A3',
          300: '#FFA575',
          400: '#FF8747',
          500: '#FF6F22',
          600: '#E85500',
          700: '#B54200',
          800: '#822F00',
          900: '#4F1D00',
        },
        slate: {
          50: '#F8F9FC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#0F0E1A',
        },
        // Semantic colors
        confidence: {
          high: '#4EEBF3',
          medium: '#FF6F22',
          low: '#94A3B8',
        },
        gap: {
          critical: '#EF4444',
          important: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
