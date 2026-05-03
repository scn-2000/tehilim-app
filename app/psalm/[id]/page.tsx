'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Logo from '../../components/Logo';
import { getCategoryBySlug } from '../../lib/categories';
import { getLists, createList, deleteList, addPsalmToList, removePsalmFromList, encodeListForSharing, decodeSharedList, PsalmList } from '../../lib/lists';
import { getUser, addBookmarkToCloud, removeBookmarkFromCloud } from '../../lib/auth';
import { useTranslations } from '../../lib/i18n';
import LanguageSelector from '../../components/LanguageSelector';

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
  const [hebrew, setHebrew] = useState<string[]>([]);
  const [english, setEnglish] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const [showHebrew, setShowHebrew] = usePersistentState('pref_hebrew', true);
  const [showEnglish, setShowEnglish] = usePersistentState('pref_english', false);
  const [showPhonetics, setShowPhonetics] = usePersistentState('pref_phonetics', true);
  const [fontSize, setFontSize] = usePersistentState('pref_fontsize', 'medium');
  const [darkMode, setDarkMode] = usePersistentState('pref_darkmode', false);
  const [highContrast, setHighContrast] = usePersistentState('pref_highcontrast', false);
  const { t } = useTranslations();

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
  const [myCollectives, setMyCollectives] = useState<{id: string; name: string; role: string}[]>([]);
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
    setBookmarks(bm);
    setLists(getLists());
    setMyCollectives(JSON.parse(localStorage.getItem('my_collectives') || '[]'));
    getUser().then(u => setUserId(u?.id ?? null));
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
    setBookmarks(updated);
    if (userId) {
      if (adding) addBookmarkToCloud(userId, psalmNum);
      else removeBookmarkFromCloud(userId, psalmNum);
    } else if (adding) {
      triggerSyncToast();
    }
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

  const bg = highContrast ? '#ffffff' : darkMode ? '#1a1008' : '#fdf6ec';
  const surface = highContrast ? '#f5f5f5' : darkMode ? '#2c1e0f' : '#fff8ee';
  const border = highContrast ? '#000000' : darkMode ? '#5c3d1e' : '#e8d5b5';
  const textPrimary = highContrast ? '#000000' : darkMode ? '#f5e9d4' : '#2c1810';
  const textMuted = highContrast ? '#333333' : darkMode ? '#c9a96e' : '#9a7a5a';
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
    <div style={{ minHeight: '100vh', background: bg, color: textPrimary, fontFamily: "'Lora', Georgia, serif", transition: 'background 0.3s' }}>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300 }} />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, height: '100vh', width: 'min(300px, 85vw)',
        background: surface, borderRight: `1px solid ${border}`,
        zIndex: 400, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => { router.push('/'); setSidebarOpen(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <Logo size={28} />
            </button>
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
              <p style={{ fontSize: '12px', fontWeight: '600', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>{t.sidebar.bookmarksTab}</p>
              {bookmarks.length === 0 ? (
                <p style={{ fontSize: '14px', color: textMuted, fontStyle: 'italic' }}>{t.sidebar.noBookmarks}</p>
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
                <p style={{ fontSize: '12px', fontWeight: '600', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.sidebar.myLists}</p>
                <button onClick={() => setCreatingList(true)}
                  style={{ background: goldAccent, border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px', color: 'white', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IconPlus /> {t.sidebar.newList}
                </button>
              </div>

              {creatingList && (
                <div style={{ background: darkMode ? '#3a2510' : '#fef9f0', border: `1px solid ${border}`, borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
                  <p style={{ fontSize: '13px', color: textPrimary, marginBottom: '8px', fontWeight: '500' }}>{t.sidebar.newListTitle}</p>
                  <input value={newListName} onChange={e => setNewListName(e.target.value)}
                    placeholder={t.sidebar.listNamePlaceholder} onKeyDown={e => { if (e.key === 'Enter') handleCreateList(); }}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${border}`, background: surface, color: textPrimary, fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' as const, marginBottom: '8px', outline: 'none' }} />
                  <textarea value={newListDesc} onChange={e => setNewListDesc(e.target.value)}
                    placeholder={t.sidebar.descPlaceholder} rows={2}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${border}`, background: surface, color: textPrimary, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box' as const, marginBottom: '8px', outline: 'none', resize: 'none' }} />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={handleCreateList}
                      style={{ flex: 1, padding: '7px', background: goldAccent, border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: 'white', fontFamily: 'inherit' }}>
                      {t.sidebar.create}
                    </button>
                    <button onClick={() => { setCreatingList(false); setNewListName(''); setNewListDesc(''); }}
                      style={{ flex: 1, padding: '7px', background: 'none', border: `1px solid ${border}`, borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: textPrimary, fontFamily: 'inherit' }}>
                      {t.sidebar.cancel}
                    </button>
                  </div>
                </div>
              )}

              {lists.length === 0 && !creatingList ? (
                <p style={{ fontSize: '14px', color: textMuted, fontStyle: 'italic' }}>{t.sidebar.noLists}</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {lists.map(list => (
                    <div key={list.id} style={{ border: `1px solid ${border}`, borderRadius: '10px', overflow: 'hidden' }}>
                      <button onClick={() => { router.push(`/list/${list.id}`); setSidebarOpen(false); }}
                        style={{ width: '100%', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                        <div>
                          <p style={{ fontSize: '14px', color: textPrimary, fontWeight: '500', marginBottom: '2px', fontFamily: 'inherit' }}>{list.name}</p>
                          {list.description && <p style={{ fontSize: '12px', color: textMuted, fontStyle: 'italic', marginBottom: '2px', fontFamily: 'inherit' }}>{list.description}</p>}
                          <p style={{ fontSize: '12px', color: textMuted, fontFamily: 'inherit' }}>{list.psalms.length} {list.psalms.length !== 1 ? t.sidebar.psalms : t.sidebar.psalm}</p>
                        </div>
                        <span style={{ color: textMuted, fontSize: '16px' }}>›</span>
                      </button>
                      <div style={{ borderTop: `1px solid ${border}`, padding: '8px 14px', background: darkMode ? '#2a1a0a' : '#faf4ea', display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleToggleInList(list.id)}
                          style={{ flex: 1, padding: '6px', background: list.psalms.includes(psalmNum) ? 'none' : goldAccent, border: `1px solid ${list.psalms.includes(psalmNum) ? border : goldAccent}`, borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: list.psalms.includes(psalmNum) ? textMuted : 'white', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          {list.psalms.includes(psalmNum) ? <><IconCheck /> {t.sidebar.remove}</> : <><IconPlus /> {t.sidebar.addPsalm} {psalmNum}</>}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.sidebar.collectiveReading}</p>
                <button onClick={() => { router.push('/collective/new'); setSidebarOpen(false); }}
                  style={{ background: goldAccent, border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px', color: 'white', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IconPlus /> {t.sidebar.new}
                </button>
              </div>

              {myCollectives.length === 0 ? (
                <p style={{ fontSize: '14px', color: textMuted, fontStyle: 'italic', marginBottom: '16px' }}>{t.sidebar.noCollectives}</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {myCollectives.map((c: {id: string; name: string; role: string}) => (
                    <button key={c.id} onClick={() => { router.push(`/collective/${c.id}`); setSidebarOpen(false); }}
                      style={{ padding: '10px 14px', background: 'transparent', border: `1px solid ${border}`, borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: '14px', color: textPrimary, fontWeight: '500', marginBottom: '2px' }}>{c.name}</p>
                        <p style={{ fontSize: '11px', color: textMuted, textTransform: 'capitalize' }}>{c.role}</p>
                      </div>
                      <span style={{ color: textMuted }}>›</span>
                    </button>
                  ))}
                </div>
              )}

              <p style={{ fontSize: '12px', color: textMuted, fontStyle: 'italic' }}>
                Join others in reading all 150 psalms together.
              </p>
            </>
          )}
        </div>

        <div style={{ padding: '16px 20px', borderTop: `1px solid ${border}` }}>
          <button onClick={() => { router.push('/'); setSidebarOpen(false); }}
            style={{ width: '100%', padding: '10px', background: 'none', border: `1px solid ${border}`, borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: textPrimary, fontFamily: 'inherit' }}>
            {t.sidebar.allPsalms}
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
            <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <Logo size={28} />
            </button>
            {!isMobile && (
              <button onClick={() => router.push('/')}
                style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: textPrimary, fontSize: '13px', fontFamily: 'inherit' }}>
                {t.allPsalms}
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

            <LanguageSelector border={border} surface={surface} textPrimary={textPrimary} textMuted={textMuted} />

            {/* Save/Bookmark dropdown */}
            <div ref={saveRef} style={{ position: 'relative' }}>
              <button onClick={() => setSaveOpen(!saveOpen)} style={hdrBtn(isBookmarked, goldAccent)} title="Save">
                <IconBookmark filled={isBookmarked} />
              </button>
              {saveOpen && (
                <div style={{ position: 'absolute', top: '44px', right: 0, background: surface, border: `1px solid ${border}`, borderRadius: '12px', padding: '8px', width: '240px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 200 }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 10px 8px' }}>{t.save.to}</p>

                  {/* Bookmarks */}
                  <button onClick={() => { toggleBookmark(); setSaveOpen(false); }}
                    style={{ width: '100%', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: textPrimary, fontFamily: 'inherit', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <IconBookmark filled={isBookmarked} />
                      <span>{t.save.bookmarks}</span>
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
                    <IconPlus /> {t.save.newList}
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
            <button onClick={openFeedback} style={hdrBtn()} title="Feedback">
              <IconSpeechBubble />
            </button>

            {/* Settings */}
            <div ref={settingsRef} style={{ position: 'relative' }}>
              <button onClick={() => setSettingsOpen(!settingsOpen)} style={hdrBtn(settingsOpen, darkMode ? '#3a2510' : '#f0e4cc')} title="Settings">
                <IconSettings />
              </button>
              {settingsOpen && (
                <div style={{ position: 'absolute', top: '44px', right: 0, background: surface, border: `1px solid ${border}`, borderRadius: '12px', padding: '20px', width: '260px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 200 }}>
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
                  <div style={{ borderTop: `1px solid ${border}`, margin: '16px 0' }} />
                  <p style={{ fontSize: '13px', color: textMuted, marginBottom: '10px' }}>{t.settings.fontSize}</p>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    {(['small', 'medium', 'large'] as const).map(size => (
                      <button key={size} onClick={() => setFontSize(size)}
                        style={{ flex: 1, padding: '6px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', border: `1px solid ${fontSize === size ? goldAccent : border}`, background: fontSize === size ? goldAccent : 'transparent', color: fontSize === size ? 'white' : textPrimary }}>
                        {{ small: t.settings.small, medium: t.settings.medium, large: t.settings.large }[size]}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{ fontSize: '15px', color: textPrimary }}>{t.settings.darkMode}</span>
                    <button style={settingToggle(darkMode)} onClick={() => { setDarkMode(!darkMode); if (!darkMode) setHighContrast(false); }}>
                      <div style={toggleKnob} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div>
                      <span style={{ fontSize: '15px', color: textPrimary }}>{t.settings.highContrast}</span>
                      <p style={{ fontSize: '11px', color: textMuted, marginTop: '2px' }}>{t.settings.accessibility}</p>
                    </div>
                    <button style={settingToggle(highContrast)} onClick={() => { setHighContrast(!highContrast); if (!highContrast) setDarkMode(false); }}>
                      <div style={toggleKnob} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Prev | Psalm dropdown | Next — hidden when browsing a category or list */}
        {!categorySlug && !listId && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <button onClick={() => router.push(`/psalm/${psalmNum - 1}`)} disabled={psalmNum <= 1}
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
          <button onClick={() => router.push(`/psalm/${psalmNum + 1}`)} disabled={psalmNum >= 150}
            style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '8px 14px', cursor: psalmNum >= 150 ? 'default' : 'pointer', color: psalmNum >= 150 ? textMuted : textPrimary, fontSize: '16px', opacity: psalmNum >= 150 ? 0.4 : 1 }}>
            →
          </button>
        </div>}
      </div>

      {/* Category navigation bar */}
      {categorySlug && categoryData && (
        <div style={{ padding: isMobile ? '10px 12px' : '12px 24px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', background: surface }}>
          <button onClick={() => router.push(`/category/${categorySlug}`)}
            style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', color: textPrimary, fontFamily: 'inherit', fontSize: isMobile ? '13px' : '14px', maxWidth: isMobile ? '140px' : '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            ← {categoryData.title}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => prevCategoryPsalm && router.push(`/psalm/${prevCategoryPsalm}?category=${categorySlug}`)}
              disabled={!prevCategoryPsalm}
              style={{ background: prevCategoryPsalm ? goldAccent : 'none', border: `1px solid ${prevCategoryPsalm ? goldAccent : border}`, borderRadius: '8px', padding: '8px 14px', cursor: prevCategoryPsalm ? 'pointer' : 'default', color: prevCategoryPsalm ? 'white' : textMuted, fontFamily: 'inherit', fontSize: isMobile ? '13px' : '14px', opacity: prevCategoryPsalm ? 1 : 0.4 }}>
              {t.categories.prevInCategory}
            </button>
            {categoryIndex >= 0 && (
              <span style={{ color: textMuted, fontSize: '13px', whiteSpace: 'nowrap', fontWeight: '500' }}>
                {categoryIndex + 1} / {categoryData.psalms.length}
              </span>
            )}
            <button
              onClick={() => nextCategoryPsalm && router.push(`/psalm/${nextCategoryPsalm}?category=${categorySlug}`)}
              disabled={!nextCategoryPsalm}
              style={{ background: nextCategoryPsalm ? goldAccent : 'none', border: `1px solid ${nextCategoryPsalm ? goldAccent : border}`, borderRadius: '8px', padding: '8px 14px', cursor: nextCategoryPsalm ? 'pointer' : 'default', color: nextCategoryPsalm ? 'white' : textMuted, fontFamily: 'inherit', fontSize: isMobile ? '13px' : '14px', opacity: nextCategoryPsalm ? 1 : 0.4 }}>
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
          <div style={{ padding: isMobile ? '10px 12px' : '12px 24px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', background: surface }}>
            <button onClick={() => router.push(`/list/${listId}`)}
              style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', color: textPrimary, fontFamily: 'inherit', fontSize: isMobile ? '13px' : '14px', maxWidth: isMobile ? '140px' : '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              ← {listNavData.name}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => prevListPsalm && router.push(`/psalm/${prevListPsalm}?list=${listId}`)}
                disabled={!prevListPsalm}
                style={{ background: prevListPsalm ? goldAccent : 'none', border: `1px solid ${prevListPsalm ? goldAccent : border}`, borderRadius: '8px', padding: '8px 14px', cursor: prevListPsalm ? 'pointer' : 'default', color: prevListPsalm ? 'white' : textMuted, fontFamily: 'inherit', fontSize: isMobile ? '13px' : '14px', opacity: prevListPsalm ? 1 : 0.4 }}>
                {t.categories.prevInList}
              </button>
              {listIndex >= 0 && (
                <span style={{ color: textMuted, fontSize: '13px', whiteSpace: 'nowrap', fontWeight: '500' }}>
                  {listIndex + 1} / {listNavData.psalms.length}
                </span>
              )}
              <button
                onClick={() => nextListPsalm && router.push(`/psalm/${nextListPsalm}?list=${listId}`)}
                disabled={!nextListPsalm}
                style={{ background: nextListPsalm ? goldAccent : 'none', border: `1px solid ${nextListPsalm ? goldAccent : border}`, borderRadius: '8px', padding: '8px 14px', cursor: nextListPsalm ? 'pointer' : 'default', color: nextListPsalm ? 'white' : textMuted, fontFamily: 'inherit', fontSize: isMobile ? '13px' : '14px', opacity: nextListPsalm ? 1 : 0.4 }}>
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
                <p dir="rtl" style={{ fontSize: fontSizeMap[fontSize].hebrew, fontFamily: "'Frank Ruhl Libre', serif", lineHeight: '2', marginBottom: '10px', color: hebrewColor }}
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
                <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px', color: textPrimary, fontFamily: "'Lora', Georgia, serif" }}>{t.feedback.title}</h3>
                <textarea value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)}
                  placeholder={t.feedback.messagePlaceholder} rows={4}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${border}`, background: bg, color: textPrimary, fontSize: '14px', fontFamily: "'Lora', Georgia, serif", boxSizing: 'border-box' as const, resize: 'none', outline: 'none', marginBottom: '10px' }} />
                <input type="email" value={feedbackEmail} onChange={e => setFeedbackEmail(e.target.value)}
                  placeholder={t.feedback.emailPlaceholder}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${border}`, background: bg, color: textPrimary, fontSize: '14px', fontFamily: "'Lora', Georgia, serif", boxSizing: 'border-box' as const, outline: 'none', marginBottom: '14px' }} />
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
                <p style={{ fontSize: '16px', color: textPrimary, marginBottom: '20px', textAlign: 'center', fontFamily: "'Lora', Georgia, serif" }}>✓ {t.feedback.success}</p>
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