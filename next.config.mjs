/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'frontforest.ir',
            pathname: '/storage/**',
          },
        ],
      },
};

export default nextConfig;
