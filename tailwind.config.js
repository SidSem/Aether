/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#102A43',
          dark: '#0B1E30',
          light: '#1E3D5C',
        },
        secondary: {
          DEFAULT: '#2F80ED',
          hover: '#1B6FD8',
        },
        accent: {
          DEFAULT: '#F2994A',
          hover: '#E08535',
          light: '#FDEEE0',
        },
        highlight: {
          DEFAULT: '#56CCF2',
          glow: 'rgba(86, 204, 242, 0.3)',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#102A43',
          elevated: '#0E2338',
          cardDark: '#0C2033',
        },
        aether: {
          bgLight: '#F4F8FB',
          bgDark: '#071A2B',
          textMain: '#102A43',
          textMuted: '#627D98',
          textLight: '#F4F8FB',
          borderLight: '#E2E8F0',
          borderDark: '#1E3D5C',
          success: '#27AE60',
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', '"DM Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
