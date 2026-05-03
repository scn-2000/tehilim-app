import type { Metadata } from "next";
import "./globals.css";
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const BASE_URL = "https://tehilimforall.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "TehilimForAll — The Book of Psalms for Everyone | תהילים לכולם",
  description:
    "Read all 150 Psalms in Hebrew, English, and phonetics. Bookmark psalms, create reading lists, join collective readings, and explore psalms by category. Free for everyone.",
  keywords:
    "Tehilim, Psalms, Hebrew, Jewish prayer, Book of Psalms, תהילים, collective reading, psalm categories",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "TehilimForAll — The Book of Psalms for Everyone",
    description:
      "Read all 150 Psalms in Hebrew, English, and phonetics. Bookmark psalms, create reading lists, and explore by category. Free for everyone.",
    url: BASE_URL,
    siteName: "TehilimForAll",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "TehilimForAll" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TehilimForAll — The Book of Psalms for Everyone",
    description:
      "Read all 150 Psalms in Hebrew, English, and phonetics. Free for everyone.",
    images: ["/icon-512.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TehilimForAll",
  url: BASE_URL,
  description: "Read all 150 Psalms in Hebrew, English, and phonetics",
  inLanguage: ["en", "fr", "es", "nl", "he"],
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/psalm/{search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#c9a96e" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TehilimForAll" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@300;400;500;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ServiceWorkerRegistration />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}