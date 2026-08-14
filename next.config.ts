import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.62.89.173:3000", "10.62.89.173", "localhost:3000"],
  turbopack: {
    root: process.cwd(),
  },
  // firebase-admin uses native Node.js modules (gRPC, etc.) that cannot be
  // bundled by webpack. Mark it as external so Next.js requires it at runtime.
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
