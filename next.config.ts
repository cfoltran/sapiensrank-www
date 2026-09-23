import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deployed as static files on GitHub Pages (see .github/workflows).
  output: "export",
  // Emit /fr/index.html rather than /fr.html next to a /fr/ folder, which
  // GitHub Pages would not serve. Old URLs 301 to the slash version.
  trailingSlash: true,
  images: { unoptimized: true },
  // One 404 page for both root layouts, (en) and (fr).
  experimental: { globalNotFound: true },
};

export default nextConfig;
