import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        desk: 'var(--desk)',
        rule: 'var(--rule)',
        ink: {
          DEFAULT: 'var(--ink)',
          2: 'var(--ink-2)',
          soft: 'var(--ink-soft)',
          muted: 'var(--ink-muted)',
        },
        'on-ink': 'var(--on-ink)',
        seal: 'var(--seal)',
        sticky: {
          yellow: 'var(--sticky-yellow)',
          green: 'var(--sticky-green)',
          rose: 'var(--sticky-rose)',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Source Serif 4', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'Courier Prime', 'monospace'],
      },
      boxShadow: {
        sheet: 'var(--shadow-sheet)',
        sticky: 'var(--shadow-sticky)',
        'btn-hard': '2px 2px 0 var(--ink)',
        'btn-hard-hover': '3px 3px 0 var(--ink)',
      },
      borderRadius: {
        paper: 'var(--radius)',
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};

export default config;
