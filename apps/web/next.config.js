/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next only transpiles its own app code by default; our workspace packages
  // ship raw TS/TSX, so they need to be told to compile them too.
  transpilePackages: ["@banjoosa/types", "@banjoosa/ui"],
};

module.exports = nextConfig;
