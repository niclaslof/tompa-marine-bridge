/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        marine: {
          bg: '#f0f4f8',
          panel: '#ffffff',
          'panel-light': '#f8fafb',
          border: '#e2e8f0',
          accent: '#e8891c',
          'accent-dim': '#c97316',
          text: '#374151',
          'text-bright': '#111827',
          'text-dim': '#6b7280',
          green: '#059669',
          red: '#dc2626',
          yellow: '#d97706',
          blue: '#2563eb',
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
