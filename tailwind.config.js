/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem', // Set padding for the container
      },
      screens: {
        '2xl': '1600px', // Add custom screen size if necessary
      },
      maxWidth: {
        'custom': '1200px', // Custom container max width
      },
    },
  },
  plugins: [
    function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          maxWidth: theme('maxWidth.custom'), // Set custom max width
          '@screen 2xl': {
            maxWidth: '1200px', // Apply custom width for 2xl screen
          },
          '@screen xl': {
            maxWidth: '1200px',
          },
          '@screen lg': {
            maxWidth: '1200px',
          },
          '@screen md': {
            maxWidth: '720px',
          },
          '@screen sm': {
            maxWidth: '540px',
          },
        },
      });
    },
  ],
}
