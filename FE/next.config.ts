import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com', // 에러에 뜬 도메인 추가
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
