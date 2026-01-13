// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'build/**', 'coverage/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          // 변수: camelCase, 상수: UPPER_CASE
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow', // 변수명 앞에 _ 허용 (private 필드)
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
      'prettier/prettier': ['error', { endOfLine: 'auto' }], // prettier 포맷 규칙을 lint 에러로 강제 + 개행문자 이슈 auto
      quotes: ['error', 'single', { avoidEscape: true }], // 문자열 싱글 쿼트로 변경 "" -> ''
      semi: ['error', 'always'], // 세미콜론 필수
    },
  },
  // 테스트 파일에만 jest globals 적용
  {
    files: ['**/*.spec.ts', '**/*.test.ts', 'test/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
);
