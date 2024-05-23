module.exports = {
  root: true,
  extends: ['@control.ts/eslint-config/common.js'],
  parserOptions: {
    project: true,
  },
  rules: {
    '@typescript-eslint/semi': ['error', 'never'],
    semi: ['error', 'never'],
    'prettier/prettier': ['off', { semi: false }],
  },
}
