import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static2.finnhub.io",
        pathname: "/file/publicdatany/finnhubimage/stock_logo/**",
      },
    ],
  },
};

export default nextConfig;
