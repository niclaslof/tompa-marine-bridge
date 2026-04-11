/** @type {import('tailwindcss').Config} */
const cssVar = (name) => ({ opacityValue, opacityVariable }) => {
  if (opacityValue !== undefined) return `rgb(var(--marine-${name}) / ${opacityValue})`
  if (opacityVariable !== undefined) return `rgb(var(--marine-${name}) / var(${opacityVariable}, 1))`
  return `rgb(var(--marine-${name}))`
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        marine: {
          bg:            cssVar('bg'),
          panel:         cssVar('panel'),
          'panel-light': cssVar('panel-light'),
          border:        cssVar('border'),
          accent:        cssVar('accent'),
          'accent-dim':  cssVar('accent-dim'),
          text:          cssVar('text'),
          'text-bright': cssVar('text-bright'),
          'text-dim':    cssVar('text-dim'),
          green:         cssVar('green'),
          red:           cssVar('red'),
          yellow:        cssVar('yellow'),
          blue:          cssVar('blue'),
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
