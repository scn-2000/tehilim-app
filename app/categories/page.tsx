'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../components/Logo';
import Sidebar from '../components/Sidebar';
import LanguageSelector from '../components/LanguageSelector';
import { categories, getLocalizedCategory } from '../lib/categories';
import { useTranslations } from '../lib/i18n';

const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

export default function CategoriesPage() {
  const router = useRouter();
  const { t, locale } = useTranslations();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bg = '#fdf6ec';
  const border = '#e8d5b5';
  const textPrimary = '#2c1810';
  const textMuted = '#9a7a5a';
  const goldAccent = '#c9a96e';
  const surface = '#fff8ee';

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
        </div>
        <LanguageSelector />
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px 80px' }}>
        <p style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '8px' }}>
          {t.categories.tab}
        </p>
        <h1 style={{ fontSize: '36px', fontWeight: '400', marginBottom: '8px' }}>{t.categories.allCategories}</h1>
        <div style={{ width: '48px', height: '2px', background: goldAccent, marginBottom: '32px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.map(cat => {
            const loc = getLocalizedCategory(cat, locale);
            return (
              <button key={cat.slug} onClick={() => router.push(`/category/${cat.slug}`)}
                style={{ width: '100%', padding: '16px 18px', background: surface, border: `1px solid ${border}`, borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '15px', color: textPrimary, fontWeight: '500', marginBottom: '4px', fontFamily: 'inherit' }}>{loc.title}</p>
                  <p style={{ fontSize: '13px', color: textMuted, fontFamily: 'inherit', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc.description}</p>
                  <p style={{ fontSize: '12px', color: textMuted, marginTop: '4px', fontFamily: 'inherit' }}>{cat.psalms.length} {cat.psalms.length !== 1 ? t.sidebar.psalms : t.sidebar.psalm}</p>
                </div>
                <span style={{ color: textMuted, fontSize: '18px', flexShrink: 0 }}>›</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
