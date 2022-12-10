require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: ['@teleskop150750/eslint-config-ts', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
}
