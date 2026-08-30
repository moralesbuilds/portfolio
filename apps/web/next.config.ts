import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Here I put my Next.js config options */
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
