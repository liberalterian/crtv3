/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'snapshotsplugin.s3.us-west-2.amazonaws.com',
      },
    ],
  },
};

module.exports = nextConfig;