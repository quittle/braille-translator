import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import jestPlugin from "eslint-plugin-jest";
import googleConfig from "eslint-config-google";
import prettierConfig from "eslint-config-prettier";

// Browser + ES2021 globals (replaces env: {browser: true, es2021: true})
// Covers the standard browser APIs; add more here if lint reports
// no-undef for a browser global.
const browserGlobals = {
  window: "readonly",
  document: "readonly",
  navigator: "readonly",
  localStorage: "readonly",
  sessionStorage: "readonly",
  fetch: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  requestAnimationFrame: "readonly",
  cancelAnimationFrame: "readonly",
  console: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
  Blob: "readonly",
  File: "readonly",
  FileReader: "readonly",
  FormData: "readonly",
  Headers: "readonly",
  Request: "readonly",
  Response: "readonly",
  AudioContext: "readonly",
  CustomEvent: "readonly",
  Event: "readonly",
  HTMLElement: "readonly",
  HTMLInputElement: "readonly",
  HTMLButtonElement: "readonly",
  HTMLDivElement: "readonly",
  HTMLSpanElement: "readonly",
  HTMLAnchorElement: "readonly",
  HTMLImageElement: "readonly",
  HTMLCanvasElement: "readonly",
  CanvasRenderingContext2D: "readonly",
  Image: "readonly",
  MutationObserver: "readonly",
  IntersectionObserver: "readonly",
  ResizeObserver: "readonly",
  getComputedStyle: "readonly",
  matchMedia: "readonly",
  alert: "readonly",
  confirm: "readonly",
  prompt: "readonly",
  location: "readonly",
  history: "readonly",
  screen: "readonly",
};

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
      globals: browserGlobals,
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
      ...jestPlugin.configs["flat/recommended"].rules,
      "jest/no-conditional-expect": "off",
      "jest/prefer-expect-assertions": "off",
      "jest/no-conditional-in-test": "off",
      "jest/max-expects": "off",
      "jest/consistent-test-it": [
        "error",
        { fn: "test", withinDescribe: "test" },
      ],
    },
  },
];
