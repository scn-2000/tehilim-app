'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getCategoryBySlug } from '../../lib/categories';
import { getLists, addPsalmToList, removePsalmFromList, decodeSharedList, PsalmList } from '../../lib/lists';
import { getUser, addBookmarkToCloud, removeBookmarkFromCloud } from '../../lib/auth';
import { useTranslations } from '../../lib/i18n';
import { useSettings } from '../../lib/settings';

function stripHtml(html: string): string {
  return html
    .replace(/<sup[^>]*>.*?<\/sup>/gi, '')
    .replace(/<i class="footnote">.*?<\/i>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function usePersistentState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(defaultValue);
  useEffect(() => {
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

const IconBookmark = ({ filled }: { filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconPaperPlane = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const IconLink = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const IconCopy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconSpeechBubble = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const PSALM_HEBREW: Record<number, string> = (() => {
  const ones = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
  const tens = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
  function toHeb(n: number): string {
    let rem = n;
    let r = '';
    if (rem >= 100) { r += 'ק'; rem -= 100; }
    if (rem === 15) return r + 'טו';
    if (rem === 16) return r + 'טז';
    if (rem >= 10) { r += tens[Math.floor(rem / 10)]; rem %= 10; }
    r += ones[rem];
    return r;
  }
  const map: Record<number, string> = {};
  for (let i = 1; i <= 150; i++) map[i] = toHeb(i);
  return map;
})();

export default function PsalmPage() {
  const { id } = useParams();
  const router = useRouter();
  const { darkMode, highContrast, fontSize } = useSettings();
  const [hebrew, setHebrew] = useState<string[]>([]);
  const [english, setEnglish] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const [showHebrew, setShowHebrew] = usePersistentState('pref_hebrew', true);
  const [showEnglish, setShowEnglish] = usePersistentState('pref_english', false);
  const [showPhonetics, setShowPhonetics] = usePersistentState('pref_phonetics', true);
  const { t } = useTranslations();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [psalmDropdownOpen, setPsalmDropdownOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [lists, setLists] = useState<PsalmList[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [showSyncToast, setShowSyncToast] = useState(false);

  const searchParams = useSearchParams();
  const settingsRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const saveRef = useRef<HTMLDivElement>(null);
  const psalmNum = Number(id);

  const categorySlug = searchParams.get('category');
  const categoryData = categorySlug ? getCategoryBySlug(categorySlug) : null;
  const categoryIndex = categoryData ? categoryData.psalms.indexOf(psalmNum) : -1;
  const prevCategoryPsalm = categoryData && categoryIndex > 0 ? categoryData.psalms[categoryIndex - 1] : null;
  const nextCategoryPsalm = categoryData && categoryIndex !== -1 && categoryIndex < categoryData.psalms.length - 1 ? categoryData.psalms[categoryIndex + 1] : null;

  const listId = searchParams.get('list');
  const [listNavData, setListNavData] = useState<{ name: string; psalms: number[] } | null>(null);
  const [transliterations, setTransliterations] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetch('/transliterations.json')
      .then(res => res.json())
      .then(data => setTransliterations(data))
      .catch(() => {});
  }, []);

  const fontSizeMap: Record<string, { hebrew: string; english: string }> = {
    small:  { hebrew: highContrast ? '22px' : '18px', english: highContrast ? '15px' : '13px' },
    medium: { hebrew: highContrast ? '28px' : isMobile ? '22px' : '26px', english: highContrast ? '17px' : isMobile ? '15px' : '16px' },
    large:  { hebrew: highContrast ? '34px' : isMobile ? '26px' : '32px', english: highContrast ? '20px' : isMobile ? '17px' : '19px' },
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
    const bm = getSet('bookmarks');
    setIsBookmarked(bm.includes(psalmNum));
    setLists(getLists());
    getUser().then(u => setUserId(u?.id ?? null));
  }, [id]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setPsalmDropdownOpen(false);
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) setShareOpen(false);
      if (saveRef.current && !saveRef.current.contains(e.target as Node)) setSaveOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!listId) { setListNavData(null); return; }
    const local = getLists().find(l => l.id === listId);
    if (local) { setListNavData({ name: local.name, psalms: local.psalms }); return; }
    const decoded = decodeSharedList(listId);
    setListNavData(decoded ? { name: decoded.name, psalms: decoded.psalms } : null);
  }, [listId]);

  function toggleBookmark() {
    const arr = getSet('bookmarks');
    const adding = !arr.includes(psalmNum);
    const updated = adding ? [...arr, psalmNum] : arr.filter(n => n !== psalmNum);
    saveSet('bookmarks', updated);
    setIsBookmarked(adding);
    if (userId) {
      if (adding) addBookmarkToCloud(userId, psalmNum);
      else removeBookmarkFromCloud(userId, psalmNum);
    } else if (adding) {
      triggerSyncToast();
    }
  }

  function handleToggleInList(listId: string) {
    const list = lists.find(l => l.id === listId);
    if (!list) return;
    if (list.psalms.includes(psalmNum)) {
      removePsalmFromList(listId, psalmNum);
    } else {
      addPsalmToList(listId, psalmNum);
      if (!userId) triggerSyncToast();
    }
    setLists(getLists());
  }

  function triggerSyncToast() {
    setShowSyncToast(true);
    setTimeout(() => setShowSyncToast(false), 3000);
  }

  async function handleFeedback() {
    if (!feedbackMessage.trim()) return;
    setFeedbackSending(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: feedbackMessage, email: feedbackEmail, page: window.location.pathname }),
      });
      setFeedbackSent(true);
      setFeedbackMessage('');
    } catch {}
    setFeedbackSending(false);
  }

  function openFeedback() {
    setFeedbackSent(false);
    setFeedbackMessage('');
    setFeedbackOpen(true);
  }

  function closeFeedback() {
    setFeedbackOpen(false);
    setFeedbackMessage('');
    setFeedbackSent(false);
  }

  function handleShare(type: 'link' | 'text') {
    const url = `https://tehilimforall.com/psalm/${psalmNum}`;
    const psalmText = hebrew.map((verse, i) =>
      `${i + 1}. ${stripHtml(verse)}\n${english[i] || ''}`
    ).join('\n\n');
    if (type === 'link') {
      if (navigator.share) {
        navigator.share({ title: `Psalm ${psalmNum} — TehilimForAll`, url });
      } else {
        navigator.clipboard.writeText(url);
        alert('Link copied!');
      }
    } else {
      const text = `Psalm ${psalmNum}\n\n${psalmText}\n\n${url}`;
      if (navigator.share) {
        navigator.share({ title: `Psalm ${psalmNum} — TehilimForAll`, text, url });
      } else {
        navigator.clipboard.writeText(text);
        alert('Psalm text copied!');
      }
    }
  }

  const bg = highContrast ? '#ffffff' : darkMode ? '#1a1008' : '#fdf6ec';
  const surface = highContrast ? '#f5f5f5' : darkMode ? '#2c1e0f' : '#fff8ee';
  const border = highContrast ? '#000000' : darkMode ? '#5c3d1e' : '#e8d5b5';
  const textPrimary = highContrast ? '#000000' : darkMode ? '#f5e9d4' : '#2c1810';
  const textMuted = highContrast ? '#333333' : darkMode ? '#c9a96e' : '#7c6248';
  const hebrewColor = highContrast ? '#00008B' : darkMode ? '#a8c4e0' : '#1a3a5c';
  const englishColor = highContrast ? '#000000' : darkMode ? '#7ec89a' : '#1e4d2b';
  const phoneticsColor = highContrast ? '#8B0000' : darkMode ? '#d4a86a' : '#7a4e1e';
  const goldAccent = highContrast ? '#000000' : '#c9a96e';

  const settingToggle = (active: boolean) => ({
    width: '42px', height: '24px', borderRadius: '12px',
    background: active ? goldAccent : (darkMode ? '#4a3520' : '#ddd'),
    border: 'none', cursor: 'pointer', position: 'relative' as const,
    display: 'flex', alignItems: 'center', padding: '3px',
    justifyContent: active ? 'flex-end' : 'flex-start',
    transition: 'background 0.2s', flexShrink: 0,
  });
  const toggleKnob = { width: '18px', height: '18px', borderRadius: '50%', background: 'white' };

  const hdrBtn = (active = false, activeBg = '') => ({
    background: active ? activeBg : 'none',
    border: `1px solid ${active ? activeBg : border}`,
    borderRadius: '8px', padding: '7px 9px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: active ? 'white' : textMuted,
    transition: 'all 0.2s', flexShrink: 0,
  });

  return (
    <div style={{ minHeight: '100vh', background: bg, color: textPrimary, fontFamily: "var(--font-lora), Georgia, serif", transition: 'background 0.3s' }}>

      {/* Psalm toolbar — sticky below global nav */}
      <div style={{ position: 'sticky', top: '96px', zIndex: 100, background: bg, borderBottom: `1px solid ${border}`, padding: isMobile ? '10px 12px' : '12px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginBottom: isMobile ? '8px' : '0' }}>

          {/* Save/Bookmark dropdown */}
          <div ref={saveRef} style={{ position: 'relative' }}>
            <button onClick={() => setSaveOpen(!saveOpen)} aria-label={isBookmarked ? 'Saved — manage saves' : 'Save psalm'} aria-expanded={saveOpen} style={hdrBtn(isBookmarked, goldAccent)}>
              <IconBookmark filled={isBookmarked} />
            </button>
            {saveOpen && (
              <div style={{ position: 'absolute', top: '44px', right: 0, background: surface, border: `1px solid ${border}`, borderRadius: '12px', padding: '8px', width: '240px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 200 }}>
                <p style={{ fontSize: '11px', fontWeight: '600', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 10px 8px' }}>{t.save.to}</p>

                <button onClick={() => { toggleBookmark(); setSaveOpen(false); }}
                  style={{ width: '100%', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: textPrimary, fontFamily: 'inherit', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconBookmark filled={isBookmarked} />
                    <span>{t.save.bookmarks}</span>
                  </div>
                  {isBookmarked && <span style={{ color: goldAccent }}><IconCheck /></span>}
                </button>

                {lists.length > 0 && <div style={{ height: '1px', background: border, margin: '4px 8px' }} />}

                {lists.map(list => (
                  <button key={list.id} onClick={() => handleToggleInList(list.id)}
                    style={{ width: '100%', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: textPrimary, fontFamily: 'inherit', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{list.name}</span>
                    {list.psalms.includes(psalmNum) && <span style={{ color: goldAccent }}><IconCheck /></span>}
                  </button>
                ))}

                <div style={{ height: '1px', background: border, margin: '4px 8px' }} />
                <button onClick={() => { router.push('/lists'); setSaveOpen(false); }}
                  style={{ width: '100%', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: goldAccent, fontFamily: 'inherit', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconPlus /> {t.save.newList}
                </button>
              </div>
            )}
          </div>

          {/* Share */}
          <div ref={shareRef} style={{ position: 'relative' }}>
            <button onClick={() => setShareOpen(!shareOpen)} aria-label="Share psalm" aria-expanded={shareOpen} style={hdrBtn()}>
              <IconPaperPlane />
            </button>
            {shareOpen && (
              <div style={{ position: 'absolute', top: '44px', right: 0, background: surface, border: `1px solid ${border}`, borderRadius: '12px', padding: '8px', width: '190px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 200 }}>
                <button onClick={() => { handleShare('link'); setShareOpen(false); }}
                  style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: textPrimary, fontFamily: 'inherit', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IconLink /> {t.share.link}
                </button>
                <button onClick={() => { handleShare('text'); setShareOpen(false); }}
                  style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: textPrimary, fontFamily: 'inherit', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IconCopy /> {t.share.text}
                </button>
              </div>
            )}
          </div>

          {/* Feedback */}
          <button onClick={openFeedback} aria-label="Send feedback" style={hdrBtn()}>
            <IconSpeechBubble />
          </button>

          {/* Settings — Hebrew/Phonetics/English only */}
          <div ref={settingsRef} style={{ position: 'relative' }}>
            <button onClick={() => setSettingsOpen(!settingsOpen)} aria-label="Display settings" aria-expanded={settingsOpen} style={hdrBtn(settingsOpen, darkMode ? '#3a2510' : '#f0e4cc')}>
              <IconSettings />
            </button>
            {settingsOpen && (
              <div style={{ position: 'absolute', top: '44px', right: 0, background: surface, border: `1px solid ${border}`, borderRadius: '12px', padding: '20px', width: '220px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 200 }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: textMuted, marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t.settings.title}</p>
                {[
                  { label: t.settings.hebrew, value: showHebrew, set: setShowHebrew },
                  { label: t.settings.english, value: showEnglish, set: setShowEnglish },
                  { label: t.settings.phonetics, value: showPhonetics, set: setShowPhonetics },
                ].map(({ label, value, set }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{ fontSize: '15px', color: textPrimary }}>{label}</span>
                    <button style={settingToggle(value)} onClick={() => set(!value)}>
                      <div style={toggleKnob} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Prev | Psalm dropdown | Next */}
        {!categorySlug && !listId && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <button onClick={() => router.push(`/psalm/${psalmNum - 1}`)} disabled={psalmNum <= 1} aria-label="Previous psalm"
            style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '8px 14px', cursor: psalmNum <= 1 ? 'default' : 'pointer', color: psalmNum <= 1 ? textMuted : textPrimary, fontSize: '16px', opacity: psalmNum <= 1 ? 0.4 : 1 }}>
            ←
          </button>
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button onClick={() => setPsalmDropdownOpen(!psalmDropdownOpen)}
              style={{ background: surface, border: `1px solid ${goldAccent}`, borderRadius: '8px', padding: '8px 20px', cursor: 'pointer', color: textPrimary, fontSize: '15px', fontFamily: 'inherit', fontWeight: '500', minWidth: isMobile ? '160px' : '180px', textAlign: 'center' }}>
              {t.psalm.title} {psalmNum} ▾
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
          <button onClick={() => router.push(`/psalm/${psalmNum + 1}`)} disabled={psalmNum >= 150} aria-label="Next psalm"
            style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '8px 14px', cursor: psalmNum >= 150 ? 'default' : 'pointer', color: psalmNum >= 150 ? textMuted : textPrimary, fontSize: '16px', opacity: psalmNum >= 150 ? 0.4 : 1 }}>
            →
          </button>
        </div>}
      </div>

      {/* Category navigation bar */}
      {categorySlug && categoryData && (
        <div style={{ padding: isMobile ? '8px 12px' : '10px 24px', borderBottom: `1px solid ${border}`, display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', gap: '6px', background: surface }}>
          <button onClick={() => router.push(`/category/${categorySlug}`)}
            style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '0 14px', height: '44px', cursor: 'pointer', color: textPrimary, fontFamily: 'inherit', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' as const }}>
            ← {categoryData.title}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: isMobile ? 'space-between' : 'flex-end' }}>
            <button
              onClick={() => prevCategoryPsalm && router.push(`/psalm/${prevCategoryPsalm}?category=${categorySlug}`)}
              disabled={!prevCategoryPsalm}
              style={{ background: prevCategoryPsalm ? goldAccent : 'none', border: `1px solid ${prevCategoryPsalm ? goldAccent : border}`, borderRadius: '8px', padding: '0 14px', height: '44px', cursor: prevCategoryPsalm ? 'pointer' : 'default', color: prevCategoryPsalm ? 'white' : textMuted, fontFamily: 'inherit', fontSize: '13px', opacity: prevCategoryPsalm ? 1 : 0.4, flex: isMobile ? 1 : 'none' }}>
              {t.categories.prevInCategory}
            </button>
            {categoryIndex >= 0 && (
              <span style={{ color: textMuted, fontSize: '13px', whiteSpace: 'nowrap', fontWeight: '500', flexShrink: 0 }}>
                {categoryIndex + 1} / {categoryData.psalms.length}
              </span>
            )}
            <button
              onClick={() => nextCategoryPsalm && router.push(`/psalm/${nextCategoryPsalm}?category=${categorySlug}`)}
              disabled={!nextCategoryPsalm}
              style={{ background: nextCategoryPsalm ? goldAccent : 'none', border: `1px solid ${nextCategoryPsalm ? goldAccent : border}`, borderRadius: '8px', padding: '0 14px', height: '44px', cursor: nextCategoryPsalm ? 'pointer' : 'default', color: nextCategoryPsalm ? 'white' : textMuted, fontFamily: 'inherit', fontSize: '13px', opacity: nextCategoryPsalm ? 1 : 0.4, flex: isMobile ? 1 : 'none' }}>
              {t.categories.nextInCategory}
            </button>
          </div>
        </div>
      )}

      {/* List navigation bar */}
      {listId && listNavData && (() => {
        const listIndex = listNavData.psalms.indexOf(psalmNum);
        const prevListPsalm = listIndex > 0 ? listNavData.psalms[listIndex - 1] : null;
        const nextListPsalm = listIndex !== -1 && listIndex < listNavData.psalms.length - 1 ? listNavData.psalms[listIndex + 1] : null;
        return (
          <div style={{ padding: isMobile ? '8px 12px' : '10px 24px', borderBottom: `1px solid ${border}`, display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', gap: '6px', background: surface }}>
            <button onClick={() => router.push(`/list/${listId}`)}
              style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '0 14px', height: '44px', cursor: 'pointer', color: textPrimary, fontFamily: 'inherit', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' as const }}>
              ← {listNavData.name}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: isMobile ? 'space-between' : 'flex-end' }}>
              <button
                onClick={() => prevListPsalm && router.push(`/psalm/${prevListPsalm}?list=${listId}`)}
                disabled={!prevListPsalm}
                style={{ background: prevListPsalm ? goldAccent : 'none', border: `1px solid ${prevListPsalm ? goldAccent : border}`, borderRadius: '8px', padding: '0 14px', height: '44px', cursor: prevListPsalm ? 'pointer' : 'default', color: prevListPsalm ? 'white' : textMuted, fontFamily: 'inherit', fontSize: '13px', opacity: prevListPsalm ? 1 : 0.4, flex: isMobile ? 1 : 'none' }}>
                {t.categories.prevInList}
              </button>
              {listIndex >= 0 && (
                <span style={{ color: textMuted, fontSize: '13px', whiteSpace: 'nowrap', fontWeight: '500', flexShrink: 0 }}>
                  {listIndex + 1} / {listNavData.psalms.length}
                </span>
              )}
              <button
                onClick={() => nextListPsalm && router.push(`/psalm/${nextListPsalm}?list=${listId}`)}
                disabled={!nextListPsalm}
                style={{ background: nextListPsalm ? goldAccent : 'none', border: `1px solid ${nextListPsalm ? goldAccent : border}`, borderRadius: '8px', padding: '0 14px', height: '44px', cursor: nextListPsalm ? 'pointer' : 'default', color: nextListPsalm ? 'white' : textMuted, fontFamily: 'inherit', fontSize: '13px', opacity: nextListPsalm ? 1 : 0.4, flex: isMobile ? 1 : 'none' }}>
                {t.categories.nextInList}
              </button>
            </div>
          </div>
        );
      })()}

      {/* Psalm title */}
      <div style={{ textAlign: 'center', padding: isMobile ? '28px 16px 16px' : '40px 24px 24px' }}>
        <p style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '8px' }}>תהילים</p>
        <h1 style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: '400', color: textPrimary }}>{t.psalm.title} {psalmNum}</h1>
        <p dir="rtl" style={{ fontSize: '14px', color: textMuted, marginTop: '4px' }}>({PSALM_HEBREW[psalmNum]})</p>
        <div style={{ width: '48px', height: '2px', background: goldAccent, margin: '12px auto 0' }} />
      </div>

      {/* Verses */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: isMobile ? '0 16px 60px' : '0 24px 80px' }}>
        {hebrew.length === 0 ? (
          <p style={{ textAlign: 'center', color: textMuted, padding: '60px 0' }}>{t.psalm.loading}</p>
        ) : (
          hebrew.map((verse, i) => (
            <div key={i} style={{ marginBottom: '28px', paddingBottom: '28px', borderBottom: highContrast ? `2px solid #000000` : `1px solid ${border}` }}>
              {showHebrew && (
                <p dir="rtl" style={{ fontSize: fontSizeMap[fontSize].hebrew, fontFamily: "var(--font-frank-ruhl-libre), serif", lineHeight: '2', marginBottom: '10px', color: hebrewColor }}
                  dangerouslySetInnerHTML={{ __html: verse }} />
              )}
              {showPhonetics && !!transliterations[psalmNum.toString()]?.[i] && (
                <p style={{ fontSize: fontSizeMap[fontSize].english, fontStyle: 'italic', marginBottom: '8px', color: phoneticsColor, lineHeight: '1.7' }}>
                  {transliterations[psalmNum.toString()][i]}
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

      {/* Feedback modal */}
      {feedbackOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '380px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            {!feedbackSent ? (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px', color: textPrimary, fontFamily: "var(--font-lora), Georgia, serif" }}>{t.feedback.title}</h3>
                <textarea value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)}
                  placeholder={t.feedback.messagePlaceholder} rows={4}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${border}`, background: bg, color: textPrimary, fontSize: '14px', fontFamily: "var(--font-lora), Georgia, serif", boxSizing: 'border-box' as const, resize: 'none', outline: 'none', marginBottom: '10px' }} />
                <input type="email" value={feedbackEmail} onChange={e => setFeedbackEmail(e.target.value)}
                  placeholder={t.feedback.emailPlaceholder}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${border}`, background: bg, color: textPrimary, fontSize: '14px', fontFamily: "var(--font-lora), Georgia, serif", boxSizing: 'border-box' as const, outline: 'none', marginBottom: '14px' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleFeedback} disabled={feedbackSending || !feedbackMessage.trim()}
                    style={{ flex: 1, padding: '10px', background: goldAccent, border: 'none', borderRadius: '8px', cursor: feedbackSending || !feedbackMessage.trim() ? 'default' : 'pointer', fontSize: '14px', color: 'white', fontFamily: 'inherit', opacity: feedbackSending || !feedbackMessage.trim() ? 0.6 : 1 }}>
                    {feedbackSending ? t.feedback.sending : t.feedback.send}
                  </button>
                  <button onClick={closeFeedback}
                    style={{ padding: '10px 14px', background: 'none', border: `1px solid ${border}`, borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: textPrimary, fontFamily: 'inherit' }}>
                    {t.feedback.close}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p style={{ fontSize: '16px', color: textPrimary, marginBottom: '20px', textAlign: 'center', fontFamily: "var(--font-lora), Georgia, serif" }}>✓ {t.feedback.success}</p>
                <button onClick={closeFeedback}
                  style={{ width: '100%', padding: '10px', background: goldAccent, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: 'white', fontFamily: 'inherit' }}>
                  {t.feedback.close}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Sync toast */}
      {showSyncToast && (
        <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: darkMode ? '#3a2510' : '#2c1810', color: '#f5e9d4', borderRadius: '24px', padding: '12px 20px', fontSize: '13px', zIndex: 500, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>
          Saved locally. Sign in to sync across devices.
        </div>
      )}
    </div>
  );
}
