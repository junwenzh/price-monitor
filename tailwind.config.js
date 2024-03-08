/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/view/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        iphone: '393px',
        ipad: '810px',
      },
      height: {
        iphone: '852px',
      },
    },
  },
  plugins: [],
};
