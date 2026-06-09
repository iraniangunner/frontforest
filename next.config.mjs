/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "petra.pmk-co.com",
        pathname: "/storage/**",
      },
    ],
  },

  experimental: {
    browsersListForSwc: true,
  },
};

export default nextConfig;
