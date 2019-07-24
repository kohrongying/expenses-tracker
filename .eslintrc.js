module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    'plugin:react/recommended',
  ],
  "parser": "babel-eslint",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaFeatures": {
        "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "rules": {
    // ignore navigation props
    "react/prop-types": ["error", { "ignore": ["location"] }],

    "indent": ["error", 2],

    "linebreak-style": ["error", "unix"],

    "quotes": ["error", "double", { "allowTemplateLiterals": true }],

    "semi": ["error", "always"],

    // ensure default case always present for switch-case
    "default-case": "error",

    // use type safe equality operators ==== and !==
    "eqeqeq": "error",

    // curly brace { }
    "brace-style": ["error", "1tbs", { "allowSingleLine": true }],

    // to have spacing before and after keywords
    "keyword-spacing": ["error"],

    // no (more than 1) empty lines
    "no-multiple-empty-lines": ["error"],

    // no space
    "no-trailing-spaces": ["error", { "ignoreComments": true }],

    "eol-last": ["error", "never"],

    // Consistent spacing inside braces (objects in objects)
    "object-curly-spacing": ["error", "always", { "objectsInObjects": false, "arraysInObjects": false }],
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
};