/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040912',
          900: '#07111F',
          850: '#0A1526',
          800: '#0D1724',
          750: '#111E2E',
          700: '#16253B',
          600: '#1C2A3A',
        },
        petrol: {
          surface: '#0D1724',
          panel: '#101C2C',
          card: '#142234',
          border: '#1C2A3A',
          hover: '#1E324A',
          glow: 'rgba(47, 128, 237, 0.15)',
        },
        brand: {
          blue: '#2F80ED',
          cyan: '#22B8CF',
          sky: '#38BDF8',
          accent: '#00D2FF',
        },
        risk: {
          safe: '#22C55E',
          warning: '#F59E0B',
          high: '#F97316',
          critical: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(47, 128, 237, 0.12) 1px, transparent 1px)",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(47, 128, 237, 0.2)' },
          '100%': { boxShadow: '0 0 18px rgba(34, 184, 207, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
