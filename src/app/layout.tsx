import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Holi Billboard | Paint the City with Your Vibe",
  description: "The world's first real-time interactive Holi billboard. Pick a color and splash it on giant city screens instantly from your phone. Experience the future of digital celebrations.",
  keywords: ["Holi 2026", "Interactive Billboard", "Digital Holi", "Paint the City", "OOH Advertising", "Real-time Art", "Interactive OOH"],
  authors: [{ name: "Holi Billboard Team" }],
  openGraph: {
    title: "Holi Billboard | Paint the City with Your Vibe",
    description: "Splash colors in real-time on giant digital screens across the city. Join the world's first interactive digital Holi fest.",
    type: "website",
    locale: "en_US",
    siteName: "Holi Billboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Holi Billboard | Paint the City with Your Vibe",
    description: "Splash colors in real-time on giant digital screens across the city. Join the world's first interactive digital Holi fest.",
  },
  themeColor: "#0060FF",
};

import { CSPostHogProvider } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased`}
      >
        <CSPostHogProvider>
          {children}
        </CSPostHogProvider>
      </body>
    </html>
  );
}
