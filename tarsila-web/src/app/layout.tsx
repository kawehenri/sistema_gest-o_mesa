import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tarsila · Cozinha Brasil",
    template: "%s · Tarsila Cozinha Brasil",
  },
  description:
    "Cozinha autoral feita no fogo a lenha, com ingredientes de pequenos produtores e safras do mês. Desde 2014, em São Paulo.",
  keywords: ["restaurante", "cozinha brasileira", "São Paulo", "reserva", "cardápio"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Tarsila Cozinha Brasil",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
