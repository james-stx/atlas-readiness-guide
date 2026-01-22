const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@atlas/types', '@atlas/config'],
  // API-only app - no static pages needed
  output: 'standalone',
  // Skip ESLint during builds (run separately in CI)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip type checking during builds (run separately in CI)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ensure path aliases work in production builds
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  // CORS is handled by middleware.ts for dynamic origin support
};

module.exports = nextConfig;
