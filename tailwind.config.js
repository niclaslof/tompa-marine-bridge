/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        marine: {
          bg: '#040e14',
          panel: '#0a1e28',
          'panel-light': '#0f2a38',
          border: '#1a3a4a',
          accent: '#e8891c',
          'accent-dim': '#b5691a',
          text: '#c8d6e5',
          'text-bright': '#f0f4f8',
          'text-dim': '#6b8a9e',
          green: '#2ecc71',
          red: '#e74c3c',
          yellow: '#f1c40f',
          blue: '#3498db',
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
