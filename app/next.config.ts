import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Allow cross-device LAN development access (e.g. mobile phones on WiFi)
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.100.5",
    "192.168.100.5:3000",
    "192.168.*.*",
    "192.168.*",
    "10.*",
    "172.*",
    "*.local",
  ],
  experimental: {
    optimizePackageImports: [
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "@react-three/rapier",
      "framer-motion",
    ],
  },
};

export default nextConfig;
