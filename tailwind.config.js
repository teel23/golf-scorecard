/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'g950': '#0a2e1a',
        'g900': '#0f4c2a',
        'g800': '#1a6b3a',
        'gold': '#c9a84c',
        'gold2': '#dcc278',
        'cream': '#f5edd6',
        'card': '#faf6ed',
      },
    },
  },
  plugins: [],
};
