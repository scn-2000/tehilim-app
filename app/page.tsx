'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './components/Logo';
import { useSettings } from './lib/settings';
import { useTranslations } from './lib/i18n';

function getSet(key: string): number[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

export default function Home() {
  const router = useRouter();
  const { t } = useTranslations();
  const { darkMode, highContrast, fontSize } = useSettings();
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    setBookmarks(getSet('bookmarks'));
  }, []);

  const bg = highContrast ? '#ffffff' : darkMode ? '#1a1008' : '#fdf6ec';
  const surface = highContrast ? '#f5f5f5' : darkMode ? '#2c1e0f' : '#fff8ee';
  const border = highContrast ? '#000000' : darkMode ? '#5c3d1e' : '#e8d5b5';
  const textPrimary = highContrast ? '#000000' : darkMode ? '#f5e9d4' : '#2c1810';
  const textMuted = highContrast ? '#333333' : darkMode ? '#c9a96e' : '#7c6248';
  const goldAccent = highContrast ? '#000000' : '#c9a96e';

  return (
    <div style={{ minHeight: '100vh', background: bg, color: textPrimary, fontFamily: "var(--font-lora), Georgia, serif" }}>

      <div className="home-hero">
        <div className="home-hero-logo">
          <Logo size={72} />
        </div>
        <h1 className="home-title" style={{ fontWeight: '300', marginBottom: '8px' }}>TehilimForAll</h1>
        <p style={{ fontSize: '14px', color: textMuted, marginBottom: '4px' }}>תהילים לכולם</p>
        <p className="home-tagline" style={{ color: textMuted, marginBottom: '32px' }}>{t.tagline}</p>
        <div style={{ width: '48px', height: '2px', background: goldAccent, margin: '0 auto' }} />
      </div>

      <div className="home-grid-outer">
        <div className={`home-grid home-grid-${fontSize}`}>
          {Array.from({ length: 150 }, (_, i) => i + 1).map(num => {
            const isBookmarked = bookmarks.includes(num);
            return (
              <button key={num} onClick={() => router.push(`/psalm/${num}`)}
                className="psalm-btn"
                style={{
                  cursor: 'pointer', borderRadius: '8px',
                  fontFamily: 'inherit',
                  border: isBookmarked ? `2px solid ${goldAccent}` : `1px solid ${border}`,
                  background: isBookmarked ? (highContrast ? '#e8e8e8' : darkMode ? '#3a2a10' : '#fdf0d5') : surface,
                  color: textPrimary, position: 'relative' as const,
                }}>
                {num}
                {isBookmarked && (
                  <span style={{ position: 'absolute', top: '2px', right: '3px', fontSize: '8px' }}>🔖</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
