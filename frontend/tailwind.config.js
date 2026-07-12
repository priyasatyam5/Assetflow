/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          50: '#EEF3FF',
          100: '#DCE6FF',
          200: '#B9CDFF',
          300: '#8FADFC',
          400: '#5A86F5',
          500: '#2563EB',
          600: '#1D4FC7',
          700: '#173E9C',
          800: '#132F76',
          900: '#0F2358',
        },
        accent: {
          DEFAULT: '#14B8A6',
          50: '#EBFBF9',
          100: '#CFF5F0',
          200: '#9BE8DE',
          300: '#5FD5C6',
          400: '#2CC0AE',
          500: '#14B8A6',
          600: '#0F9385',
          700: '#0C7568',
          800: '#0A5C52',
          900: '#08453D',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        surface: {
          DEFAULT: '#F8FAFC',
          dark: '#0B1220',
        },
        ink: {
          DEFAULT: '#0F172A',
          dark: '#E7ECF5',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)',
        'gradient-radial': 'radial-gradient(circle at 30% 20%, rgba(37,99,235,0.25), transparent 60%)',
        'grid-pattern':
          'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(15, 23, 42, 0.12)',
        'glass-lg': '0 20px 60px -12px rgba(15, 23, 42, 0.25)',
        glow: '0 0 0 1px rgba(37,99,235,0.15), 0 8px 24px rgba(37,99,235,0.25)',
        card: '0 1px 2px rgba(15,23,42,0.06), 0 8px 24px rgba(15,23,42,0.06)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        dashMove: {
          to: { strokeDashoffset: -200 },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.55 },
          '50%': { opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        dashMove: 'dashMove 8s linear infinite',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
