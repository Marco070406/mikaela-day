import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    turbopack: {
      root: ".",
    },
  },
};

export default nextConfig;
