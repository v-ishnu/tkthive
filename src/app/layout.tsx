import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from "@vercel/analytics/next"

import "./globals.css";

import RootComponent from "./RootComponent";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

import { Poppins } from "next/font/google";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});



export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: "tkthive - Discover & Book Events",
    template: "%s | tkthive"
  },
  description: "Your premier destination for discovering and booking the best events. fast, secure, and easy.",
  keywords: ["events", "tickets", "booking", "concerts", "workshops", "seminars", "tkthive"],
  openGraph: {
    title: "tkthive - Discover & Book Events",
    description: "Your premier destination for discovering and booking the best events.",
    url: "https://tkthive.com", // Replace with actual domain when live
    siteName: "tkthive",
    images: [
      {
        url: "/og-image.jpg", // Make sure to add an og-image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "tkthive - Discover & Book Events",
    description: "Your premier destination for discovering and booking the best events.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'icon',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${poppins.variable}`}
        suppressHydrationWarning
      >
        <Analytics />
        <RootComponent>{children}</RootComponent>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string} />

      </body>
    </html>
  );
}
