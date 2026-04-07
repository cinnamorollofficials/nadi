/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Humanist Health + AI Theme
        primary: {
          DEFAULT: 'rgb(var(--md-sys-color-primary) / <alpha-value>)',
          '50': '#f0fdfa',
          '100': '#ccfbf1',
          '400': '#2dd4bf',
          '500': '#14b8a6',
          '600': '#0d9488',
        },
        secondary: {
          DEFAULT: ({ opacityValue }) => opacityValue !== undefined ? `rgb(var(--md-sys-color-secondary-container) / ${opacityValue})` : `rgb(var(--md-sys-color-secondary-container))`,
          container: ({ opacityValue }) => opacityValue !== undefined ? `rgb(var(--md-sys-color-secondary-container) / ${opacityValue})` : `rgb(var(--md-sys-color-secondary-container))`,
          'on-container': ({ opacityValue }) => opacityValue !== undefined ? `rgb(var(--md-sys-color-on-secondary-container) / ${opacityValue})` : `rgb(var(--md-sys-color-on-secondary-container))`,
        },
        nadi: {
          rose: 'rgb(var(--color-nadi-red) / <alpha-value>)',
        },
        navy: {
          950: 'rgb(var(--color-navy-950) / <alpha-value>)',
          900: 'rgb(var(--color-navy-900) / <alpha-value>)',
          800: 'rgb(var(--color-navy-800) / <alpha-value>)',
        },
        surface: {
          DEFAULT: ({ opacityValue }) => opacityValue !== undefined ? `rgb(var(--md-sys-color-surface) / ${opacityValue})` : `rgb(var(--md-sys-color-surface))`,
          variant: ({ opacityValue }) => opacityValue !== undefined ? `rgb(var(--md-sys-color-surface-variant) / ${opacityValue})` : `rgb(var(--md-sys-color-surface-variant))`,
          'on': ({ opacityValue }) => opacityValue !== undefined ? `rgb(var(--md-sys-color-on-surface) / ${opacityValue})` : `rgb(var(--md-sys-color-on-surface))`,
          'on-variant': ({ opacityValue }) => opacityValue !== undefined ? `rgb(var(--md-sys-color-on-surface-variant) / ${opacityValue})` : `rgb(var(--md-sys-color-on-surface-variant))`,
          'container-low': ({ opacityValue }) => opacityValue !== undefined ? `rgb(var(--md-sys-color-surface-container-low) / ${opacityValue})` : `rgb(var(--md-sys-color-surface-container-low))`,
          'container': ({ opacityValue }) => opacityValue !== undefined ? `rgb(var(--md-sys-color-surface-container) / ${opacityValue})` : `rgb(var(--md-sys-color-surface-container))`,
          'container-high': ({ opacityValue }) => opacityValue !== undefined ? `rgb(var(--md-sys-color-surface-container-high) / ${opacityValue})` : `rgb(var(--md-sys-color-surface-container-high))`,
          'container-highest': ({ opacityValue }) => opacityValue !== undefined ? `rgb(var(--md-sys-color-surface-container-highest) / ${opacityValue})` : `rgb(var(--md-sys-color-surface-container-highest))`,
        },
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['0.9375rem', { lineHeight: '1.375rem' }],
        'lg': ['1rem', { lineHeight: '1.5rem' }],
        'xl': ['1.125rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.375rem', { lineHeight: '2rem' }],
        '3xl': ['1.75rem', { lineHeight: '2.25rem' }],
      },
      borderRadius: {
        'md3-sm': '8px',
        'md3': '12px',
        'md3-lg': '16px',
        'md3-xl': '28px',
        '4xl': '2rem',
        '5xl': '3.5rem',
      },
      boxShadow: {
        'md3-1': '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        'md3-2': '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
        'md3-3': '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.3)',
        'md3-4': '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.3)',
        'md3-5': '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px 0px rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
