import type { NextConfig } from "next";

// Static export: everything is prerendered into `out/`.
const config: NextConfig = {
  output: "export",
  // GitHub Pages serves the site from /<repo>/, set by the deploy workflow.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default config;
