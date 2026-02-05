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

        // ─── V3 Warm palette (Notion-inspired) ───
        warm: {
          50: '#FAF9F7',
          100: '#F8F7F4',
          150: '#F1F0EC',
          200: '#E8E6E1',
          300: '#D4D1CB',
          400: '#B0ADA6',
          500: '#9B9A97',
          600: '#787671',
          700: '#5C5A56',
          800: '#403E3B',
          900: '#37352F',
          950: '#1F1E1B',
        },

        // Accent — Notion blue
        accent: {
          DEFAULT: '#2383E2',
          light: '#DDEBF1',
          text: '#0B6E99',
          50: '#EBF5FF',
          100: '#DDEBF1',
          600: '#2383E2',
          700: '#1A6DC0',
        },

        // Confidence colors (Notion palette)
        confidence: {
          high: {
            DEFAULT: '#0F7B6C',
            bg: '#DDEDEA',
            text: '#0F7B6C',
          },
          medium: {
            DEFAULT: '#D9730D',
            bg: '#FAEBDD',
            text: '#D9730D',
          },
          low: {
            DEFAULT: '#E03E3E',
            bg: '#FBE4E4',
            text: '#E03E3E',
          },
        },

        // Semantic
        danger: {
          DEFAULT: '#E03E3E',
          bg: '#FBE4E4',
        },

        // Legacy neutral (mapped to warm for compat)
        neutral: {
          50: '#FAF9F7',
          100: '#F8F7F4',
          200: '#E8E6E1',
          300: '#D4D1CB',
          400: '#B0ADA6',
          500: '#9B9A97',
          600: '#787671',
          700: '#5C5A56',
          800: '#403E3B',
          900: '#37352F',
        },

        // Primary = warm-900
        primary: {
          DEFAULT: '#37352F',
          50: '#FAF9F7',
          900: '#37352F',
        },
      },

      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },

      fontSize: {
        // ─── V3 Typography scale ───
        // Marketing (homepage, start, legal)
        display: ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        h1: ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h2-marketing': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3-marketing': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-marketing': ['1rem', { lineHeight: '1.6' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],

        // Workspace — V3 Notion-inspired scale
        'ws-display': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],      // 24px — page titles
        'ws-heading': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],     // 18px — section headers
        'ws-subheading': ['0.9375rem', { lineHeight: '1.4', fontWeight: '500' }], // 15px — card titles
        'ws-body': ['0.875rem', { lineHeight: '1.6' }],                           // 14px — content text
        'ws-body-sm': ['0.8125rem', { lineHeight: '1.5' }],                       // 13px — sidebar items
        'ws-caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],      // 12px — badges, meta
        'ws-caption-sm': ['0.6875rem', { lineHeight: '1.3', fontWeight: '500', letterSpacing: '0.05em' }], // 11px — section labels

        // Legacy aliases
        'h2-workspace': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3-workspace': ['1rem', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['0.875rem', { lineHeight: '1.6' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.5' }],
        caption: ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        overline: ['0.6875rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '0.08em' }],
        h2: ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        h3: ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        small: ['0.875rem', { lineHeight: '1.5' }],
      },

      borderRadius: {
        xl: '1rem',
        lg: '0.5rem', // 8px — V3 standard
        md: '0.5rem', // 8px
        sm: '0.375rem',
      },

      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
        34: '8.5rem',
      },

      maxWidth: {
        content: '720px', // V3: wider content area
        'content-marketing': '720px',
        wide: '1120px',
        'full-bleed': '1400px',
      },

      width: {
        sidebar: '240px',
        'sidebar-sm': '220px',
        chat: '380px', // V3: slightly wider
        'chat-overlay': '380px',
        'toc-sidebar': '200px',
      },

      boxShadow: {
        soft: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
        medium: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        elevated: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.03)',
        card: '0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.05)',
      },

      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.2s ease-out',
        'slide-out-right': 'slideOutRight 0.2s ease-in',
        'pill-pulse': 'pillPulse 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'checkmark-draw': 'checkmarkDraw 0.2s ease-out forwards',
        'card-highlight': 'cardHighlight 2s ease-in-out',
        shimmer: 'shimmer 2s linear infinite',
        'typing-dot': 'typingDot 1.4s infinite ease-in-out',
        'badge-appear': 'badgeAppear 0.15s ease-out',
        'pulse-once': 'pulseOnce 0.6s ease-in-out',
        'expand-down': 'expandDown 0.15s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pillPulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        checkmarkDraw: {
          '0%': { strokeDashoffset: '16' },
          '100%': { strokeDashoffset: '0' },
        },
        cardHighlight: {
          '0%': { boxShadow: '0 0 0 0 rgba(35, 131, 226, 0)' },
          '15%': { boxShadow: '0 0 0 2px rgba(35, 131, 226, 0.3)' },
          '100%': { boxShadow: '0 0 0 0 rgba(35, 131, 226, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        typingDot: {
          '0%, 80%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '40%': { opacity: '1', transform: 'scale(1)' },
        },
        badgeAppear: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseOnce: {
          '0%': { boxShadow: '0 0 0 0 rgba(35, 131, 226, 0.4)' },
          '70%': { boxShadow: '0 0 0 6px rgba(35, 131, 226, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(35, 131, 226, 0)' },
        },
        expandDown: {
          '0%': { opacity: '0', maxHeight: '0' },
          '100%': { opacity: '1', maxHeight: '500px' },
        },
      },
      transitionDuration: {
        fast: '120ms',
        normal: '200ms',
        slow: '300ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
