import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Jewish Prayer & Tehilim | TehilimForAll',
  description:
    'Guides and articles on Tehilim — how to recite Psalms for healing, the collective reading tradition, the five books of Tehilim, and more.',
  alternates: { canonical: 'https://tehilimforall.com/blog' },
  openGraph: {
    title: 'Blog — Jewish Prayer & Tehilim | TehilimForAll',
    description:
      'Guides and articles on Tehilim — how to recite Psalms for healing, the collective reading tradition, and more.',
    url: 'https://tehilimforall.com/blog',
    siteName: 'TehilimForAll',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Blog — Tehilim Guides | TehilimForAll',
    description: 'Articles on Tehilim, collective reading, and Jewish prayer practice.',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
