/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Variables CSS inyectadas por TenantContext — nunca hardcodear aquí
        tenant: {
          primary:   'rgb(var(--color-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
          accent:    'rgb(var(--color-accent) / <alpha-value>)',
          surface:   'rgb(var(--color-surface) / <alpha-value>)',
          bg:        'rgb(var(--color-bg) / <alpha-value>)',
          text:      'rgb(var(--color-text) / <alpha-value>)',
          muted:     'rgb(var(--color-muted) / <alpha-value>)',
          border:    'rgb(var(--color-border) / <alpha-value>)',
          success:   'rgb(var(--color-success) / <alpha-value>)',
          warning:   'rgb(var(--color-warning) / <alpha-value>)',
          danger:    'rgb(var(--color-danger) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans:     ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono:     ['var(--font-mono)', 'monospace'],
        display:  ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        subtitle: ['var(--font-subtitle)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        glass: 'var(--radius-glass)',
      },
      backdropBlur: {
        glass: 'var(--blur-glass)',
      },
      boxShadow: {
        glass:        '0 4px 24px 0 rgb(0 0 0 / 0.3), inset 0 1px 0 rgb(255 255 255 / 0.08)',
        neon:         '0 0 12px rgb(var(--color-primary) / 0.6), 0 0 32px rgb(var(--color-primary) / 0.25)',
        'neon-accent':'0 0 12px rgb(var(--color-accent) / 0.6), 0 0 32px rgb(var(--color-accent) / 0.25)',
        panel:        '0 8px 32px 0 rgb(0 0 0 / 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in':   'slideIn 0.25s ease-out',
        'fade-in':    'fadeIn 0.3s ease-out',
        'bid-drop':   'bidDrop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'flash-out':  'flashOut 5s ease-out forwards',
      },
      keyframes: {
        flashOut: {
          '0%':   { opacity: '0', transform: 'translate(-50%, 8px)' },
          '8%':   { opacity: '1', transform: 'translate(-50%, 0)' },
          '80%':  { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn:  { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
        fadeIn:   { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        bidDrop:  { from: { opacity: '0', transform: 'translateY(-16px) scale(0.96)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
      },
    },
  },
  plugins: [],
}
