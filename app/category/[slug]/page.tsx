'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Logo from '../../components/Logo';
import Sidebar from '../../components/Sidebar';
import LanguageSelector from '../../components/LanguageSelector';
import { getCategoryBySlug, Category, getLocalizedCategory } from '../../lib/categories';
import { useTranslations } from '../../lib/i18n';

const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { t, locale } = useTranslations();
  const [category, setCategory] = useState<Category | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bg = '#fdf6ec';
  const border = '#e8d5b5';
  const textPrimary = '#2c1810';
  const textMuted = '#9a7a5a';
  const goldAccent = '#c9a96e';
  const surface = '#fff8ee';

  useEffect(() => {
    const cat = getCategoryBySlug(slug as string);
    setCategory(cat ?? null);
  }, [slug]);

  if (!category) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Lora', Georgia, serif" }}>
      <p style={{ color: textMuted }}>Category not found.</p>
    </div>
  );

  const localized = getLocalizedCategory(category, locale);

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Lora', Georgia, serif", color: textPrimary }}>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} darkMode={false} />

      <div style={{ position: 'sticky', top: 0, background: bg, borderBottom: `1px solid ${border}`, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '7px 9px', cursor: 'pointer', color: textMuted, display: 'flex', alignItems: 'center' }}>
            <IconMenu />
          </button>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <Logo size={28} />
          </button>
          <button onClick={() => router.back()}
            style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: textPrimary, fontSize: '13px', fontFamily: 'inherit' }}>
            {t.allPsalms}
          </button>
        </div>
        <LanguageSelector />
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
        <p style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '8px' }}>
          {t.categories.category}
        </p>
        <h1 style={{ fontSize: '36px', fontWeight: '400', marginBottom: '8px' }}>{localized.title}</h1>
        <p style={{ fontSize: '16px', color: textMuted, marginBottom: '16px', fontStyle: 'italic' }}>{localized.description}</p>
        <div style={{ width: '48px', height: '2px', background: goldAccent, marginBottom: '28px' }} />

        <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '10px', padding: '16px 18px', marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>{t.categories.beforeReading}</p>
          <p style={{ fontSize: '14px', color: textPrimary, lineHeight: '1.75' }}>{t.categories.beforeReadingNote}</p>
        </div>

        <p style={{ fontSize: '14px', color: textMuted, marginBottom: '16px' }}>
          {category.psalms.length} {category.psalms.length !== 1 ? t.sidebar.psalms : t.sidebar.psalm}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {category.psalms.map(num => (
            <button key={num} onClick={() => router.push(`/psalm/${num}?category=${slug}`)}
              style={{ padding: '16px 18px', background: surface, border: `1px solid ${border}`, borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontSize: '15px', color: textPrimary, fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '500' }}>{t.psalm.title} {num}</span>
              <span style={{ color: textMuted, fontSize: '13px' }}>{t.categories.readNow}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
