/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: "#0b0f19",
          panel: "#111827",
          border: "#1f293d",
          accent: "#6366f1",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#ef4444",
          purple: "#8b5cf6",
          cyan: "#06b6d4"
        }
      },
      fontFamily: {
        mono: ['"Fira Code"', '"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 20px rgba(99, 102, 241, 0.35)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.35)',
        'glow-rose': '0 0 20px rgba(239, 68, 68, 0.35)',
      }
    },
  },
  plugins: [],
}
