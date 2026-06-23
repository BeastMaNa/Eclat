import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      // Permanent redirect so old /catalog links (bookmarks, external sites) land correctly
      {
        source: "/catalog",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
