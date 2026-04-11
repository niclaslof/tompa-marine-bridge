/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        marine: {
          bg: 'rgb(var(--marine-bg) / <alpha-value>)',
          panel: 'rgb(var(--marine-panel) / <alpha-value>)',
          'panel-light': 'rgb(var(--marine-panel-light) / <alpha-value>)',
          border: 'rgb(var(--marine-border) / <alpha-value>)',
          accent: 'rgb(var(--marine-accent) / <alpha-value>)',
          'accent-dim': 'rgb(var(--marine-accent-dim) / <alpha-value>)',
          text: 'rgb(var(--marine-text) / <alpha-value>)',
          'text-bright': 'rgb(var(--marine-text-bright) / <alpha-value>)',
          'text-dim': 'rgb(var(--marine-text-dim) / <alpha-value>)',
          green: 'rgb(var(--marine-green) / <alpha-value>)',
          red: 'rgb(var(--marine-red) / <alpha-value>)',
          yellow: 'rgb(var(--marine-yellow) / <alpha-value>)',
          blue: 'rgb(var(--marine-blue) / <alpha-value>)',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
