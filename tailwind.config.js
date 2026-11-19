/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coy: {
          pink: '#FF4B72',
          purple: '#7928CA',
          dark: '#111827',
          card: '#1F2937',
          accent: '#FF0080',
        },
      },
    },
  },
  plugins: [],
};
