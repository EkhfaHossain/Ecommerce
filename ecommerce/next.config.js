/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  env: {
    API_URL: "http://localhost:3000/",
  },
};

module.exports = nextConfig;
