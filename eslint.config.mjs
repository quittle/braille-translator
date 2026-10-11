import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import jestPlugin from "eslint-plugin-jest";
import googleConfig from "eslint-config-google";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default [
  {
    ignores: ["**/*.scss", "**/*.png", "**/*.svg", "dist/**"],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
        project: "tsconfig.json",
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs["flat/recommended"].rules,
      ...googleConfig.rules,
      ...prettierConfig.rules,
      "no-console": "error",
      // Base rule must be off; the TS version handles it
      "no-unused-vars": "off",
      "valid-jsdoc": "off",
      // require-jsdoc was removed from ESLint core in v10, but
      // eslint-config-google still references it
      "require-jsdoc": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "new-cap": ["error", { capIsNewExceptions: ["Cell"] }],
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
  {
    files: ["**/*.test.ts"],
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs["flat/all"].rules,
      "jest/no-conditional-expect": "off",
      "jest/prefer-expect-assertions": "off",
      "jest/no-conditional-in-test": "off",
      "jest/max-expects": "off",
      "jest/prefer-ending-with-an-expect": "off",
      "jest/consistent-test-it": [
        "error",
        { fn: "test", withinDescribe: "test" },
      ],
    },
  },
];
