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

  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=60, s-maxage=60, stale-while-revalidate=86400",
          },
        ],
      },

      {
        source: "/products/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=60, s-maxage=60, stale-while-revalidate=86400",
          },
        ],
      },

      {
        source: "/posts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=60, s-maxage=60, stale-while-revalidate=86400",
          },
        ],
      },

      {
        source: "/about",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=60, s-maxage=60, stale-while-revalidate=86400",
          },
        ],
      },

      {
        source: "/contact",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=60, s-maxage=60, stale-while-revalidate=86400",
          },
        ],
      },

      {
        source: "/search",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=60, s-maxage=60, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
