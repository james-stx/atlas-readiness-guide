const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@atlas/types', '@atlas/config'],
  // Ensure path aliases work in production builds
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  // Skip ESLint during builds (run separately in CI)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip type checking during builds (run separately in CI)
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
