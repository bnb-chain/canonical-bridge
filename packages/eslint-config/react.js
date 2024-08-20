module.exports = {
  extends: 'react-app',
  rules: {
    'no-console': 'error',
    'react/react-in-jsx-scope': ['off'],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal'],
      },
    ],
  },
};
