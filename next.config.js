/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
const env = {
  DB_URL:
    "mongodb+srv://dangthanhxuan8497:zo5ARPhilDXl0dJc@cluster0.nedlahq.mongodb.net/ecommerce_basic?retryWrites=true&w=majority",
  BASE_URL: "http://localhost:3000",
  MAIL_USER: "dangthanhxuan8497@gmail.com",
  MAIL_CLIENT_ID: "586384927300-m5u3mbelts81l7q8egq84slh2dfmric9.apps.googleusercontent.com",
  MAIL_CLIENT_SECRET: "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",
  MAIL_REFRESH_TOKEN: "1//04F7Cs_FgJSc-CgYIARAAGAQSNwF-L9IrX69Z4eo-tU4aRUaoLBK3gpuVgCOaOUhLfDBYeJoOzEHPhVxbHSuxoFsof7mGkbbUTEc",
  MAIL_ACCESS_TOKEN: "ya29.a0AfB_byDfZ3lSAA2xgV6_sDKQtx-2C3hntVK9UMNeKohU4jdfPNhBB69fuaBlEZ7hcCDavlFDiJnJKaPENZldbLgyD5AhoTLOlBX9ypp4M7SzbUHACQPei-ItUwJig8hbre_SqO0AvMJyzl_krtV_d4BdO5ykv_fExpZ_aCgYKAd0SARISFQGOcNnCYl0a-TzeA2_ESiBx4Wsl8Q0171",
  ACCESS_TOKEN_SECRET: "xDcH0RSW9llCaaiEJjQywU116SdrlHpn",
  REFRESH_TOKEN_SECRET: "PZDiYxHKu9ajbRLs9aEoA1V2GhYahkFd"
};

module.exports = { nextConfig, env };
