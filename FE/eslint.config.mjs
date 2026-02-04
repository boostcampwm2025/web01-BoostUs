import js from '@eslint/js';
import ts from 'typescript-eslint';
import react from 'eslint-plugin-react';
import hooks from 'eslint-plugin-react-hooks';
import nextConfig from 'eslint-config-next';
import prettier from 'eslint-plugin-prettier/recommended';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname 설정 (ESM 환경)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default ts.config(
  // 1. 검사 제외 항목
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'eslint.config.mjs',
      'postcss.config.mjs',
      'next-env.d.ts',
      'public/**',
      'dist/**',
      'playwright-report/**',
      'test-results/**',
      'e2e/**', // E2E 테스트 파일도 린트 검사에서 빼고 싶다면 추가 (보통은 냅두지만 너무 느리면 뺍니다)
    ],
  },

  // 2. 기본 JS 및 TS 엄격 모드 설정 (Rush Stack의 엄격함 모방)
  js.configs.recommended,

  // 3. React, Hooks, Next.js 공통 설정
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // strictTypeChecked: 타입 정보를 사용하는 가장 엄격한 규칙 세트
      ...ts.configs.strictTypeChecked,
      // stylisticTypeChecked: 일관된 스타일 규칙 (read-only 배열 등)
      ...ts.configs.stylisticTypeChecked,
    ],
    plugins: {
      react,
      'react-hooks': hooks,
    },
    languageOptions: {
      parserOptions: {
        // [중요] 타입 기반 린팅을 위한 프로젝트 설정
        projectService: true,
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    // React 설정 (버전 자동 감지)
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // --- React & Next.js 필수 규칙 ---
      ...hooks.configs.recommended.rules,
      ...nextConfig.rules,
      'react/jsx-key': 'error',

      // --- Rush Stack 스타일의 엄격한 규칙 (커스텀) ---

      // 1. 함수 반환 타입 명시 강제 (Rush Stack의 핵심)
      // 모든 내보내지는 함수(컴포넌트 포함)는 반환 타입을 명시해야 합니다.
      '@typescript-eslint/explicit-function-return-type': 'off', // 너무 번거로울 경우 off, 켜려면 'warn' or 'error'

      // 2. Promise 처리 강제 (비동기 함수 에러 방지)
      // await 없이 Promise를 호출하면 에러를 발생시킵니다.
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false, // JSX 속성(onClick 등)에 전달되는 함수는 반환 타입 체크 제외
          },
        },
      ],

      // 3. any 사용 금지 (엄격 모드)
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-deprecated': 'off',

      // 4. 불리언 표현식 엄격 검사
      // if (obj) 대신 if (obj !== null) 처럼 명확하게 작성해야 함
      '@typescript-eslint/strict-boolean-expressions': 'off', // 너무 엄격하면 off, 켜면 'warn'

      // 5. 타입 정의 일관성 (interface 선호)
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],

      // 6. 사용하지 않는 변수 ( _ 로 시작하면 허용)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],

      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
    },
  },

  // 4. Prettier 설정 (항상 마지막)
  prettier
);
