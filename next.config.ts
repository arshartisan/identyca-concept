import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    // Ship the (small, atomic Tailwind) CSS inside the HTML: removes the
    // render-blocking stylesheet requests. Trade-off: no separate CSS cache
    // for returning visitors; right call for a mostly first-visit marketing site.
    inlineCss: true,
  },
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
