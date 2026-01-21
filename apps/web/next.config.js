/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@atlas/types', '@atlas/config'],
};

module.exports = nextConfig;
