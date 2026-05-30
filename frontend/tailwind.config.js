/*
 * SHIPREADY THEME TOKENS — edit only this file to restyle the whole app
 * ─────────────────────────────────────────────────────────────────────
 * surface  → page background          (near-black charcoal, #0c0d10)
 * panel    → card / terminal bg       (slightly lighter charcoal)
 * ink      → main body text           (near-white)
 * muted    → secondary / placeholder  (cool mid-grey)
 * brand    → primary accent           (electric blue)
 * warn     → terminal warnings        (amber — fixed, never follows brand)
 * danger   → SCORE STATES ONLY        (red)
 * success  → SCORE STATES ONLY        (green)
 *
 * Fonts
 * display  → Space Grotesk            (headings / UI labels)
 * mono     → JetBrains Mono           (terminal / code output)
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: '#0c0d10',
        panel:   '#16181d',
        ink:     '#E8EDF5',
        muted:   '#5a6478',
        brand:   '#3B82F6',
        warn:    '#FBBF24',
        danger:  '#EF4444',
        success: '#22C55E',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
