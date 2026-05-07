import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Lora } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration";
import Navigation from "./components/Navigation";
import { SettingsProvider } from "./lib/settings";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const frankRuhlLibre = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-frank-ruhl-libre",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

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
    images: [{ url: "https://tehilimforall.com/og-image.png", width: 1200, height: 630, alt: "TehilimForAll — The Book of Psalms for Everyone" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TehilimForAll — The Book of Psalms for Everyone",
    description:
      "Read all 150 Psalms in Hebrew, English, and phonetics. Free for everyone.",
    images: ["https://tehilimforall.com/og-image.png"],
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
    <html lang="he" className={`${frankRuhlLibre.variable} ${lora.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#c9a96e" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TehilimForAll" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ServiceWorkerRegistration />
        <SettingsProvider>
          <Navigation />
          <main>{children}</main>
        </SettingsProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}