'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Logo from './Logo';
import LanguageSelector from './LanguageSelector';
import { useSettings } from '../lib/settings';
import { getUser, signOut } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { useTranslations } from '../lib/i18n';

const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

function getActiveTab(pathname: string): string | null {
  if (pathname === '/' || pathname.startsWith('/psalm')) return 'psalms';
  if (pathname.startsWith('/bookmarks')) return 'bookmarks';
  if (pathname.startsWith('/lists') || pathname.startsWith('/list/')) return 'lists';
  if (pathname.startsWith('/collective')) return 'collective';
  if (pathname.startsWith('/categories') || pathname.startsWith('/category')) return 'categories';
  return null;
}

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { darkMode, highContrast, fontSize, setDarkMode, setHighContrast, setFontSize } = useSettings();
  const { t } = useTranslations();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const showTabs = pathname !== '/auth';
  const activeTab = getActiveTab(pathname);

  const bg = highContrast ? '#ffffff' : darkMode ? '#1a1008' : '#fdf6ec';
  const tabsBg = highContrast ? '#f5f5f5' : darkMode ? '#2c1e0f' : '#f0e6d3';
  const border = highContrast ? '#000000' : darkMode ? '#5c3d1e' : '#e8d5b5';
  const textPrimary = highContrast ? '#000000' : darkMode ? '#f5e9d4' : '#2c1810';
  const textMuted = highContrast ? '#333333' : darkMode ? '#c9a96e' : '#9a7a5a';
  const goldAccent = highContrast ? '#000000' : '#c9a96e';
  const surface = highContrast ? '#f5f5f5' : darkMode ? '#2c1e0f' : '#fff8ee';

  const TABS = [
    { key: 'psalms',     label: 'Psalms',                  href: '/' },
    { key: 'bookmarks',  label: t.sidebar.bookmarksTab,    href: '/bookmarks' },
    { key: 'lists',      label: t.sidebar.listsTab,        href: '/lists' },
    { key: 'collective', label: t.sidebar.collectiveTab,   href: '/collective' },
    { key: 'categories', label: t.categories.tab,          href: '/categories' },
  ];

  useEffect(() => {
    getUser().then(u => setUser(u as { id: string; email?: string } | null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleStyle = (active: boolean) => ({
    width: '42px', height: '24px', borderRadius: '12px',
    background: active ? goldAccent : (darkMode ? '#4a3520' : '#ddd'),
    border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', padding: '3px',
    justifyContent: active ? 'flex-end' : 'flex-start',
    transition: 'background 0.2s', flexShrink: 0,
  });
  const knob = { width: '18px', height: '18px', borderRadius: '50%', background: 'white' };

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 200, fontFamily: "var(--font-lora), Georgia, serif" }}>

      {/* Header row */}
      <div style={{
        background: bg,
        borderBottom: showTabs ? 'none' : `1px solid ${border}`,
        padding: '0 16px 0 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '56px',
      }}>
        <button
          onClick={() => router.push('/')}
          aria-label="TehilimForAll home"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
          <Logo size={28} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

          {/* Settings dropdown */}
          <div ref={settingsRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setSettingsOpen(v => !v)}
              aria-label="Settings"
              aria-expanded={settingsOpen}
              style={{
                background: settingsOpen ? (darkMode ? '#3a2510' : '#f0e4cc') : 'none',
                border: `1px solid ${settingsOpen ? 'transparent' : border}`,
                borderRadius: '8px', height: '36px', width: '36px',
                cursor: 'pointer', color: textMuted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
              <IconSettings />
            </button>

            {settingsOpen && (
              <div style={{
                position: 'absolute', top: '44px', right: 0,
                background: surface, border: `1px solid ${border}`,
                borderRadius: '12px', padding: '16px', width: '220px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 300,
              }}>
                <p style={{ fontSize: '11px', fontWeight: '600', color: textMuted, marginBottom: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {t.settings.title}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: textPrimary }}>{t.settings.darkMode}</span>
                  <button style={toggleStyle(darkMode)} onClick={() => { setDarkMode(!darkMode); if (!darkMode) setHighContrast(false); }}>
                    <div style={knob} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '14px', color: textPrimary }}>{t.settings.highContrast}</span>
                    <p style={{ fontSize: '11px', color: textMuted, marginTop: '1px' }}>{t.settings.accessibility}</p>
                  </div>
                  <button style={toggleStyle(highContrast)} onClick={() => { setHighContrast(!highContrast); if (!highContrast) setDarkMode(false); }}>
                    <div style={knob} />
                  </button>
                </div>

                <div style={{ borderTop: `1px solid ${border}`, paddingTop: '12px' }}>
                  <p style={{ fontSize: '11px', color: textMuted, marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {t.settings.fontSize}
                  </p>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {(['small', 'medium', 'large'] as const).map(size => (
                      <button key={size} onClick={() => setFontSize(size)}
                        style={{
                          flex: 1, padding: '5px', borderRadius: '6px', cursor: 'pointer',
                          fontSize: '12px', fontFamily: 'inherit',
                          border: `1px solid ${fontSize === size ? goldAccent : border}`,
                          background: fontSize === size ? goldAccent : 'transparent',
                          color: fontSize === size ? 'white' : textPrimary,
                        }}>
                        {{ small: t.settings.small, medium: t.settings.medium, large: t.settings.large }[size]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Auth button — hidden on /auth page */}
          {pathname !== '/auth' && (
            user ? (
              <button
                onClick={async () => { await signOut(); setUser(null); }}
                style={{
                  background: 'none', border: `1px solid ${border}`, borderRadius: '8px',
                  padding: '0 12px', height: '36px', cursor: 'pointer',
                  fontSize: '13px', color: textMuted, fontFamily: 'inherit', whiteSpace: 'nowrap',
                }}>
                {t.sidebar.signOut}
              </button>
            ) : (
              <button
                onClick={() => router.push('/auth')}
                style={{
                  background: 'none', border: `1px solid ${border}`, borderRadius: '8px',
                  padding: '0 12px', height: '36px', cursor: 'pointer',
                  fontSize: '13px', color: textMuted, fontFamily: 'inherit', whiteSpace: 'nowrap',
                }}>
                Sign in
              </button>
            )
          )}

          {pathname !== '/auth' && (
            <button
              onClick={() => router.push('/about')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: '600', fontFamily: 'inherit',
                color: highContrast ? '#000000' : darkMode ? '#f5e9d4' : '#2c1810',
                padding: '0 4px', whiteSpace: 'nowrap',
              }}>
              {t.sidebar.aboutLink}
            </button>
          )}

          <LanguageSelector border={border} surface={surface} textPrimary={textPrimary} textMuted={textMuted} />
        </div>
      </div>

      {/* Nav tabs row */}
      {showTabs && (
        <div style={{
          background: tabsBg,
          borderBottom: `1px solid ${border}`,
          display: 'flex',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}>
          {TABS.map(({ key, label, href }) => (
            <button
              key={key}
              onClick={() => router.push(href)}
              style={{
                flex: '1 0 auto',
                padding: '11px 8px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === key ? `2px solid ${goldAccent}` : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                color: activeTab === key ? textPrimary : textMuted,
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
