import js from "@eslint/js";
import react from "eslint-plugin-react";
import globals from "globals";

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
      "react/prop-types": ["error", { ignore: ["location"]}],
      indent: ["error", 2],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "double", { allowTemplateLiterals: true }],
      semi: ["error", "always"],
      "default-case": "error",
      eqeqeq: "error",
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "keyword-spacing": ["error"],
      "no-multiple-empty-lines": ["error"],
      "no-trailing-spaces": ["error", { ignoreComments: true }],
      "eol-last": ["error", "never"],
      "object-curly-spacing": [
        "error",
        "always",
        { objectsInObjects: false, arraysInObjects: false },
      ],
      "no-console": ["error", { allow: ["warn", "error"]}],
    },
  },
];