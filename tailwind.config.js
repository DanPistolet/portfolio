/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        lime: '#C8E500',
        dark: '#0A0A0A',
        cream: '#EDE9D3',
        panel: '#131313',
        border: '#2A2A2A',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        mono: ['"Space Mono"', 'monospace'],
        jp: ['"Noto Sans JP"', 'sans-serif'],
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        glitch: {
          '0%, 95%, 100%': { clipPath: 'none', transform: 'none' },
          '96%': { clipPath: 'inset(20% 0 30% 0)', transform: 'translateX(-4px)' },
          '97%': { clipPath: 'inset(60% 0 10% 0)', transform: 'translateX(4px)' },
          '98%': { clipPath: 'inset(40% 0 50% 0)', transform: 'translateX(-2px)' },
          '99%': { clipPath: 'none', transform: 'none' },
        },
        scanline: {
          '0%': { top: '-10%' },
          '100%': { top: '110%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        pulse_dot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
      },
      animation: {
        ticker: 'ticker 22s linear infinite',
        glitch: 'glitch 6s ease-in-out infinite',
        scanline: 'scanline 3s linear infinite',
        blink: 'blink 1.2s step-end infinite',
        pulse_dot: 'pulse_dot 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
