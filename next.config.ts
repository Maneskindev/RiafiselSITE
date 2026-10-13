import type { NextConfig } from "next";

// Static export: everything is prerendered into `out/`.
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default config;
