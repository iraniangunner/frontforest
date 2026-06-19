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

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.petra.pmk-co.com",
          },
        ],
        destination: "https://petra.pmk-co.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
