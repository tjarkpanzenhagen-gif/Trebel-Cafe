import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trebel Café Tribsees — Selbstgebackenes mit Herz",
  description:
    "Familiäres Café in Tribsees — Kuchen und Torten frisch aus eigener Küche, Eis und Brot aus der Region. Geöffnet Do–Mo 9–17 Uhr.",
  metadataBase: new URL("https://dastrebelcafetribsees.de"),
  alternates: {
    canonical: "https://dastrebelcafetribsees.de",
  },
  openGraph: {
    title: "Trebel Café Tribsees",
    description: "Selbstgebackenes mit Herz — mitten in Tribsees.",
    url: "https://dastrebelcafetribsees.de",
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="de"
      className={`${playfair.variable} ${dmSans.variable} ${cormorant.variable}`}
    >
      <body className="font-dm bg-cream text-espresso antialiased">
        {children}
      </body>
    </html>
  );
}
