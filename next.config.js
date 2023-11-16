/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const env = {
  BASE_WEB_URL: process.env.BASE_URL
}

module.exports = { nextConfig, env };
