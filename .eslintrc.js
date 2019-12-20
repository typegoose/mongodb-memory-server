const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    sourceType: 'module',
    useJSXTextNode: true,
    project: [
      path.resolve(__dirname, 'tsconfig.test.json'),
      path.resolve(__dirname, 'packages/mongodb-memory-server-core/tsconfig.json'),
    ],
  },
  rules: {
    'no-underscore-dangle': 0,
    'arrow-body-style': 0,
    'no-unused-expressions': 0,
    'no-plusplus': 0,
    'no-console': 0,
    'func-names': 0,
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    'no-prototype-builtins': 0,
    'prefer-destructuring': 0,
    'no-else-return': 0,
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-inferrable-types': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-empty-function': 0,
  },
  env: {
    jasmine: true,
    jest: true,
  },
  globals: {
    Class: true,
    Iterator: true,
  },
};
