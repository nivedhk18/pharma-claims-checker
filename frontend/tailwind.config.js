/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pharmablue: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          900: '#0c4a6e',
        },
        compliance: {
          supported: '#10b981',
          partial: '#f59e0b',
          unsupported: '#ef4444',
          missing: '#8b5cf6',
          insufficient: '#6b7280',
        }
      }
    },
  },
  plugins: [],
}
