import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // 1. Primitive Tokens
        grayscale: {
          50: '#FEFEFE',
          100: '#F9FAFB',
          200: '#F0F4FA',
          300: '#E5E7EB',
          400: '#BEC1D5',
          500: '#A0A3BD',
          600: '#6E7191',
          700: '#4E4B66',
          800: '#2A2A44',
          900: '#14142B',
        },
        accent: {
          blue: '#005CFD',
          red: '#FF3B30',
        },

        // 2. Semantic Tokens
        neutral: {
          text: {
            weak: '#6E7191',
            default: '#4E4B66',
            strong: '#14142B',
          },
          surface: {
            default: '#F0F4FA',
            bold: '#F9FAFB',
            strong: '#FEFEFE',
          },
          border: {
            default: '#E5E7EB',
            'default-active': '#14142B',
          },
        },
        brand: {
          surface: {
            weak: '#F0F4FA',
            default: '#005CFD',
          },
          border: {
            default: '#005CFD',
          },
        },
        danger: {
          text: {
            default: '#FF3B30',
          },
          surface: {
            default: '#FF3B30',
          },
          border: {
            default: '#FF3B30',
          },
        },
      },
      // Typography System 설정
      fontSize: {
        // 1. Display (Bold, 700)
        'display-bold32': ['32px', { lineHeight: '48px', fontWeight: '700' }],
        'display-bold24': ['24px', { lineHeight: '36px', fontWeight: '700' }],
        'display-bold20': ['20px', { lineHeight: '32px', fontWeight: '700' }],
        'display-bold16': ['16px', { lineHeight: '24px', fontWeight: '700' }],

        // 2. String (Medium, 500)
        'string-medium20': ['20px', { lineHeight: '32px', fontWeight: '500' }],
        'string-medium16': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'string-medium14': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'string-medium12': ['12px', { lineHeight: '16px', fontWeight: '500' }],

        // 3. Body (Regular, 400)
        'body-regular16': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-regular14': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-regular12': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
};

export default config;
