import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/Fotogalerie", destination: "/galerie", permanent: true },
      { source: "/Unsere-Leistungen", destination: "/ueber-uns", permanent: true },
      { source: "/Das-TrebelCafe", destination: "/ueber-uns", permanent: true },
      { source: "/Home", destination: "/", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dastrebelcafetribsees.de",
      },
    ],
  },
};

export default nextConfig;
