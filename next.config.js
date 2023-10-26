/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
const env = {
  DB_URL:
    "mongodb+srv://dangthanhxuan8497:zo5ARPhilDXl0dJc@cluster0.nedlahq.mongodb.net/ecommerce_basic?retryWrites=true&w=majority",
  NEXTAUTH_URL: "http://localhost:3000/",
};

module.exports = { nextConfig, env };
