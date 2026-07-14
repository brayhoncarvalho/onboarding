/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        /* ── Dock DS tokens mapeados para Tailwind ── */
        ds: {
          /* Primary */
          'primary': 'var(--color-primary-500)',
          'primary-600': 'var(--color-primary-600)',
          /* Secondary (ciano) */
          'secondary': 'var(--color-secondary-500)',
          'secondary-600': 'var(--color-secondary-600)',
          /* Navy */
          'navy': 'var(--color-navy-900)',
          /* Gray scale */
          'gray-50': 'var(--color-gray-50)',
          'gray-100': 'var(--color-gray-100)',
          'gray-200': 'var(--color-gray-200)',
          'gray-300': 'var(--color-gray-300)',
          'gray-400': 'var(--color-gray-400)',
          'gray-500': 'var(--color-gray-500)',
          'gray-600': 'var(--color-gray-600)',
          'gray-700': 'var(--color-gray-700)',
          'gray-900': 'var(--color-gray-900)',
          /* Semantic */
          'success': 'var(--color-success-500)',
          'danger': 'var(--color-danger-500)',
          'warning': 'var(--color-warning-500)',
          /* Surface */
          'bg-page': 'var(--color-bg-page)',
          'bg-surface': 'var(--color-bg-surface)',
          /* Text */
          'text-primary': 'var(--color-text-primary)',
          'text-secondary': 'var(--color-text-secondary)',
          'text-inverse': 'var(--color-text-inverse)',
          /* Border */
          'border': 'var(--color-border-default)',
          'border-strong': 'var(--color-border-strong)',
        },
        /* Legado — mantido para não quebrar telas que ainda não foram migradas */
        dock: {
          primary: '#00d8d8',
          tertiary: '#1cc0c0',
          yellow: '#eeff88',
          'btn-dark': '#444746',
          'text-dark': '#242424',
          'text-gray': '#5c5c5c',
          'text-muted': '#777777',
          'bg-light': '#e6e6e6',
          black: '#000000',
          white: '#ffffff',
          'slider-inactive': '#b9b9b9',
          'input-border': '#b8b8b8',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', '"Cascadia Code"', 'monospace'],
        roboto: ['Roboto', 'sans-serif'],
        'red-hat': ['"Red Hat Display"', 'sans-serif'],
      },
      fontSize: {
        'ds-xs':   ['11px', { lineHeight: '1.4' }],
        'ds-sm':   ['12px', { lineHeight: '1.4' }],
        'ds-base': ['14px', { lineHeight: '1.6' }],
        'ds-md':   ['15px', { lineHeight: '1.6' }],
        'ds-lg':   ['17px', { lineHeight: '1.4' }],
        'ds-xl':   ['20px', { lineHeight: '1.3' }],
        'ds-2xl':  ['24px', { lineHeight: '1.2' }],
        'ds-3xl':  ['30px', { lineHeight: '1.2' }],
        'ds-4xl':  ['36px', { lineHeight: '1.1' }],
      },
      borderRadius: {
        'ds-sm':   'var(--radius-sm)',
        'ds-md':   'var(--radius-md)',
        'ds-lg':   'var(--radius-lg)',
        'ds-xl':   'var(--radius-xl)',
        'ds-2xl':  'var(--radius-2xl)',
        'ds-full': 'var(--radius-full)',
        /* Legado */
        'btn': 'var(--radius-md)',
        'hero-block': 'var(--radius-2xl)',
      },
      spacing: {
        'topbar': 'var(--size-topbar)',
        'touch': 'var(--size-touch-min)',
      },
      minHeight: {
        'btn-sm': 'var(--size-button-sm)',
        'btn-md': 'var(--size-button-md)',
        'btn-lg': 'var(--size-button-lg)',
        'touch':  'var(--size-touch-min)',
      },
      width: {
        'btn': '317px',
        'card': '147px',
        'slider-ctrl': '29px',
        'circle': '33px',
      },
      height: {
        'btn': '60px',
        'card': '234px',
        'slider-ctrl': '29px',
        'circle': '34px',
        'footer-bar': '84px',
      },
      maxWidth: {
        'ds': 'var(--size-max-content)',
      },
      boxShadow: {
        'focus': 'var(--focus-ring)',
        'focus-danger': 'var(--focus-ring-danger)',
        'focus-success': 'var(--focus-ring-success)',
      },
      transitionDuration: {
        'fast': 'var(--duration-fast)',
        'base': 'var(--duration-base)',
        'slow': 'var(--duration-slow)',
      },
    },
  },
  plugins: [],
}
