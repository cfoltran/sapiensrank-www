import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deployed as static files on GitHub Pages (see .github/workflows).
  output: "export",
  images: { unoptimized: true },
  // One 404 page for both root layouts, (en) and (fr).
  experimental: { globalNotFound: true },
};

export default nextConfig;
