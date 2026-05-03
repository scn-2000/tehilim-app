import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const psalmNum = parseInt(id, 10);
  const title = `Psalm ${psalmNum} | TehilimForAll`;
  const description = `Read Psalm ${psalmNum} in Hebrew, with English transliteration and translation. תהילים פרק ${psalmNum} — TehilimForAll.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://tehilimforall.com/psalm/${psalmNum}`,
    },
    openGraph: {
      title,
      description,
      url: `https://tehilimforall.com/psalm/${psalmNum}`,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default function PsalmLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
