import path from "node:path";
import { fileURLToPath } from "node:url";

import { config as loadEnv } from "dotenv";
import type { NextConfig } from "next";

const dir = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(dir, "../../.env") });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@xuanvu/shared"],
  /** Dev HMR / _next resources when opening the app from LAN, Tailscale, or another machine IP. */
  allowedDevOrigins: ["100.79.102.99", "26.113.237.11"],
};

export default nextConfig;
