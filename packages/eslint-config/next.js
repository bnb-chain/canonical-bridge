require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'prettier',
  ],
  rules: {
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
    'no-console': 'error',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'no-unused-vars': 'off',
  },
};
