

module.exports = {
  purge: {
    enabled: false, // turn on for prod
    content: [
      './src/**/*.html',
      './src/**/*.scss'
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#3f51b5',
        secondary: '#2196f3'

      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
