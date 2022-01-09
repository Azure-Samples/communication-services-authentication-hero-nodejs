module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'header'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    semi: ['error', 'always'],
    'header/header': [
      'error',
      'block',
      [
        '*---------------------------------------------------------------------------------------------',
        ' * Copyright (c) Microsoft Corporation. All rights reserved.',
        ' * Licensed under the MIT License. See LICENSE.md in the project root for license information.',
        ' *---------------------------------------------------------------------------------------------'
      ]
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-inferrable-types': [
      'warn',
      {
        ignoreParameters: true
      }
    ],
    '@typescript-eslint/no-unused-vars': 'warn'
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/mocks/*'],
      env: {
        jest: true
      }
    }
  ]
};
