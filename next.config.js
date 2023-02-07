/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false };
    config.resolve.modules.push(__dirname);
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/documents',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['www.topaz.so', 'cdn.discordapp.com', 'arweave.net'],
  },
};

module.exports = nextConfig;
