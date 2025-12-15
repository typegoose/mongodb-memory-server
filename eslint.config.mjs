import { globalIgnores } from 'eslint/config';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  globalIgnores([
    '**/lib/',
    '**/build/',
    'website/build/',
    'website/.docusaurus/',
    '**/coverage/',
    '**/typedoc_out/',
  ]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettier,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      // "prettier": prettier,
    },

    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
      ecmaVersion: 2023,
      sourceType: 'module',

      parserOptions: {
        useJSXTextNode: true,

        projectService: {
          allowDefaultProject: [],
          defaultProject: 'tsconfig.json',
        },

        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      'no-underscore-dangle': 0,
      'arrow-body-style': 0,
      'no-unused-expressions': 1,
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
          functions: 'never',
        },
      ],

      'no-prototype-builtins': 0,
      'prefer-destructuring': 0,
      'no-else-return': 1,

      'lines-between-class-members': [
        'error',
        'always',
        {
          exceptAfterSingleLine: true,
        },
      ],

      '@typescript-eslint/no-non-null-assertion': 0,
      '@typescript-eslint/explicit-member-accessibility': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-inferrable-types': 0,
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/no-use-before-define': 0,
      '@typescript-eslint/no-empty-function': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          caughtErrors: 'none',
        },
      ],
      curly: ['error', 'all'],

      'padding-line-between-statements': [
        'warn',
        {
          blankLine: 'always',
          prev: '*',
          next: 'return',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'if',
        },
        {
          blankLine: 'always',
          prev: 'if',
          next: '*',
        },
        {
          blankLine: 'any',
          prev: 'if',
          next: 'if',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: ['function', 'class'],
        },
        {
          blankLine: 'always',
          prev: ['function', 'class'],
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'import',
        },
        {
          blankLine: 'always',
          prev: 'import',
          next: '*',
        },
        {
          blankLine: 'never',
          prev: 'import',
          next: 'import',
        },
      ],

      'eol-last': 'warn',
    },
  },
  {
    files: [
      'scripts/**/*.js',
      'website/**/*.js',
      'packages/*-global*/**/*.js',
      'packages/mongodb-memory-server/**/*.js',
      'packages/mongodb-memory-server-core/scripts/*.js',
    ],

    rules: {
      '@typescript-eslint/no-require-imports': 0,
    },
  },
  {
    files: ['packages/mongodb-memory-server-core/**/__tests__/**/*'],
    languageOptions: {
      globals: globals.jest,
    },
  },
  {
    files: ['website/**/*'],
    languageOptions: {
      globals: globals.browser,
    },
  }
);
