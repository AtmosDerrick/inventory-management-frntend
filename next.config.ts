import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
};

export default nextConfig;
