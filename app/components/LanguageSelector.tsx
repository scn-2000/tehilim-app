'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations, LOCALES } from '../lib/i18n';

interface Props {
  border?: string;
  textPrimary?: string;
  textMuted?: string;
  surface?: string;
}

export default function LanguageSelector({
  border = '#e8d5b5',
  textPrimary = '#2c1810',
  textMuted = '#9a7a5a',
  surface = '#fff8ee',
}: Props) {
  const { locale, setLocale } = useTranslations();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const goldAccent = '#c9a96e';

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none', border: `1px solid ${border}`, borderRadius: '8px',
          padding: '6px 10px', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
          color: textMuted, fontFamily: 'inherit', letterSpacing: '0.06em',
        }}
      >
        {locale.toUpperCase()} ▾
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          background: surface, border: `1px solid ${border}`, borderRadius: '10px',
          padding: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', zIndex: 500, minWidth: '120px',
        }}>
          {LOCALES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { setLocale(value); setOpen(false); }}
              style={{
                display: 'block', width: '100%', padding: '8px 12px',
                background: value === locale ? goldAccent : 'none',
                border: 'none', borderRadius: '7px', cursor: 'pointer',
                textAlign: 'left', fontSize: '13px',
                color: value === locale ? 'white' : textPrimary,
                fontFamily: 'inherit',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
