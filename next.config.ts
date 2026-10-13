import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The competitive leaderboard was replaced by the points-based rewards page.
      { source: "/leaderboard", destination: "/rewards", permanent: true },
    ];
  },
};

export default nextConfig;
