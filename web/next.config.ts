import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
