import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/Fotogalerie", destination: "/galerie", permanent: true },
      { source: "/fotogalerie", destination: "/galerie", permanent: true },
      { source: "/Reservierung", destination: "/reservierung", permanent: true },
      { source: "/Speisekarte", destination: "/speisekarte", permanent: true },
      { source: "/Unsere-Leistungen", destination: "/ueber-uns", permanent: true },
      { source: "/unsere-leistungen", destination: "/ueber-uns", permanent: true },
      { source: "/Das-TrebelCafe", destination: "/ueber-uns", permanent: true },
      { source: "/das-trebelcafe", destination: "/ueber-uns", permanent: true },
      { source: "/Kontakt", destination: "/reservierung", permanent: true },
      { source: "/kontakt", destination: "/reservierung", permanent: true },
      { source: "/Ferienwohnungen", destination: "/ferienwohnungen", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "dastrebelcafetribsees.de",
      },
    ],
  },
};

export default nextConfig;
