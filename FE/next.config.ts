import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // --- 기존 설정 유지 ---
  turbopack: {
    root: __dirname,
  },
  reactCompiler: true,

  // --------------------

  rewrites() {
    return [
      {
        source: '/api/:path*', // 'auth'가 포함되지 않은 경로만 매칭
        destination: `${process.env.INTERNAL_API_URL ?? 'http://localhost:3000'}/api/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blog.kakaocdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'velog.velcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.velog.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kr.object.ncloudstorage.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
