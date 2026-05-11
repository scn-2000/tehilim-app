'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSettings } from '../../lib/settings';
import { ARTICLES } from '../content/index';
import type { ArticleColors } from '../content/index';
import HealingContent from '../content/how-to-say-tehilim-for-healing';
import CollectiveContent from '../content/what-is-collective-tehilim';
import GuideContent from '../content/tehilim-book-of-psalms-guide';

const CONTENT_MAP: Record<string, React.ComponentType<{ colors: ArticleColors }>> = {
  'how-to-say-tehilim-for-healing': HealingContent,
  'what-is-collective-tehilim': CollectiveContent,
  'tehilim-book-of-psalms-guide': GuideContent,
};

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { darkMode, highContrast } = useSettings();

  const bg = highContrast ? '#ffffff' : darkMode ? '#1a1008' : '#fdf6ec';
  const border = highContrast ? '#000000' : darkMode ? '#5c3d1e' : '#e8d5b5';
  const textPrimary = highContrast ? '#000000' : darkMode ? '#f5e9d4' : '#2c1810';
  const textMuted = highContrast ? '#333333' : darkMode ? '#c9a96e' : '#7c6248';
  const goldAccent = highContrast ? '#000000' : '#c9a96e';
  const surface = highContrast ? '#f5f5f5' : darkMode ? '#2c1e0f' : '#fff8ee';

  const colors: ArticleColors = { bg, textPrimary, textMuted, goldAccent, surface, border };

  const article = ARTICLES.find(a => a.slug === slug);
  const ContentComponent = slug ? CONTENT_MAP[slug] : undefined;

  if (!article || !ContentComponent) {
    return (
      <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "var(--font-lora), Georgia, serif" }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '16px', color: textMuted, marginBottom: '16px' }}>Article not found.</p>
          <button onClick={() => router.push('/blog')} style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '8px 20px', cursor: 'pointer', color: textPrimary, fontFamily: 'inherit', fontSize: '14px' }}>
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  const otherArticles = ARTICLES.filter(a => a.slug !== slug);

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "var(--font-lora), Georgia, serif", color: textPrimary }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Back link */}
        <button
          onClick={() => router.push('/blog')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: textMuted, fontFamily: 'inherit', fontSize: '14px', padding: '0', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          ← Blog
        </button>

        {/* Article header */}
        <p style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '10px' }}>
          Blog
        </p>
        <h1 style={{ fontSize: '32px', fontWeight: '400', lineHeight: 1.25, marginBottom: '14px' }}>
          {article.title}
        </h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', color: textMuted }}>{formatDate(article.date)}</span>
          <span style={{ fontSize: '13px', color: textMuted }}>·</span>
          <span style={{ fontSize: '13px', color: textMuted }}>{article.readingTime}</span>
        </div>
        <div style={{ width: '48px', height: '2px', background: goldAccent, marginBottom: '36px' }} />

        {/* Article content */}
        <article>
          <ContentComponent colors={colors} />
        </article>

        {/* Divider */}
        <div style={{ height: '1px', background: border, margin: '56px 0 40px' }} />

        {/* More articles */}
        {otherArticles.length > 0 && (
          <section>
            <p style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: textMuted, marginBottom: '16px', fontWeight: '600' }}>
              More Articles
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {otherArticles.map(a => (
                <button
                  key={a.slug}
                  onClick={() => router.push(`/blog/${a.slug}`)}
                  style={{ width: '100%', textAlign: 'left', background: surface, border: `1px solid ${border}`, borderRadius: '10px', padding: '16px 18px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '15px', fontWeight: '500', color: textPrimary, marginBottom: '4px', lineHeight: 1.3 }}>{a.title}</p>
                    <p style={{ fontSize: '13px', color: textMuted }}>{a.readingTime}</p>
                  </div>
                  <span style={{ color: goldAccent, fontSize: '18px', flexShrink: 0 }}>›</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
