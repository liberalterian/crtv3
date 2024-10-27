/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'snapshotsplugin.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'locksmith.unlock-protocol.com',
      },
      {
        protocol: 'https',
        hostname: 'obj-store.livepeer.cloud',
      },
    ],
  },
};

module.exports = nextConfig;
