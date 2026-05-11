'use client';

import { useRouter } from 'next/navigation';
import { useSettings } from '../lib/settings';
import { ARTICLES } from './content/index';

export default function BlogPage() {
  const router = useRouter();
  const { darkMode, highContrast } = useSettings();

  const bg = highContrast ? '#ffffff' : darkMode ? '#1a1008' : '#fdf6ec';
  const border = highContrast ? '#000000' : darkMode ? '#5c3d1e' : '#e8d5b5';
  const textPrimary = highContrast ? '#000000' : darkMode ? '#f5e9d4' : '#2c1810';
  const textMuted = highContrast ? '#333333' : darkMode ? '#c9a96e' : '#7c6248';
  const goldAccent = highContrast ? '#000000' : '#c9a96e';
  const surface = highContrast ? '#f5f5f5' : darkMode ? '#2c1e0f' : '#fff8ee';

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "var(--font-lora), Georgia, serif", color: textPrimary }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px 80px' }}>

        <p style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '8px' }}>
          Blog
        </p>
        <h1 style={{ fontSize: '36px', fontWeight: '400', marginBottom: '8px', lineHeight: 1.2 }}>
          Guides &amp; Articles
        </h1>
        <p style={{ fontSize: '16px', lineHeight: 1.7, color: textMuted, marginBottom: '10px' }}>
          Practical and scholarly writing on Tehilim, Jewish prayer practice, and how to use TehilimForAll.
        </p>
        <div style={{ width: '48px', height: '2px', background: goldAccent, marginBottom: '40px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {ARTICLES.map(article => (
            <button
              key={article.slug}
              onClick={() => router.push(`/blog/${article.slug}`)}
              style={{
                width: '100%', textAlign: 'left', background: surface, border: `1px solid ${border}`,
                borderRadius: '12px', padding: '24px', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                <h2 style={{ fontSize: '19px', fontWeight: '500', color: textPrimary, lineHeight: 1.35, margin: 0 }}>
                  {article.title}
                </h2>
                <span style={{ color: goldAccent, fontSize: '20px', flexShrink: 0 }}>›</span>
              </div>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: textMuted, marginBottom: '14px' }}>
                {article.excerpt}
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: textMuted }}>{formatDate(article.date)}</span>
                <span style={{ fontSize: '12px', color: textMuted }}>·</span>
                <span style={{ fontSize: '12px', color: textMuted }}>{article.readingTime}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
