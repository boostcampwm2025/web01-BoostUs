import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // --- 기존 설정 유지 ---
  turbopack: {
    root: __dirname,
  },
  experimental: {
    reactCompiler: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // --------------------

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:3000/:path*',
      },
    ];
  },
};

export default nextConfig;
