import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Unbounded } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-unbounded",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OCD Live — Réserve ton Live Shopping",
    template: "%s · OCD Live",
  },
  description:
    "Vends en direct devant des milliers d'acheteurs. Réserve une session de 1h30 au studio OCD Live de Lomé, ou diffuse depuis ta boutique partout en Afrique via le Hub. Créneaux 08h–11h & 18h–21h, dès 2 500 XOF.",
  keywords: [
    "live shopping",
    "Lomé",
    "Togo",
    "vente en direct",
    "Afrique",
    "commerçantes",
    "OCD Live",
    "Bovant",
    "House of Challenge",
  ],
  openGraph: {
    title: "OCD Live — Réserve ton Live Shopping",
    description:
      "Studio pro à Lomé ou live depuis ta boutique. Créneaux de 1h30, 7j/7. Dès 2 500 XOF.",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "https://images.pexels.com/photos/34368004/pexels-photo-34368004.jpeg?auto=compress&cs=tinysrgb&w=1200",
        width: 1200,
        height: 630,
        alt: "Néon ON AIR — OCD Live",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#090A0F",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${unbounded.variable}`}>
      <body className="grain font-sans bg-abyss antialiased">{children}</body>
    </html>
  );
}
