/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom brand color palette based on your specified colors
        primary: {
          50: '#f7f5f3',
          100: '#ede8e4',
          200: '#d1c6b8', // Your specified color
          300: '#bfb0a0',
          400: '#a08c70', // Your specified color
          500: '#8a7660',
          600: '#756450',
          700: '#5e3f1f', // Your specified color
          800: '#4a3218',
          900: '#2a1c1b', // Your specified color
          950: '#1a1110',
        },
        // Complementary accent colors
        accent: {
          50: '#faf9f7',
          100: '#f4f2ee',
          200: '#e8e4dc',
          300: '#d9d2c4',
          400: '#c6b8a4',
          500: '#b5a188',
          600: '#a08c70',
          700: '#8a7660',
          800: '#726252',
          900: '#5d5144',
          950: '#312a22',
        },
        // Warm neutrals for highlights
        warm: {
          50: '#fefdf9',
          100: '#fefbf0',
          200: '#fcf5de',
          300: '#f9ecc4',
          400: '#f4dd9f',
          500: '#edc970',
          600: '#e4b649',
          700: '#d19e2a',
          800: '#b07d25',
          900: '#8f6524',
          950: '#523611',
        }
      },
      fontFamily: {
        'catchy': ['Cormorant Garamond', 'Georgia', 'serif'], // Your specified font
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Cormorant Garamond', 'Crimson Text', 'Georgia', 'serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow-ripple': 'glowRipple 4s ease-in-out infinite',
        'sparkle': 'sparkle 6s ease-in-out infinite',
        'logo-glow': 'logoGlow 0.3s ease-out',
        'frame-in': 'frameIn 0.4s ease-out',
        'gentle-float': 'gentleFloat 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        glowRipple: {
          '0%': { 
            boxShadow: '0 0 20px rgba(160, 140, 112, 0.3)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(160, 140, 112, 0.6), 0 0 60px rgba(160, 140, 112, 0.3)',
            transform: 'scale(1.02)'
          },
          '100%': { 
            boxShadow: '0 0 20px rgba(160, 140, 112, 0.3)',
            transform: 'scale(1)'
          },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
        },
        logoGlow: {
          '0%': { boxShadow: '0 0 10px rgba(160, 140, 112, 0.5)' },
          '100%': { boxShadow: '0 0 25px rgba(160, 140, 112, 0.8), 0 0 35px rgba(160, 140, 112, 0.4)' },
        },
        frameIn: {
          '0%': { 
            transform: 'scale(0.95)',
            boxShadow: '0 0 0 0px rgba(160, 140, 112, 0.4)'
          },
          '100%': { 
            transform: 'scale(1)',
            boxShadow: '0 0 0 3px rgba(160, 140, 112, 0.6)'
          },
        },
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'large': '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 2px 10px -2px rgba(0, 0, 0, 0.04)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'static-bg': "url('/src/assets/images/backgrounds/background.png')",
      },
    },
  },
  plugins: [],
}