'use client';

import { useRouter } from 'next/navigation';
import { useSettings } from '../lib/settings';
import { categories, getLocalizedCategory } from '../lib/categories';
import { useTranslations } from '../lib/i18n';

export default function CategoriesPage() {
  const router = useRouter();
  const { t, locale } = useTranslations();
  const { darkMode, highContrast } = useSettings();

  const bg = highContrast ? '#ffffff' : darkMode ? '#1a1008' : '#fdf6ec';
  const border = highContrast ? '#000000' : darkMode ? '#5c3d1e' : '#e8d5b5';
  const textPrimary = highContrast ? '#000000' : darkMode ? '#f5e9d4' : '#2c1810';
  const textMuted = highContrast ? '#333333' : darkMode ? '#c9a96e' : '#7c6248';
  const goldAccent = highContrast ? '#000000' : '#c9a96e';
  const surface = highContrast ? '#f5f5f5' : darkMode ? '#2c1e0f' : '#fff8ee';

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "var(--font-lora), Georgia, serif", color: textPrimary }}>
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
