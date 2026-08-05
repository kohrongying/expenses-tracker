import js from "@eslint/js";
import react from "eslint-plugin-react";
import globals from "globals";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "build/**", "coverage/**"],
  },
  js.configs.recommended,
  react.configs.flat.recommended,
  {
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/prop-types": ["error", { ignore: ["location"] }],
      "default-case": "error",
      eqeqeq: "error",
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  prettierConfig, // must stay last
];
