/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/products",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/collections",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/categories",
        destination: "/shop",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
