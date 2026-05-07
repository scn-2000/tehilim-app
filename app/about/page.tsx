'use client';

import { useSettings } from '../lib/settings';
import { useTranslations } from '../lib/i18n';

const LEILUI_NAMES = [
  'Venus Nedjma bat Esther z\'l',
  'Chmouel ben Zara Tekouka z\'l',
  'Lazare ben Zara Tekouka z\'l',
  'Lory-Marine Goumara Levana z\'l bat Yvonne Haya',
  'Jean-Marc Mordehaï z\'l ben Alain David',
  'Maxime Nessim ben Messaouda z\'l',
  'Danielle Hanna bat Messaouda z\'l',
  'Hayal Liav z\'l Ben Orith Ryvka',
  'Hayal Omri z\'l Ben Iris',
  'Harel z\'l ben Shoshana',
];

export default function AboutPage() {
  const { darkMode, highContrast } = useSettings();
  const { t } = useTranslations();

  const bg = highContrast ? '#ffffff' : darkMode ? '#1a1008' : '#fdf6ec';
  const border = highContrast ? '#000000' : darkMode ? '#5c3d1e' : '#e8d5b5';
  const textPrimary = highContrast ? '#000000' : darkMode ? '#f5e9d4' : '#2c1810';
  const textMuted = highContrast ? '#333333' : darkMode ? '#c9a96e' : '#7c6248';
  const goldAccent = highContrast ? '#000000' : '#c9a96e';
  const surface = highContrast ? '#f5f5f5' : darkMode ? '#2c1e0f' : '#fff8ee';

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "var(--font-lora), Georgia, serif", color: textPrimary }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px 80px' }}>

        <div style={{ border: `1px solid ${goldAccent}`, background: surface, borderRadius: '12px', padding: '24px 28px', marginBottom: '40px', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: textMuted, marginBottom: '10px' }}>
            {t.about.leilui.writtenFor}
          </p>
          <p
            style={{
              fontSize: '24px',
              fontFamily: "var(--font-frank-ruhl-libre), 'Frank Ruhl Libre', serif",
              fontWeight: '400',
              color: textPrimary,
              marginBottom: '4px',
              direction: 'rtl',
            }}
          >
            לעילוי נשמת
          </p>
          <p style={{ fontSize: '13px', color: textMuted, marginBottom: '20px', fontStyle: 'italic' }}>
            {t.about.leilui.phonetic}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {LEILUI_NAMES.map((name) => (
              <p key={name} style={{ fontSize: '14px', color: textMuted, lineHeight: 1.6, maxWidth: '420px', margin: 0, textAlign: 'left' }}>
                {name}
              </p>
            ))}
          </div>
          <p style={{ marginTop: '20px', fontSize: '12px', color: goldAccent, letterSpacing: '0.08em' }}>
            {t.about.leilui.blessing}
          </p>
        </div>

        <p style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '8px' }}>
          {t.about.eyebrow}
        </p>
        <h1 style={{ fontSize: '36px', fontWeight: '400', marginBottom: '8px', lineHeight: 1.2 }}>
          {t.about.title}
        </h1>
        <div style={{ width: '48px', height: '2px', background: goldAccent, marginBottom: '40px' }} />

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '16px', color: textPrimary }}>
            {t.about.section1.title}
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: textPrimary, marginBottom: '14px' }}>
            {t.about.section1.p1}
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: textPrimary, marginBottom: '14px' }}>
            {t.about.section1.p2}
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: textPrimary }}>
            {t.about.section1.p3}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '24px' }}>
            {t.about.section1.features.map(f => (
              <span key={f} style={{ padding: '5px 12px', background: surface, border: `1px solid ${border}`, borderRadius: '20px', fontSize: '13px', color: textMuted }}>
                {f}
              </span>
            ))}
          </div>
        </section>

        <div style={{ height: '1px', background: border, marginBottom: '48px' }} />

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '16px', color: textPrimary }}>
            {t.about.section2.title}
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: textPrimary, marginBottom: '20px' }}>
            {t.about.section2.p1}
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: textPrimary, marginBottom: '20px' }}>
            {t.about.section2.p2}
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: textPrimary, marginBottom: '20px' }}>
            {t.about.section2.p3}
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: textPrimary }}>
            {t.about.section2.p4}
          </p>
        </section>
      </div>
    </div>
  );
}
