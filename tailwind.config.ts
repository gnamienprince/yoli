import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'rose-nude': '#E8C7C3',
        marron: {
          DEFAULT: '#B99A83',
          light: '#D4BBA9',
          dark: '#8B7260',
        },
        ivoire: '#F7F1E8',
        noir: {
          DEFAULT: '#1A1A1A',
          light: '#2D2D2D',
        },
        or: {
          DEFAULT: '#C9A96E',
          light: '#E5D0A6',
          dark: '#9B7C4A',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      screens: {
        xs: '375px',
      },
      letterSpacing: {
        ultra: '0.3em',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out both',
        slideUp: 'slideUp 0.6s ease-out both',
        slideDown: 'slideDown 0.6s ease-out both',
        scaleIn: 'scaleIn 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
