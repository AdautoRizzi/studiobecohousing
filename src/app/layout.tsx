import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

import WhatsAppWidget from '@/components/WhatsAppWidget';

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://studiobecohousing.com"),
  title: "Studio Be - Soluções em Cohousing",
  description: "Curadoria e Gestão para Comunidades Intencionais e Cohousing 50+",
  openGraph: {
    title: "Studio Be - Soluções em Cohousing",
    description: "Curadoria e Gestão para Comunidades Intencionais e Cohousing 50+",
    url: "https://studiobecohousing.com",
    siteName: "Studio Be",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Be - Soluções em Cohousing",
    description: "Curadoria e Gestão para Comunidades Intencionais e Cohousing 50+",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${montserrat.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
        <WhatsAppWidget />
      </body>
    </html>
  );
}
