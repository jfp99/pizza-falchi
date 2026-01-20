/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic color system - Light mode (default)
        background: {
          primary: '#FEFCF8',
          secondary: '#FDF9F0',
          tertiary: '#F9F3E6',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#FFFFFF',
        },
        text: {
          primary: '#1A1410',
          secondary: '#4A3F35',
          tertiary: '#6B5F52',
          'on-dark': '#FEFCF8',
        },
        border: {
          DEFAULT: '#E6DED0',
          medium: '#D4C4A0',
          strong: '#B8A88C',
        },
        // Brand colors (logo-based)
        brand: {
          red: {
            DEFAULT: '#C41E1A',
            hover: '#A01815',
            light: '#E8857A',
            lighter: '#FDE9E7',
          },
          gold: {
            DEFAULT: '#D4AF37',
            hover: '#B8941F',
            light: '#E6C44D',
            lighter: '#F9F3E6',
          },
          green: {
            DEFAULT: '#009246',
            hover: '#007A3A',
            light: '#A8C686',
            lighter: '#E8F5E0',
          },
        },
        // Legacy aliases (for gradual migration)
        primary: {
          red: '#C41E1A',
          'red-dark': '#8B1A1D',
          'red-light': '#D63933',
          yellow: '#E6D5B3',
          'yellow-dark': '#D4C4A0',
          'yellow-light': '#F4E4C1',
          DEFAULT: '#C41E1A',
        },
        accent: {
          gold: '#D4AF37',
          'gold-dark': '#B8941F',
          'gold-light': '#E6C44D',
          green: '#009246',
          'green-light': '#00A651',
        },
        soft: {
          red: '#E8857A',
          'red-light': '#F5ABA3',
          'red-lighter': '#FDE9E7',
          yellow: '#F9F3E6',
          'yellow-light': '#FDF9F0',
          'yellow-lighter': '#FEFCF8',
          green: '#A8C686',
        },
        basil: {
          green: '#2D5016',
          light: '#6B8E23',
        },
        cream: '#F4E4C1',
        'warm-cream': '#FDF9F0',
        wood: '#8B4513',
        charcoal: '#2C2C2C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Standardized scale utilities
      scale: {
        '98': '0.98',   // Active/tap state
        '102': '1.02',  // Card hover
        '103': '1.03',  // Button hover
      },
      // Standardized translate utilities
      translate: {
        'lift': '-4px', // Card hover lift
      },
      // Standardized transition durations
      transitionDuration: {
        '150': '150ms',  // Fast interactions
        '200': '200ms',  // Standard (PREFERRED)
        '300': '300ms',  // Slow/complex only
      },
      // Warm shadow system for elegant Italian aesthetic
      boxShadow: {
        'soft-sm': '0 1px 2px 0 rgba(28, 20, 16, 0.04)',
        'soft': '0 2px 8px -2px rgba(28, 20, 16, 0.08)',
        'soft-md': '0 4px 12px -4px rgba(28, 20, 16, 0.10)',
        'soft-lg': '0 8px 24px -6px rgba(28, 20, 16, 0.12)',
        'soft-xl': '0 16px 40px -8px rgba(28, 20, 16, 0.15)',
        'card-hover': '0 12px 32px -8px rgba(28, 20, 16, 0.16)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        // Subtle cart badge pulse (opacity only)
        'badge-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        'badge-pulse': 'badge-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}