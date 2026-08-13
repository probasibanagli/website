import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["10.62.89.173:3000", "10.62.89.173", "localhost:3000"],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "../postinstall.mjs": false,
    };
    return config;
  },};

export default nextConfig;
