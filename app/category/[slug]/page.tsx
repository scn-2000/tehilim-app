'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSettings } from '../../lib/settings';
import { getCategoryBySlug, Category, getLocalizedCategory, DAILY_TEHILIM } from '../../lib/categories';
import { useTranslations } from '../../lib/i18n';

const SHOW_BEFORE_READING = new Set(['healing','funeral','high-holidays','livelihood','wedding','shidduch','pregnancy','teshuva','israel','protection','times-of-need']);
const TEXT_ONLY = new Set(['shabbat', 'high-holidays']);

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { t, locale } = useTranslations();
  const { darkMode, highContrast } = useSettings();
  const [category, setCategory] = useState<Category | null>(null);

  const bg = highContrast ? '#ffffff' : darkMode ? '#1a1008' : '#fdf6ec';
  const border = highContrast ? '#000000' : darkMode ? '#5c3d1e' : '#e8d5b5';
  const textPrimary = highContrast ? '#000000' : darkMode ? '#f5e9d4' : '#2c1810';
  const textMuted = highContrast ? '#333333' : darkMode ? '#c9a96e' : '#7c6248';
  const goldAccent = highContrast ? '#000000' : '#c9a96e';
  const surface = highContrast ? '#f5f5f5' : darkMode ? '#2c1e0f' : '#fff8ee';

  const todayDay = Math.min(new Date().getDate(), 30);

  useEffect(() => {
    const cat = getCategoryBySlug(slug as string);
    setCategory(cat ?? null);
  }, [slug]);

  if (!category) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "var(--font-lora), Georgia, serif" }}>
      <p style={{ color: textMuted }}>Category not found.</p>
    </div>
  );

  const localized = getLocalizedCategory(category, locale);

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "var(--font-lora), Georgia, serif", color: textPrimary }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
        <button onClick={() => router.push('/categories')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: textMuted, fontSize: '13px', fontFamily: 'inherit', padding: '0 0 24px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ← {t.categories.allCategories}
        </button>

        <p style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '8px' }}>
          {t.categories.category}
        </p>
        <h1 style={{ fontSize: '36px', fontWeight: '400', marginBottom: '8px' }}>{localized.title}</h1>
        <p style={{ fontSize: '16px', color: textMuted, marginBottom: '16px', fontStyle: 'italic' }}>{localized.description}</p>
        <div style={{ width: '48px', height: '2px', background: goldAccent, marginBottom: '28px' }} />

        {SHOW_BEFORE_READING.has(slug as string) && !TEXT_ONLY.has(slug as string) && (
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '10px', padding: '16px 18px', marginBottom: '32px' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>{t.categories.beforeReading}</p>
            <p style={{ fontSize: '14px', color: textPrimary, lineHeight: '1.75' }}>{t.categories.beforeReadingNote}</p>
          </div>
        )}

        {/* Text-only categories: Shabbat and High Holidays */}
        {TEXT_ONLY.has(slug as string) ? (
          <div>
            <div style={{ background: surface, border: `1px solid ${goldAccent}`, borderRadius: '10px', padding: '16px 18px', marginBottom: '24px' }}>
              <p style={{ fontSize: '14px', color: textPrimary, lineHeight: 1.75 }}>
                {slug === 'shabbat'
                  ? t.categories.shabbatNote
                  : t.categories.highHolidaysNote
                }
              </p>
            </div>
            <p style={{ fontSize: '13px', color: textMuted, marginBottom: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: '600' }}>{t.categories.psalmsHeading}</p>
            <p style={{ fontSize: '18px', color: textPrimary, lineHeight: 2.2, letterSpacing: '0.02em' }}>
              {category.psalms.join('  ·  ')}
            </p>
          </div>

        /* Daily Tehilim: 30-day calendar */
        ) : slug === 'daily-tehilim' ? (
          <div>
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '10px', padding: '12px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>📅</span>
              <p style={{ fontSize: '14px', color: textPrimary }}>
                {t.categories.dailyTehilimTodayPrefix} <strong>{todayDay}</strong> {t.categories.dailyTehilimTodaySuffix}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {DAILY_TEHILIM.map(({ day, first, last }) => {
                const isToday = day === todayDay;
                const count = last - first + 1;
                const range = first === last ? `${first}` : `${first}–${last}`;
                return (
                  <button key={day} onClick={() => router.push(`/psalm/${first}`)}
                    style={{ padding: '14px 18px', background: isToday ? goldAccent : surface, border: `1px solid ${isToday ? goldAccent : border}`, borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      {isToday && (
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>{t.categories.dailyTehilimTodayLabel}</p>
                      )}
                      <p style={{ fontSize: '15px', color: isToday ? 'white' : textPrimary, fontWeight: '500', fontFamily: 'inherit' }}>
                        {t.categories.dailyTehilimDay.replace('{day}', String(day)).replace('{range}', range)}
                      </p>
                      <p style={{ fontSize: '12px', color: isToday ? 'rgba(255,255,255,0.75)' : textMuted, marginTop: '2px', fontFamily: 'inherit' }}>
                        {count} {count !== 1 ? t.sidebar.psalms : t.sidebar.psalm}
                      </p>
                    </div>
                    <span style={{ color: isToday ? 'rgba(255,255,255,0.85)' : textMuted, fontSize: '13px' }}>{t.categories.readArrow}</span>
                  </button>
                );
              })}
            </div>
          </div>

        /* Regular categories: clickable psalm list */
        ) : (
          <div>
            <p style={{ fontSize: '14px', color: textMuted, marginBottom: '16px' }}>
              {category.psalms.length} {category.psalms.length !== 1 ? t.sidebar.psalms : t.sidebar.psalm}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {category.psalms.map((num, idx) => (
                <button key={num} onClick={() => router.push(`/psalm/${num}?category=${slug}`)}
                  style={{ padding: '16px 18px', background: surface, border: `1px solid ${border}`, borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontSize: '15px', color: textPrimary, fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    {slug === 'psalm-of-the-day' && (
                      <p style={{ fontSize: '12px', color: textMuted, marginBottom: '3px', fontFamily: 'inherit' }}>{t.categories.dayNames[idx]}</p>
                    )}
                    <span style={{ fontWeight: '500' }}>{t.psalm.title} {num}</span>
                  </div>
                  <span style={{ color: textMuted, fontSize: '13px' }}>{t.categories.readNow}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
