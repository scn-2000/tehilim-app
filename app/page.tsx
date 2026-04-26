'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './components/Logo';

function getSet(key: string): number[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

export default function Home() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setBookmarks(getSet('bookmarks'));
    try { setDarkMode(JSON.parse(localStorage.getItem('pref_darkmode') || 'false')); } catch {}
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const bg = darkMode ? '#1a1008' : '#fdf6ec';
  const surface = darkMode ? '#2c1e0f' : '#fff8ee';
  const border = darkMode ? '#5c3d1e' : '#e8d5b5';
  const textPrimary = darkMode ? '#f5e9d4' : '#2c1810';
  const textMuted = darkMode ? '#c9a96e' : '#9a7a5a';
  const goldAccent = '#c9a96e';

  return (
    <div style={{ minHeight: '100vh', background: bg, color: textPrimary, fontFamily: "'Lora', Georgia, serif" }}>

      {/* Sticky top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: bg, borderBottom: `1px solid ${border}`, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <Logo size={32} />
        </button>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', padding: isMobile ? '40px 16px 32px' : '60px 24px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <Logo size={isMobile ? 56 : 72} />
        </div>
        <h1 style={{ fontSize: isMobile ? '32px' : '40px', fontWeight: '300', marginBottom: '8px' }}>TehilimForAll</h1>
        <p style={{ fontSize: '14px', color: textMuted, marginBottom: '4px' }}>תהילים לכולם</p>
        <p style={{ fontSize: isMobile ? '15px' : '18px', color: textMuted, marginBottom: '32px' }}>The Book of Psalms — for everyone</p>
        <div style={{ width: '48px', height: '2px', background: goldAccent, margin: '0 auto' }} />
      </div>

      {/* Continue from bookmark */}
      {bookmarks.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px', padding: '0 16px' }}>
          <button onClick={() => router.push(`/psalm/${bookmarks[bookmarks.length - 1]}`)}
            style={{ background: 'none', border: `1px solid ${goldAccent}`, borderRadius: '20px', padding: '10px 20px', cursor: 'pointer', fontSize: '14px', color: goldAccent, fontFamily: 'inherit' }}>
            🔖 Go to last bookmark — Psalm {bookmarks[bookmarks.length - 1]}
          </button>
        </div>
      )}

      {/* Psalm grid */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '0 12px 60px' : '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 5 : 10}, 1fr)`, gap: isMobile ? '6px' : '8px' }}>
          {Array.from({ length: 150 }, (_, i) => i + 1).map(num => {
            const isBookmarked = bookmarks.includes(num);
            return (
              <button key={num} onClick={() => router.push(`/psalm/${num}`)}
                style={{
                  padding: isMobile ? '14px 4px' : '10px 4px',
                  cursor: 'pointer', borderRadius: '8px',
                  fontSize: isMobile ? '15px' : '14px',
                  fontFamily: 'inherit',
                  border: isBookmarked ? `2px solid ${goldAccent}` : `1px solid ${border}`,
                  background: isBookmarked ? (darkMode ? '#3a2a10' : '#fdf0d5') : surface,
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