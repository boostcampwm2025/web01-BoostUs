// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      // 문자열: 싱글 쿼트
      quotes: ['error', 'single', { avoidEscape: true }],

      // 세미콜론 필수
      semi: ['error', 'always'],

      // 네이밍 규칙
      '@typescript-eslint/naming-convention': [
        'error',
        {
          // 변수: camelCase, 상수: UPPER_CASE
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow', // _ 허용 (ex. private 멤버)
        },
        {
          // 함수: camelCase
          selector: 'function',
          format: ['camelCase'],
        },
        {
          // 클래스: PascalCase
          selector: 'class',
          format: ['PascalCase'],
        },
      ],

      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
);
