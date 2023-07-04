module.exports = {
  extends: [
    "next/core-web-vitals",
    "plugin:storybook/recommended",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["node_modules/", ".next/", "**/*.html"],
  plugins: ["unused-imports", "sort-keys-fix"],
  rules: {
    "import/no-anonymous-default-export": "off",
    "no-console": "error",
    "no-unused-vars": "off",
    "react/display-name": "off",
    "sort-keys-fix/sort-keys-fix": "warn",
    "unused-imports/no-unused-imports": "error",
  },
};
