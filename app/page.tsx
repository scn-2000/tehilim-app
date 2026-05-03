'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Logo from './components/Logo';
import Sidebar from './components/Sidebar';
import LanguageSelector from './components/LanguageSelector';
import { useTranslations } from './lib/i18n';

function getSet(key: string): number[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

export default function Home() {
  const router = useRouter();
  const { t } = useTranslations();
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBookmarks(getSet('bookmarks'));
    try { setDarkMode(JSON.parse(localStorage.getItem('pref_darkmode') || 'false')); } catch {}
    try { setHighContrast(JSON.parse(localStorage.getItem('pref_highcontrast') || 'false')); } catch {}
    try {
      const fs = localStorage.getItem('pref_fontsize');
      if (fs === 'small' || fs === 'medium' || fs === 'large') setFontSize(fs);
    } catch {}
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function savePref(key: string, value: boolean | string) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  const bg = highContrast ? '#ffffff' : darkMode ? '#1a1008' : '#fdf6ec';
  const surface = highContrast ? '#f5f5f5' : darkMode ? '#2c1e0f' : '#fff8ee';
  const border = highContrast ? '#000000' : darkMode ? '#5c3d1e' : '#e8d5b5';
  const textPrimary = highContrast ? '#000000' : darkMode ? '#f5e9d4' : '#2c1810';
  const textMuted = highContrast ? '#333333' : darkMode ? '#c9a96e' : '#9a7a5a';
  const goldAccent = highContrast ? '#000000' : '#c9a96e';

  const gridFontSize = { small: isMobile ? '13px' : '12px', medium: isMobile ? '15px' : '14px', large: isMobile ? '17px' : '16px' }[fontSize];
  const gridPadding = { small: isMobile ? '10px 2px' : '8px 2px', medium: isMobile ? '14px 4px' : '10px 4px', large: isMobile ? '18px 4px' : '14px 4px' }[fontSize];

  const settingToggle = (active: boolean) => ({
    width: '42px', height: '24px', borderRadius: '12px',
    background: active ? goldAccent : (darkMode ? '#4a3520' : '#ddd'),
    border: 'none', cursor: 'pointer', position: 'relative' as const,
    display: 'flex', alignItems: 'center', padding: '3px',
    justifyContent: active ? 'flex-end' : 'flex-start',
    transition: 'background 0.2s', flexShrink: 0,
  });
  const toggleKnob = { width: '18px', height: '18px', borderRadius: '50%', background: 'white' };

  return (
    <div style={{ minHeight: '100vh', background: bg, color: textPrimary, fontFamily: "'Lora', Georgia, serif" }}>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} darkMode={darkMode} />

      {/* Sticky top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: bg, borderBottom: `1px solid ${border}`, padding: isMobile ? '0 16px' : '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', height: '44px', width: '44px', cursor: 'pointer', color: textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, height: '44px', display: 'flex', alignItems: 'center' }}>
            <Logo size={32} />
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LanguageSelector border={border} surface={surface} textPrimary={textPrimary} textMuted={textMuted} />
          <div ref={settingsRef} style={{ position: 'relative' }}>
            <button onClick={() => setSettingsOpen(!settingsOpen)}
              style={{ background: settingsOpen ? (darkMode ? '#3a2510' : '#f0e4cc') : 'none', border: `1px solid ${settingsOpen ? 'transparent' : border}`, borderRadius: '8px', height: '44px', width: '44px', cursor: 'pointer', color: textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconSettings />
            </button>
            {settingsOpen && (
              <div style={{ position: 'absolute', top: '44px', right: 0, background: surface, border: `1px solid ${border}`, borderRadius: '12px', padding: '20px', width: '240px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 200 }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: textMuted, marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t.settings.title}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '15px', color: textPrimary }}>{t.settings.darkMode}</span>
                  <button style={settingToggle(darkMode)} onClick={() => {
                    const next = !darkMode;
                    setDarkMode(next); savePref('pref_darkmode', next);
                    if (next) { setHighContrast(false); savePref('pref_highcontrast', false); }
                  }}>
                    <div style={toggleKnob} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '15px', color: textPrimary }}>{t.settings.highContrast}</span>
                    <p style={{ fontSize: '11px', color: textMuted, marginTop: '2px' }}>{t.settings.accessibility}</p>
                  </div>
                  <button style={settingToggle(highContrast)} onClick={() => {
                    const next = !highContrast;
                    setHighContrast(next); savePref('pref_highcontrast', next);
                    if (next) { setDarkMode(false); savePref('pref_darkmode', false); }
                  }}>
                    <div style={toggleKnob} />
                  </button>
                </div>

                <div style={{ borderTop: `1px solid ${border}`, margin: '4px 0 16px' }} />
                <p style={{ fontSize: '13px', color: textMuted, marginBottom: '10px' }}>{t.settings.fontSize}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['small', 'medium', 'large'] as const).map(size => (
                    <button key={size} onClick={() => { setFontSize(size); savePref('pref_fontsize', size); }}
                      style={{ flex: 1, padding: '6px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', border: `1px solid ${fontSize === size ? goldAccent : border}`, background: fontSize === size ? goldAccent : 'transparent', color: fontSize === size ? 'white' : textPrimary }}>
                      {{ small: t.settings.small, medium: t.settings.medium, large: t.settings.large }[size]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', padding: isMobile ? '40px 16px 32px' : '60px 24px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <Logo size={isMobile ? 56 : 72} />
        </div>
        <h1 style={{ fontSize: isMobile ? '32px' : '40px', fontWeight: '300', marginBottom: '8px' }}>TehilimForAll</h1>
        <p style={{ fontSize: '14px', color: textMuted, marginBottom: '4px' }}>תהילים לכולם</p>
        <p style={{ fontSize: isMobile ? '15px' : '18px', color: textMuted, marginBottom: '32px' }}>{t.tagline}</p>
        <div style={{ width: '48px', height: '2px', background: goldAccent, margin: '0 auto' }} />
      </div>

      {/* Psalm grid */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '0 12px 60px' : '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 5 : 10}, 1fr)`, gap: isMobile ? '6px' : '8px' }}>
          {Array.from({ length: 150 }, (_, i) => i + 1).map(num => {
            const isBookmarked = bookmarks.includes(num);
            return (
              <button key={num} onClick={() => router.push(`/psalm/${num}`)}
                style={{
                  padding: gridPadding,
                  cursor: 'pointer', borderRadius: '8px',
                  fontSize: gridFontSize,
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
