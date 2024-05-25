/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.thecocktaildb.com",
        port: "",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "mixmatebucket.s3.us-east-2.amazonaws.com",
        port: "",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "s.gravatar.com",
        port: "",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "aem.lcbo.com",
        port: "",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
        port: "",
        pathname: "/*",
      },
    ],
    domains: [
      "www.thecocktaildb.com",
      "mixmatebucket.s3.us-east-2.amazonaws.com",
      "s.gravatar.com",
      "aem.lcbo.com",
      "i0.wp.com"
    ],
  },
  async rewrites() {
    {
      return [
        {
          source: "/mymixmate",
          destination: "/mymixmate/favourites",
        },
      ];
    }
  },
};

module.exports = nextConfig;
