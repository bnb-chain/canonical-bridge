module.exports = {
  '!(libs/*).{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
  '!(libs/*).{html,md,mdx}': 'prettier --write',
};
