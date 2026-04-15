import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

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
  title: "Trebelcafé Tribsees — Selbstgebackenes mit Herz",
  description:
    "Familiäres Café in Tribsees mit selbstgebackenem Kuchen, Frühstück und wechselndem Mittagstisch. Geöffnet Do–Mo 9–17 Uhr.",
  openGraph: {
    title: "Trebelcafé Tribsees",
    description: "Selbstgebackenes mit Herz — mitten in Tribsees.",
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
    <html lang="de" className={`${playfair.variable} ${dmSans.variable} ${cormorant.variable}`}>
      <body className="font-dm bg-cream text-espresso antialiased">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
