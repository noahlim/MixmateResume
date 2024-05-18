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
    ],
    domains: ["www.thecocktaildb.com", "mixmatebucket.s3.us-east-2.amazonaws.com"],
  },
};

module.exports = nextConfig;
