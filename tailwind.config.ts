import type { Config } from 'tailwindcss'

/**
 * Identidade visual Right Now
 * - paper: fundo off-white (quente, para harmonizar com os azuis)
 * - ink / navy: preto e azul escuro (cores principais)
 * - royal / ocean: detalhes em azul royal e azul oceano
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: '#F3F0E8', deep: '#E9E4D8', line: '#D8D2C3' },
        ink: { DEFAULT: '#070B16', soft: '#1A2033' },
        navy: { DEFAULT: '#0A1330', 800: '#0E1B42', 700: '#142559', 600: '#1C3274' },
        royal: { DEFAULT: '#1F4FE0', light: '#5C82F0', dark: '#1639A8' },
        ocean: { DEFAULT: '#1B7CA8', light: '#4FA6CC', dark: '#125C7E' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        music: ['"Noto Music"', 'serif'],
      },
      letterSpacing: {
        wide2: '0.18em',
        wide3: '0.32em',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0) rotate(var(--r,0deg))' },
          '50%': { transform: 'translateY(-8px) rotate(calc(var(--r,0deg) + 4deg))' },
        },
        draw: {
          to: { strokeDashoffset: '0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        floaty: 'floaty 7s ease-in-out infinite',
        draw: 'draw 3.2s ease-out forwards',
        fadeUp: 'fadeUp .8s cubic-bezier(.2,.7,.2,1) both',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(.22,.8,.2,1)',
      },
    },
  },
  plugins: [],
} satisfies Config
