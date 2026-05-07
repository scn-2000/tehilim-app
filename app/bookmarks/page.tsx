'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '../lib/settings';
import { getUser } from '../lib/auth';
import { useTranslations } from '../lib/i18n';

export default function BookmarksPage() {
  const router = useRouter();
  const { darkMode, highContrast } = useSettings();
  const { t } = useTranslations();
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const bg = highContrast ? '#ffffff' : darkMode ? '#1a1008' : '#fdf6ec';
  const border = highContrast ? '#000000' : darkMode ? '#5c3d1e' : '#e8d5b5';
  const textPrimary = highContrast ? '#000000' : darkMode ? '#f5e9d4' : '#2c1810';
  const textMuted = highContrast ? '#333333' : darkMode ? '#c9a96e' : '#7c6248';
  const goldAccent = highContrast ? '#000000' : '#c9a96e';
  const surface = highContrast ? '#f5f5f5' : darkMode ? '#2c1e0f' : '#fff8ee';

  useEffect(() => {
    try {
      setBookmarks(JSON.parse(localStorage.getItem('bookmarks') || '[]'));
    } catch {}
    getUser().then(u => setIsLoggedIn(!!u));
  }, []);

  function removeBookmark(num: number) {
    const updated = bookmarks.filter(n => n !== num);
    setBookmarks(updated);
    try { localStorage.setItem('bookmarks', JSON.stringify(updated)); } catch {}
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "var(--font-lora), Georgia, serif", color: textPrimary }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px 80px' }}>
        <p style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '8px' }}>
          {t.sidebar.bookmarksTab}
        </p>
        <h1 style={{ fontSize: '36px', fontWeight: '400', marginBottom: '8px' }}>{t.sidebar.bookmarksTab}</h1>
        <div style={{ width: '48px', height: '2px', background: goldAccent, marginBottom: '32px' }} />

        {!isLoggedIn && bookmarks.length > 0 && (
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '10px', padding: '12px 16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <p style={{ fontSize: '13px', color: textMuted }}>Sign in to sync bookmarks across devices.</p>
            <button
              onClick={() => router.push('/auth')}
              style={{ background: goldAccent, border: 'none', borderRadius: '7px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', color: 'white', fontFamily: 'inherit', flexShrink: 0 }}>
              Sign in
            </button>
          </div>
        )}

        {bookmarks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: '16px', color: textMuted, marginBottom: '8px' }}>{t.sidebar.noBookmarks}</p>
            <p style={{ fontSize: '14px', color: textMuted, fontStyle: 'italic' }}>
              Open any psalm and tap the bookmark icon to save it here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
            {[...bookmarks].sort((a, b) => a - b).map(num => (
              <div key={num} style={{ border: `1px solid ${border}`, borderRadius: '10px', background: surface, overflow: 'hidden' }}>
                <button
                  onClick={() => router.push(`/psalm/${num}`)}
                  style={{ width: '100%', padding: '14px 10px 10px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: textPrimary }}>
                  <p style={{ fontSize: '15px', fontWeight: '500', marginBottom: '2px' }}>{t.psalm.title}</p>
                  <p style={{ fontSize: '20px', fontWeight: '400', color: goldAccent }}>{num}</p>
                </button>
                <div style={{ padding: '0 8px 8px' }}>
                  <button
                    onClick={() => removeBookmark(num)}
                    aria-label={`Remove bookmark for Psalm ${num}`}
                    style={{ width: '100%', padding: '5px', background: 'none', border: `1px solid ${border}`, borderRadius: '6px', cursor: 'pointer', fontSize: '11px', color: textMuted, fontFamily: 'inherit' }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
