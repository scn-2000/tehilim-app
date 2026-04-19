'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Logo from '../../components/Logo';

function stripHtml(html: string): string {
  return html
    .replace(/<sup[^>]*>.*?<\/sup>/gi, '')
    .replace(/<i class="footnote">.*?<\/i>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function translitSephardic(text: string): string {
  if (!text) return '';
  text = text.replace(/יְהוָה/g, 'ADONAI');
  text = text.replace(/יהוה/g, 'ADONAI');
  text = text.replace(/יְהֹוָה/g, 'ADONAI');
  const nikud: Record<string, string> = {
    '\u05B0': 'e', '\u05B1': 'e', '\u05B2': 'a', '\u05B3': 'o',
    '\u05B4': 'i', '\u05B5': 'ê', '\u05B6': 'e', '\u05B7': 'a',
    '\u05B8': 'a', '\u05B9': 'o', '\u05BA': 'o', '\u05BB': 'u',
    '\u05BC': '', '\u05BD': '', '\u05BE': ' ', '\u05BF': '',
    '\u05C0': '', '\u05C1': '', '\u05C2': '', '\u05C4': '',
    '\u05C5': '', '\u05C7': 'o',
  };
  const letters: Record<string, string> = {
    '\u05D0': '', '\u05D1': 'v', '\u05D2': 'g', '\u05D3': 'd',
    '\u05D4': 'h', '\u05D5': 'v', '\u05D6': 'z', '\u05D7': 'ch',
    '\u05D8': 't', '\u05D9': 'y', '\u05DA': 'ch', '\u05DB': 'ch',
    '\u05DC': 'l', '\u05DD': 'm', '\u05DE': 'm', '\u05DF': 'n',
    '\u05E0': 'n', '\u05E1': 's', '\u05E2': '', '\u05E3': 'f',
    '\u05E4': 'f', '\u05E5': 'ts', '\u05E6': 'ts', '\u05E7': 'k',
    '\u05E8': 'r', '\u05E9': 'sh', '\u05EA': 't',
  };
  const dageshMap: Record<string, string> = {
    '\u05D1': 'b', '\u05DB': 'k', '\u05DA': 'k',
    '\u05E4': 'p', '\u05E3': 'p', '\u05D3': 'd',
    '\u05D2': 'g', '\u05D8': 't',
  };
  if (text.includes('ADONAI')) {
    return text.split('ADONAI').map(part => translitSephardic(part)).join('Adonai')
      .replace(/\s+/g, ' ').trim()
      .replace(/(^|\s)([a-z])/g, (_, space, letter) => space + letter.toUpperCase());
  }
  let result = '';
  let i = 0;
  const chars = [...text];
  while (i < chars.length) {
    const ch = chars[i];
    const next = chars[i + 1] || '';
    if (ch === '\u05D5') {
      if (next === '\u05B9' || next === '\u05BA') { result += 'o'; i += 2; continue; }
      if (next === '\u05BC') { result += 'v'; i += 2; continue; }
      if (next === '\u05BB') { result += 'u'; i += 2; continue; }
      result += 'v'; i++; continue;
    }
    if (ch === '\u05E9') {
      if (next === '\u05C2') { result += 's'; i += 2; continue; }
      result += 'sh'; i++;
      if (chars[i] === '\u05C1') i++;
      while (i < chars.length && nikud.hasOwnProperty(chars[i])) { result += nikud[chars[i]]; i++; }
      continue;
    }
    if (ch === '\u05D9') {
      if (next === '\u05B4') { result += 'i'; i += 2; continue; }
      if (next === '\u05B5') { result += 'ê'; i += 2; continue; }
      result += 'y'; i++;
      while (i < chars.length && nikud.hasOwnProperty(chars[i])) { result += nikud[chars[i]]; i++; }
      continue;
    }
    if (letters.hasOwnProperty(ch)) {
      let letterOut = letters[ch];
      if (next === '\u05BC' && dageshMap.hasOwnProperty(ch)) { letterOut = dageshMap[ch]; i++; }
      result += letterOut; i++;
      while (i < chars.length && nikud.hasOwnProperty(chars[i])) { result += nikud[chars[i]]; i++; }
      continue;
    }
    if (nikud.hasOwnProperty(ch)) { result += nikud[ch]; i++; continue; }
    if (ch === ' ') { result += ' '; i++; continue; }
    if (ch === '\u05BE') { result += ' '; i++; continue; }
    if ([',', '.', '!', '?', ':'].includes(ch)) { result += ch; i++; continue; }
    if (ch === '\u05C3' || ch === '\u05C0') { i++; continue; }
    i++;
  }
  return result
    .replace(/([aeiouê])\1+/g, '$1')
    .replace(/yy/g, 'y')
    .replace(/\s+/g, ' ').trim()
    .replace(/(^|\s)([a-z])/g, (_, space, letter) => space + letter.toUpperCase());
}

function usePersistentState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(defaultValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) setState(JSON.parse(stored));
    } catch {}
  }, [key]);

  const setPersistentState = (value: T) => {
    setState(value);
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  };

  return [state, setPersistentState] as const;
}

function getSet(key: string): number[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function saveSet(key: string, arr: number[]) {
  try { localStorage.setItem(key, JSON.stringify(arr)); } catch {}
}

export default function PsalmPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hebrew, setHebrew] = useState<string[]>([]);
  const [english, setEnglish] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const [showHebrew, setShowHebrew] = usePersistentState('pref_hebrew', true);
  const [showEnglish, setShowEnglish] = usePersistentState('pref_english', true);
  const [showPhonetics, setShowPhonetics] = usePersistentState('pref_phonetics', false);
  const [fontSize, setFontSize] = usePersistentState('pref_fontsize', 'medium');
  const [darkMode, setDarkMode] = usePersistentState('pref_darkmode', false);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [psalmDropdownOpen, setPsalmDropdownOpen] = useState(false);

  const settingsRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const psalmNum = Number(id);

  const fontSizeMap: Record<string, { hebrew: string; english: string }> = {
    small:  { hebrew: '18px', english: '13px' },
    medium: { hebrew: isMobile ? '22px' : '26px', english: isMobile ? '15px' : '16px' },
    large:  { hebrew: isMobile ? '26px' : '32px', english: isMobile ? '17px' : '19px' },
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    setHebrew([]); setEnglish([]);
    fetch(`https://www.sefaria.org/api/texts/Psalms.${id}?context=0&vhe=Tanach+with+Nikkud`)
      .then(res => res.json())
      .then(data => {
        setHebrew(data.he);
        setEnglish(data.text.map((v: string) => stripHtml(v)));
      });
    setIsBookmarked(getSet('bookmarks').includes(psalmNum));
  }, [id]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setPsalmDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function toggleBookmark() {
    const arr = getSet('bookmarks');
    const updated = arr.includes(psalmNum) ? arr.filter(n => n !== psalmNum) : [...arr, psalmNum];
    saveSet('bookmarks', updated);
    setIsBookmarked(!isBookmarked);
  }

  const bg = darkMode ? '#1a1008' : '#fdf6ec';
  const surface = darkMode ? '#2c1e0f' : '#fff8ee';
  const border = darkMode ? '#5c3d1e' : '#e8d5b5';
  const textPrimary = darkMode ? '#f5e9d4' : '#2c1810';
  const textMuted = darkMode ? '#c9a96e' : '#9a7a5a';
  const hebrewColor = darkMode ? '#a8c4e0' : '#1a3a5c';
  const englishColor = darkMode ? '#7ec89a' : '#1e4d2b';
  const phoneticsColor = darkMode ? '#d4a86a' : '#7a4e1e';
  const goldAccent = '#c9a96e';

  const settingToggle = (active: boolean) => ({
    width: '42px', height: '24px', borderRadius: '12px',
    background: active ? goldAccent : (darkMode ? '#4a3520' : '#ddd'),
    border: 'none', cursor: 'pointer', position: 'relative' as const,
    display: 'flex', alignItems: 'center', padding: '3px',
    justifyContent: active ? 'flex-end' : 'flex-start',
    transition: 'background 0.2s', flexShrink: 0,
  });
  const toggleKnob = { width: '18px', height: '18px', borderRadius: '50%', background: 'white' };

  const iconBtn = (active = false, activeBg = '') => ({
    background: active ? activeBg : 'none',
    border: `1px solid ${active ? activeBg : border}`,
    borderRadius: '8px', padding: '8px 10px',
    cursor: 'pointer', display: 'flex', alignItems: 'center',
    gap: '6px', transition: 'all 0.2s', flexShrink: 0,
  });

  return (
    <div style={{ minHeight: '100vh', background: bg, color: textPrimary, fontFamily: "'Lora', Georgia, serif", transition: 'background 0.3s' }}>

      {/* Top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: bg, borderBottom: `1px solid ${border}`, padding: isMobile ? '10px 12px' : '12px 24px' }}>

        {/* Row 1: Logo + All Psalms | Bookmark + Settings */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? '8px' : '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo size={28} />
            <button onClick={() => router.push('/')}
              style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: textPrimary, fontSize: '13px', fontFamily: 'inherit' }}>
              ← All Psalms
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={toggleBookmark} style={iconBtn(isBookmarked, goldAccent)}>
              <span style={{ fontSize: '15px' }}>🔖</span>
              {!isMobile && (
                <span style={{ fontSize: '13px', color: isBookmarked ? 'white' : textMuted, fontFamily: 'inherit' }}>
                  {isBookmarked ? 'Saved' : 'Bookmark'}
                </span>
              )}
            </button>

            <div ref={settingsRef} style={{ position: 'relative' }}>
              <button onClick={() => setSettingsOpen(!settingsOpen)}
                style={{ background: settingsOpen ? surface : 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', fontSize: '16px' }}>
                ⚙️
              </button>
              {settingsOpen && (
                <div style={{ position: 'absolute', top: '44px', right: 0, background: surface, border: `1px solid ${border}`, borderRadius: '12px', padding: '20px', width: '260px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 200 }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: textMuted, marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Display Settings</p>
                  {[
                    { label: 'Hebrew', value: showHebrew, set: setShowHebrew },
                    { label: 'English', value: showEnglish, set: setShowEnglish },
                    { label: 'Phonetics', value: showPhonetics, set: setShowPhonetics },
                  ].map(({ label, value, set }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{ fontSize: '15px', color: textPrimary }}>{label}</span>
                      <button style={settingToggle(value)} onClick={() => set(!value)}>
                        <div style={toggleKnob} />
                      </button>
                    </div>
                  ))}
                  <div style={{ borderTop: `1px solid ${border}`, margin: '16px 0' }} />
                  <p style={{ fontSize: '13px', color: textMuted, marginBottom: '10px' }}>Font Size</p>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    {['small', 'medium', 'large'].map(size => (
                      <button key={size} onClick={() => setFontSize(size)}
                        style={{ flex: 1, padding: '6px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', border: `1px solid ${fontSize === size ? goldAccent : border}`, background: fontSize === size ? goldAccent : 'transparent', color: fontSize === size ? 'white' : textPrimary }}>
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '15px', color: textPrimary }}>Dark Mode</span>
                    <button style={settingToggle(darkMode)} onClick={() => setDarkMode(!darkMode)}>
                      <div style={toggleKnob} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2 (always visible): Prev | Psalm dropdown | Next */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <button onClick={() => router.push(`/psalm/${psalmNum - 1}`)} disabled={psalmNum <= 1}
            style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '8px 14px', cursor: psalmNum <= 1 ? 'default' : 'pointer', color: psalmNum <= 1 ? textMuted : textPrimary, fontSize: '16px', opacity: psalmNum <= 1 ? 0.4 : 1 }}>
            ←
          </button>

          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button onClick={() => setPsalmDropdownOpen(!psalmDropdownOpen)}
              style={{ background: surface, border: `1px solid ${goldAccent}`, borderRadius: '8px', padding: '8px 20px', cursor: 'pointer', color: textPrimary, fontSize: '15px', fontFamily: 'inherit', fontWeight: '500', minWidth: isMobile ? '160px' : '180px', textAlign: 'center' }}>
              Psalm {psalmNum} ▾
            </button>

            {psalmDropdownOpen && (
              <div style={{ position: 'absolute', top: '44px', left: '50%', transform: 'translateX(-50%)', background: surface, border: `1px solid ${border}`, borderRadius: '12px', padding: '8px', width: isMobile ? '280px' : '300px', maxHeight: '320px', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 200 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
                  {Array.from({ length: 150 }, (_, i) => i + 1).map(num => (
                    <button key={num} onClick={() => { router.push(`/psalm/${num}`); setPsalmDropdownOpen(false); }}
                      style={{ padding: '8px 4px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', textAlign: 'center', border: num === psalmNum ? `1px solid ${goldAccent}` : '1px solid transparent', background: num === psalmNum ? goldAccent : 'transparent', color: num === psalmNum ? 'white' : textPrimary, fontFamily: 'inherit' }}>
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={() => router.push(`/psalm/${psalmNum + 1}`)} disabled={psalmNum >= 150}
            style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '8px 14px', cursor: psalmNum >= 150 ? 'default' : 'pointer', color: psalmNum >= 150 ? textMuted : textPrimary, fontSize: '16px', opacity: psalmNum >= 150 ? 0.4 : 1 }}>
            →
          </button>
        </div>
      </div>

      {/* Psalm title */}
      <div style={{ textAlign: 'center', padding: isMobile ? '28px 16px 16px' : '40px 24px 24px' }}>
        <p style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '8px' }}>תהילים</p>
        <h1 style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: '400', color: textPrimary }}>Psalm {psalmNum}</h1>
        <div style={{ width: '48px', height: '2px', background: goldAccent, margin: '12px auto 0' }} />
      </div>

      {/* Verses */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: isMobile ? '0 16px 60px' : '0 24px 80px' }}>
        {hebrew.length === 0 ? (
          <p style={{ textAlign: 'center', color: textMuted, padding: '60px 0' }}>Loading...</p>
        ) : (
          hebrew.map((verse, i) => (
            <div key={i} style={{ marginBottom: '28px', paddingBottom: '28px', borderBottom: `1px solid ${border}` }}>
              {showHebrew && (
                <p dir="rtl" style={{ fontSize: fontSizeMap[fontSize].hebrew, fontFamily: "'Frank Ruhl Libre', serif", lineHeight: '2', marginBottom: '10px', color: hebrewColor }}
                  dangerouslySetInnerHTML={{ __html: verse }} />
              )}
              {showPhonetics && (
                <p style={{ fontSize: fontSizeMap[fontSize].english, fontStyle: 'italic', marginBottom: '8px', color: phoneticsColor, lineHeight: '1.7' }}>
                  {translitSephardic(stripHtml(verse))}
                </p>
              )}
              {showEnglish && (
                <p style={{ fontSize: fontSizeMap[fontSize].english, color: englishColor, lineHeight: '1.8' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: textMuted, marginRight: '6px' }}>{i + 1}</span>
                  {english[i]}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}