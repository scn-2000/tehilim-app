import type { Metadata } from 'next';
import { ARTICLES } from '../content/index';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find(a => a.slug === slug);
  if (!article) return { title: 'Blog | TehilimForAll' };

  const title = `${article.title} | TehilimForAll`;
  const { description } = article;
  const url = `https://tehilimforall.com/blog/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: article.date,
      siteName: 'TehilimForAll',
      images: [{ url: 'https://tehilimforall.com/og-image.png', width: 1200, height: 630, alt: title }],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://tehilimforall.com/og-image.png'],
    },
  };
}

export default async function ArticleLayout({ params, children }: Props) {
  const { slug } = await params;
  const article = ARTICLES.find(a => a.slug === slug);

  if (!article) return <>{children}</>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    inLanguage: 'en',
    author: {
      '@type': 'Organization',
      name: 'TehilimForAll',
      url: 'https://tehilimforall.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TehilimForAll',
      url: 'https://tehilimforall.com',
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'TehilimForAll',
      url: 'https://tehilimforall.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://tehilimforall.com/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
