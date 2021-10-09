module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      red: {
        500: '#009'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
