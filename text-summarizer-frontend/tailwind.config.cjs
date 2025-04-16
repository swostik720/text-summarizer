// tailwind.config.js
module.exports = {
    darkMode: 'class', // 👈 this enables class-based dark mode
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}', // includes all your React files
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  