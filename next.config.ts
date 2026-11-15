import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 局域网内用 http://192.168.1.192:3000 打开时，dev 专用资源（/_next/hmr 等）会被当成跨源请求拦掉，
  // 导致 HMR 握手失败、页面不 hydrate（按钮点了没反应）。这里放行该主机名。
  allowedDevOrigins: ["192.168.1.192"],
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
