import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About TehilimForAll',
  description: 'Learn about TehilimForAll — a free platform for reading Tehilim (Psalms) in Hebrew, phonetics, and English.',
  alternates: {
    canonical: 'https://tehilimforall.com/about',
  },
  openGraph: {
    title: 'About TehilimForAll',
    description: 'Learn about TehilimForAll — a free platform for reading Tehilim (Psalms) in Hebrew, phonetics, and English.',
    url: 'https://tehilimforall.com/about',
    siteName: 'TehilimForAll',
    images: [{ url: 'https://tehilimforall.com/og-image.png', width: 1200, height: 630, alt: 'TehilimForAll — The Book of Psalms for Everyone' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About TehilimForAll',
    description: 'Learn about TehilimForAll — a free platform for reading Tehilim (Psalms) in Hebrew, phonetics, and English.',
    images: ['https://tehilimforall.com/og-image.png'],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
