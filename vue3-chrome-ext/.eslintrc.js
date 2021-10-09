module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:tailwind/recommended',
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': ['error', 'always']
    // 'comma-dangle': 'off'
  },
  globals: {
    chrome: true
  }
}
