'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '../lib/settings';
import { getUser } from '../lib/auth';
import { useTranslations } from '../lib/i18n';

const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export default function CollectivePage() {
  const router = useRouter();
  const { darkMode, highContrast } = useSettings();
  const { t } = useTranslations();
  const [collectives, setCollectives] = useState<{ id: string; name: string; role: string }[]>([]);

  const bg = highContrast ? '#ffffff' : darkMode ? '#1a1008' : '#fdf6ec';
  const border = highContrast ? '#000000' : darkMode ? '#5c3d1e' : '#e8d5b5';
  const textPrimary = highContrast ? '#000000' : darkMode ? '#f5e9d4' : '#2c1810';
  const textMuted = highContrast ? '#333333' : darkMode ? '#c9a96e' : '#7c6248';
  const goldAccent = highContrast ? '#000000' : '#c9a96e';
  const surface = highContrast ? '#f5f5f5' : darkMode ? '#2c1e0f' : '#fff8ee';

  useEffect(() => {
    try {
      setCollectives(JSON.parse(localStorage.getItem('my_collectives') || '[]'));
    } catch {}
  }, []);

  async function handleNew() {
    const u = await getUser();
    router.push(u ? '/collective/new' : '/auth');
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "var(--font-lora), Georgia, serif", color: textPrimary }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <p style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '8px' }}>
              {t.sidebar.collectiveTab}
            </p>
            <h1 style={{ fontSize: '36px', fontWeight: '400', marginBottom: '8px' }}>{t.sidebar.collectiveReading}</h1>
          </div>
          <button
            onClick={handleNew}
            style={{ background: goldAccent, border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', color: 'white', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '28px', flexShrink: 0 }}>
            <IconPlus /> {t.sidebar.new}
          </button>
        </div>
        <div style={{ width: '48px', height: '2px', background: goldAccent, marginBottom: '32px' }} />

        {collectives.length === 0 ? (
          <div>
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '12px', padding: '28px', marginBottom: '32px', textAlign: 'center' }}>
              <p style={{ fontSize: '16px', color: textMuted, marginBottom: '8px' }}>{t.sidebar.noCollectives}</p>
              <p style={{ fontSize: '14px', color: textMuted, fontStyle: 'italic', lineHeight: 1.7 }}>
                {t.sidebar.collectiveTagline}
              </p>
            </div>
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '12px', padding: '24px' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: textPrimary, marginBottom: '10px' }}>How it works</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Create a reading — set a name, a dedication, and optional dates.',
                  'Share the link with family, friends, or a community.',
                  'Each person claims the psalms they will read.',
                  'A live progress bar shows how much of all 150 psalms have been covered.',
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: goldAccent, color: 'white', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i + 1}</span>
                    <p style={{ fontSize: '14px', color: textPrimary, lineHeight: 1.6 }}>{step}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={handleNew}
                style={{ width: '100%', marginTop: '20px', padding: '12px', background: goldAccent, border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', color: 'white', fontFamily: 'inherit' }}>
                Create a Collective Reading
              </button>
              <p style={{ fontSize: '12px', color: textMuted, textAlign: 'center', marginTop: '8px' }}>Requires an account</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {collectives.map(c => (
              <button
                key={c.id}
                onClick={() => router.push(`/collective/${c.id}`)}
                style={{ padding: '16px 18px', background: surface, border: `1px solid ${border}`, borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '15px', color: textPrimary, fontWeight: '500', marginBottom: '4px' }}>{c.name}</p>
                  <p style={{ fontSize: '12px', color: textMuted, textTransform: 'capitalize' }}>{c.role}</p>
                </div>
                <span style={{ color: textMuted, fontSize: '18px' }}>›</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
