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
        hostname: "mixmate2.s3.us-east-2.amazonaws.com",
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
      {
        protocol: "https",
        hostname: "images.weserv.nl",
        port: "",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "pub.highlight.io",
        port: "",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "t3.ftcdn.net",
        port: "",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        port: "",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/*",
      },
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
