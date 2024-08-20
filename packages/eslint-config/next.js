require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "next/core-web-vitals",
    "prettier",
  ],
  rules: {
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
      },
    ],
    "no-console": "error",

    // Temporary rules to help the migration from `@bnb-chain/eslint-config/next`.
    "@typescript-eslint/no-unused-vars": ["warn"],
    "no-unused-vars": "off", // Turn it off for the above rule to work.
  },
};
