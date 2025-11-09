// @ts-check

import { NextConfig } from 'next';

/**
 * Minimal Next config compatible with Next 16+.
 * Removed `env`, `eslint`, and `typescript` keys which are rejected at runtime.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
