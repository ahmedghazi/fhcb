import type { NextConfig } from "next";
import path from "path";

// Anti-clickjacking: only the site itself and the Sanity Studio (Presentation
// tool) may frame the site. frame-ancestors checks the whole parent chain, so
// www.sanity.io is needed when the Studio is opened from the Sanity dashboard.
const frameAncestors = [
  "'self'",
  "https://backoffice--fhcb.sanity.studio",
  "https://www.sanity.io",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3333"] : []),
].join(" ");

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [{ hostname: "cdn.sanity.io" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${frameAncestors}`,
          },
          // Legacy-browser fallback; ignored by modern browsers when frame-ancestors is set
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
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
