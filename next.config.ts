import type { NextConfig } from "next";

// Static export for Cloudflare Pages free-tier hosting.
// Pyodide cache headers live in public/_headers (the headers() function
// is unsupported with output: "export").
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
