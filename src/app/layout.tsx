import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import WhatsAppWidget from '@/components/WhatsAppWidget';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Studio Be - Soluções em Cohousing",
  description: "Curadoria e Gestão para Comunidades Intencionais e Cohousing 50+",
  openGraph: {
    title: "Studio Be - Soluções em Cohousing",
    description: "Curadoria e Gestão para Comunidades Intencionais e Cohousing 50+",
    url: "https://studiobecohousing.com",
    siteName: "Studio Be",
    images: [
      {
        url: "https://studiobecohousing.com/og-logo.jpg",
        width: 1200,
        height: 630,
        alt: "Studio Be Logo",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Be - Soluções em Cohousing",
    description: "Curadoria e Gestão para Comunidades Intencionais e Cohousing 50+",
    images: ["https://studiobecohousing.com/og-logo.jpg"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <WhatsAppWidget />
      </body>
    </html>
  );
}
