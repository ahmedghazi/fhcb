import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [{ hostname: "cdn.sanity.io" }],
  },
  async redirects() {
    return [
      {
        source: "/artist/henri-cartier-bresson",
        destination: "/henri-cartier-bresson",
        permanent: true,
      },
      {
        source: "/artist/martine-franck",
        destination: "/martine-franck",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
