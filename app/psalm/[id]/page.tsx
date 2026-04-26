'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Logo from '../../components/Logo';
import { getLists, createList, deleteList, addPsalmToList, removePsalmFromList, encodeListForSharing, PsalmList } from '../../lib/lists';

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

const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
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
const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
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
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [psalmDropdownOpen, setPsalmDropdownOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'bookmarks' | 'lists' | 'collective'>('bookmarks');
  const [lists, setLists] = useState<PsalmList[]>([]);
  const [creatingList, setCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  const settingsRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const saveRef = useRef<HTMLDivElement>(null);
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
    const bm = getSet('bookmarks');
    setIsBookmarked(bm.includes(psalmNum));
    setBookmarks(bm);
    setLists(getLists());
  }, [id]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setPsalmDropdownOpen(false);
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) setShareOpen(false);
      if (saveRef.current && !saveRef.current.contains(e.target as Node)) { setSaveOpen(false); setCreatingList(false); }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function toggleBookmark() {
    const arr = getSet('bookmarks');
    const updated = arr.includes(psalmNum) ? arr.filter(n => n !== psalmNum) : [...arr, psalmNum];
    saveSet('bookmarks', updated);
    setIsBookmarked(!isBookmarked);
    setBookmarks(updated);
  }

  function handleCreateList() {
    if (!newListName.trim()) return;
    createList(newListName.trim(), newListDesc.trim());
    setLists(getLists());
    setNewListName('');
    setNewListDesc('');
    setCreatingList(false);
  }

  function handleDeleteList(listId: string) {
    deleteList(listId);
    setLists(getLists());
  }

  function handleToggleInList(listId: string) {
    const list = lists.find(l => l.id === listId);
    if (!list) return;
    if (list.psalms.includes(psalmNum)) {
      removePsalmFromList(listId, psalmNum);
    } else {
      addPsalmToList(listId, psalmNum);
    }
    setLists(getLists());
  }

  function handleShareList(list: PsalmList) {
    const encoded = encodeListForSharing(list);
    const url = `https://tehilimforall.com/list/${encoded}`;
    if (navigator.share) {
      navigator.share({ title: `${list.name} — TehilimForAll`, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('List link copied!');
    }
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

  const hdrBtn = (active = false, activeBg = '') => ({
    background: active ? activeBg : 'none',
    border: `1px solid ${active ? activeBg : border}`,
    borderRadius: '8px', padding: '7px 9px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: active ? 'white' : textMuted,
    transition: 'all 0.2s', flexShrink: 0,
  });

  return (
    <div style={{ minHeight: '100vh', background: bg, color: textPrimary, fontFamily: "'Lora', Georgia, serif", transition: 'background 0.3s' }}>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300 }} />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, height: '100vh', width: '300px',
        background: surface, borderRight: `1px solid ${border}`,
        zIndex: 400, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo size={28} />
            <span style={{ fontSize: '15px', fontWeight: '500', color: textPrimary }}>TehilimForAll</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: textMuted, padding: '4px' }}>
            <IconClose />
          </button>
        </div>

        <div style={{ display: 'flex', borderBottom: `1px solid ${border}` }}>
          {(['bookmarks', 'lists', 'collective'] as const).map(tab => (
            <button key={tab} onClick={() => setSidebarTab(tab)}
              style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: sidebarTab === tab ? `2px solid ${goldAccent}` : '2px solid transparent', cursor: 'pointer', fontSize: '13px', fontWeight: sidebarTab === tab ? '600' : '400', color: sidebarTab === tab ? textPrimary : textMuted, fontFamily: 'inherit', textTransform: 'capitalize' }}>
              {tab}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {sidebarTab === 'bookmarks' && (
            <>
              <p style={{ fontSize: '12px', fontWeight: '600', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Bookmarks</p>
              {bookmarks.length === 0 ? (
                <p style={{ fontSize: '14px', color: textMuted, fontStyle: 'italic' }}>No bookmarks yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {bookmarks.sort((a, b) => a - b).map(num => (
                    <button key={num} onClick={() => { router.push(`/psalm/${num}`); setSidebarOpen(false); }}
                      style={{ background: num === psalmNum ? goldAccent : 'transparent', border: `1px solid ${num === psalmNum ? goldAccent : border}`, borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: num === psalmNum ? 'white' : textPrimary, fontFamily: 'inherit' }}>
                      Psalm {num}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {sidebarTab === 'lists' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>My Lists</p>
                <button onClick={() => setCreatingList(true)}
                  style={{ background: goldAccent, border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px', color: 'white', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IconPlus /> New List
                </button>
              </div>

              {creatingList && (
                <div style={{ background: darkMode ? '#3a2510' : '#fef9f0', border: `1px solid ${border}`, borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
                  <p style={{ fontSize: '13px', color: textPrimary, marginBottom: '8px', fontWeight: '500' }}>New List</p>
                  <input value={newListName} onChange={e => setNewListName(e.target.value)}
                    placeholder="List name..." onKeyDown={e => { if (e.key === 'Enter') handleCreateList(); }}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${border}`, background: surface, color: textPrimary, fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' as const, marginBottom: '8px', outline: 'none' }} />
                  <textarea value={newListDesc} onChange={e => setNewListDesc(e.target.value)}
                    placeholder="Description (optional)..." rows={2}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${border}`, background: surface, color: textPrimary, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box' as const, marginBottom: '8px', outline: 'none', resize: 'none' }} />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={handleCreateList}
                      style={{ flex: 1, padding: '7px', background: goldAccent, border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: 'white', fontFamily: 'inherit' }}>
                      Create
                    </button>
                    <button onClick={() => { setCreatingList(false); setNewListName(''); setNewListDesc(''); }}
                      style={{ flex: 1, padding: '7px', background: 'none', border: `1px solid ${border}`, borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: textPrimary, fontFamily: 'inherit' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {lists.length === 0 && !creatingList ? (
                <p style={{ fontSize: '14px', color: textMuted, fontStyle: 'italic' }}>No lists yet. Create one!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {lists.map(list => (
                    <div key={list.id} style={{ border: `1px solid ${border}`, borderRadius: '10px', overflow: 'hidden' }}>
                      <button onClick={() => { router.push(`/list/${list.id}`); setSidebarOpen(false); }}
                        style={{ width: '100%', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                        <div>
                          <p style={{ fontSize: '14px', color: textPrimary, fontWeight: '500', marginBottom: '2px', fontFamily: 'inherit' }}>{list.name}</p>
                          {list.description && <p style={{ fontSize: '12px', color: textMuted, fontStyle: 'italic', marginBottom: '2px', fontFamily: 'inherit' }}>{list.description}</p>}
                          <p style={{ fontSize: '12px', color: textMuted, fontFamily: 'inherit' }}>{list.psalms.length} psalm{list.psalms.length !== 1 ? 's' : ''}</p>
                        </div>
                        <span style={{ color: textMuted, fontSize: '16px' }}>›</span>
                      </button>
                      <div style={{ borderTop: `1px solid ${border}`, padding: '8px 14px', background: darkMode ? '#2a1a0a' : '#faf4ea', display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleToggleInList(list.id)}
                          style={{ flex: 1, padding: '6px', background: list.psalms.includes(psalmNum) ? 'none' : goldAccent, border: `1px solid ${list.psalms.includes(psalmNum) ? border : goldAccent}`, borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: list.psalms.includes(psalmNum) ? textMuted : 'white', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          {list.psalms.includes(psalmNum) ? <><IconCheck /> Remove</> : <><IconPlus /> Add Psalm {psalmNum}</>}
                        </button>
                        <button onClick={() => handleShareList(list)}
                          style={{ padding: '6px 10px', background: 'none', border: `1px solid ${border}`, borderRadius: '6px', cursor: 'pointer', color: textMuted }}>
                          <IconPaperPlane />
                        </button>
                        <button onClick={() => handleDeleteList(list.id)}
                          style={{ padding: '6px 10px', background: 'none', border: `1px solid ${border}`, borderRadius: '6px', cursor: 'pointer', color: textMuted }}>
                          <IconClose />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        {sidebarTab === 'collective' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Collective Reading</p>
              </div>
              <p style={{ fontSize: '13px', color: textMuted, marginBottom: '16px', lineHeight: '1.6' }}>
                Join others in reading all 150 psalms together.
              </p>
              <button onClick={() => { router.push('/collective/new'); setSidebarOpen(false); }}
                style={{ width: '100%', padding: '12px', background: goldAccent, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: 'white', fontFamily: 'inherit', marginBottom: '10px' }}>
                + Create Collective Reading
              </button>
              <p style={{ fontSize: '12px', color: textMuted, textAlign: 'center', fontStyle: 'italic' }}>
                Share the link with others so they can claim psalms.
              </p>
            </>
          )}
        </div>

        <div style={{ padding: '16px 20px', borderTop: `1px solid ${border}` }}>
          <button onClick={() => { router.push('/'); setSidebarOpen(false); }}
            style={{ width: '100%', padding: '10px', background: 'none', border: `1px solid ${border}`, borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: textPrimary, fontFamily: 'inherit' }}>
            ← All Psalms
          </button>
        </div>
      </div>

      {/* Top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: bg, borderBottom: `1px solid ${border}`, padding: isMobile ? '10px 12px' : '12px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? '8px' : '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => setSidebarOpen(true)} style={{ ...hdrBtn(), padding: '7px 9px' }}>
              <IconMenu />
            </button>
            <Logo size={28} />
            {!isMobile && (
              <button onClick={() => router.push('/')}
                style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: textPrimary, fontSize: '13px', fontFamily: 'inherit' }}>
                ← All Psalms
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

            {/* Save/Bookmark dropdown */}
            <div ref={saveRef} style={{ position: 'relative' }}>
              <button onClick={() => setSaveOpen(!saveOpen)} style={hdrBtn(isBookmarked, goldAccent)} title="Save">
                <IconBookmark filled={isBookmarked} />
              </button>
              {saveOpen && (
                <div style={{ position: 'absolute', top: '44px', right: 0, background: surface, border: `1px solid ${border}`, borderRadius: '12px', padding: '8px', width: '240px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 200 }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 10px 8px' }}>Save to</p>

                  {/* Bookmarks */}
                  <button onClick={() => { toggleBookmark(); setSaveOpen(false); }}
                    style={{ width: '100%', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: textPrimary, fontFamily: 'inherit', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <IconBookmark filled={isBookmarked} />
                      <span>Bookmarks</span>
                    </div>
                    {isBookmarked && <span style={{ color: goldAccent }}><IconCheck /></span>}
                  </button>

                  {lists.length > 0 && <div style={{ height: '1px', background: border, margin: '4px 8px' }} />}

                  {/* Lists */}
                  {lists.map(list => (
                    <button key={list.id} onClick={() => handleToggleInList(list.id)}
                      style={{ width: '100%', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: textPrimary, fontFamily: 'inherit', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{list.name}</span>
                      {list.psalms.includes(psalmNum) && <span style={{ color: goldAccent }}><IconCheck /></span>}
                    </button>
                  ))}

                  <div style={{ height: '1px', background: border, margin: '4px 8px' }} />
                  <button onClick={() => { setSidebarOpen(true); setSidebarTab('lists'); setCreatingList(true); setSaveOpen(false); }}
                    style={{ width: '100%', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: goldAccent, fontFamily: 'inherit', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconPlus /> New list
                  </button>
                </div>
              )}
            </div>

            {/* Share */}
            <div ref={shareRef} style={{ position: 'relative' }}>
              <button onClick={() => setShareOpen(!shareOpen)} style={hdrBtn()} title="Share">
                <IconPaperPlane />
              </button>
              {shareOpen && (
                <div style={{ position: 'absolute', top: '44px', right: 0, background: surface, border: `1px solid ${border}`, borderRadius: '12px', padding: '8px', width: '190px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 200 }}>
                  <button onClick={() => { handleShare('link'); setShareOpen(false); }}
                    style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: textPrimary, fontFamily: 'inherit', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconLink /> Share link
                  </button>
                  <button onClick={() => { handleShare('text'); setShareOpen(false); }}
                    style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: textPrimary, fontFamily: 'inherit', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconCopy /> Share with text
                  </button>
                </div>
              )}
            </div>

            {/* Settings */}
            <div ref={settingsRef} style={{ position: 'relative' }}>
              <button onClick={() => setSettingsOpen(!settingsOpen)} style={hdrBtn(settingsOpen, darkMode ? '#3a2510' : '#f0e4cc')} title="Settings">
                <IconSettings />
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

        {/* Row 2: Prev | Psalm dropdown | Next */}
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