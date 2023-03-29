/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
  ],
  ignorePatterns: [
    'node_modules',
    'dist',
    'coverage',
  ],
  rules: {
    'import/prefer-default-export': 'off',
    'no-console': 'off',
    'max-len': ['error', { code: 100 }],
  },
  overrides: [
    {
      files: ['*.test.tsx', 'vitest.config.ts', 'vite.config.ts'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: '18',
    },
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
