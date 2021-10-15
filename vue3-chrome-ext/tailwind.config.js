module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      red: {
        500: '#009'
      },
      //  shadow-outline 和 shadow-xs 添加
      boxShadow: {
        xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
        outline: '0 0 0 3px rgba(66, 153, 225, 0.5)'
      }
    }
  },
  variants: {
    extend: {
      borderRadius: ['first', 'last']
    }
  },
  plugins: []
}
