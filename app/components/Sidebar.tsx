'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from './Logo';
import { getLists, createList, deleteList, PsalmList, encodeListForSharing } from '../lib/lists';
import { supabase } from '../lib/supabase';
import { getUser, signOut, syncBookmarksToCloud, loadBookmarksFromCloud, syncListsToCloud, loadListsFromCloud } from '../lib/auth';

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconPaperPlane = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  psalmNum?: number;
}

export default function Sidebar({ isOpen, onClose, darkMode, psalmNum }: SidebarProps) {
  const router = useRouter();
  const [sidebarTab, setSidebarTab] = useState<'bookmarks' | 'lists' | 'collective'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [lists, setLists] = useState<PsalmList[]>([]);
  const [myCollectives, setMyCollectives] = useState<{id: string; name: string; role: string}[]>([]);
  const [creatingList, setCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [user, setUser] = useState<{id: string; email?: string} | null>(null);
  const [syncing, setSyncing] = useState(false);

  const bg = darkMode ? '#1a1008' : '#fdf6ec';
  const surface = darkMode ? '#2c1e0f' : '#fff8ee';
  const border = darkMode ? '#5c3d1e' : '#e8d5b5';
  const textPrimary = darkMode ? '#f5e9d4' : '#2c1810';
  const textMuted = darkMode ? '#c9a96e' : '#9a7a5a';
  const goldAccent = '#c9a96e';

  useEffect(() => {
    getUser().then(u => {
      setUser(u as {id: string; email?: string} | null);
      if (u) autoSync(u.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) autoSync(u.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    try {
      setBookmarks(JSON.parse(localStorage.getItem('bookmarks') || '[]'));
      setLists(getLists());
      setMyCollectives(JSON.parse(localStorage.getItem('my_collectives') || '[]'));
    } catch {}
  }, [isOpen]);

  async function autoSync(userId: string) {
    await syncBookmarksToCloud(userId);
    await syncListsToCloud(userId);
    const cloudBookmarks = await loadBookmarksFromCloud(userId);
    localStorage.setItem('bookmarks', JSON.stringify(cloudBookmarks));
    const cloudLists = await loadListsFromCloud(userId);
    localStorage.setItem('psalm_lists', JSON.stringify(cloudLists));
    setBookmarks(cloudBookmarks);
    setLists(cloudLists as PsalmList[]);
  }

  async function handleSync() {
    if (!user) return;
    setSyncing(true);
    await syncBookmarksToCloud(user.id);
    await syncListsToCloud(user.id);
    const cloudBookmarks = await loadBookmarksFromCloud(user.id);
    localStorage.setItem('bookmarks', JSON.stringify(cloudBookmarks));
    const cloudLists = await loadListsFromCloud(user.id);
    localStorage.setItem('psalm_lists', JSON.stringify(cloudLists));
    setBookmarks(cloudBookmarks);
    setLists(cloudLists as PsalmList[]);
    setSyncing(false);
    alert('Synced successfully!');
  }

  function handleCreateList() {
    if (!newListName.trim()) return;
    const id = Math.random().toString(36).slice(2, 10);
    const newList = {
      id,
      name: newListName.trim(),
      description: newListDesc.trim(),
      psalms: [],
      createdAt: Date.now(),
    };
    const existing = JSON.parse(localStorage.getItem('psalm_lists') || '[]');
    existing.push(newList);
    localStorage.setItem('psalm_lists', JSON.stringify(existing));
    setLists(getLists());
    setNewListName('');
    setNewListDesc('');
    setCreatingList(false);
  }

  function handleDeleteList(listId: string) {
    deleteList(listId);
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

  function navigate(path: string) {
    router.push(path);
    onClose();
  }

  return (
    <>
      {isOpen && (
        <div onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300 }} />
      )}

      <div style={{
        position: 'fixed', top: 0, left: 0, height: '100vh', width: 'min(300px, 85vw)',
        background: surface, borderRight: `1px solid ${border}`,
        zIndex: 400, transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <Logo size={28} />
            </button>
            <span style={{ fontSize: '15px', fontWeight: '500', color: textPrimary }}>TehilimForAll</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: textMuted, padding: '4px' }}>
            <IconClose />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${border}` }}>
          {(['bookmarks', 'lists', 'collective'] as const).map(tab => (
            <button key={tab} onClick={() => setSidebarTab(tab)}
              style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: sidebarTab === tab ? `2px solid ${goldAccent}` : '2px solid transparent', cursor: 'pointer', fontSize: '13px', fontWeight: sidebarTab === tab ? '600' : '400', color: sidebarTab === tab ? textPrimary : textMuted, fontFamily: 'inherit', textTransform: 'capitalize' }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

          {sidebarTab === 'bookmarks' && (
            <>
              <p style={{ fontSize: '12px', fontWeight: '600', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Bookmarks</p>
              {bookmarks.length === 0 ? (
                <p style={{ fontSize: '14px', color: textMuted, fontStyle: 'italic' }}>No bookmarks yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {bookmarks.sort((a: number, b: number) => a - b).map((num: number) => (
                    <button key={num} onClick={() => navigate(`/psalm/${num}`)}
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
                      <button onClick={() => navigate(`/list/${list.id}`)}
                        style={{ width: '100%', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                        <div>
                          <p style={{ fontSize: '14px', color: textPrimary, fontWeight: '500', marginBottom: '2px', fontFamily: 'inherit' }}>{list.name}</p>
                          {list.description && <p style={{ fontSize: '12px', color: textMuted, fontStyle: 'italic', marginBottom: '2px', fontFamily: 'inherit' }}>{list.description}</p>}
                          <p style={{ fontSize: '12px', color: textMuted, fontFamily: 'inherit' }}>{list.psalms.length} psalm{list.psalms.length !== 1 ? 's' : ''}</p>
                        </div>
                        <span style={{ color: textMuted, fontSize: '16px' }}>›</span>
                      </button>
                      <div style={{ borderTop: `1px solid ${border}`, padding: '8px 14px', background: darkMode ? '#2a1a0a' : '#faf4ea', display: 'flex', gap: '6px' }}>
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
                <p style={{ fontSize: '12px', fontWeight: '600', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Collective Reading</p>
                <button onClick={() => navigate('/collective/new')}
                  style={{ background: goldAccent, border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px', color: 'white', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IconPlus /> New
                </button>
              </div>

              {myCollectives.length === 0 ? (
                <p style={{ fontSize: '14px', color: textMuted, fontStyle: 'italic', marginBottom: '16px' }}>No collective readings yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {myCollectives.map((c: {id: string; name: string; role: string}) => (
                    <button key={c.id} onClick={() => navigate(`/collective/${c.id}`)}
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

        {/* Auth section */}
        <div style={{ padding: '12px 20px', borderTop: `1px solid ${border}` }}>
          {user ? (
            <div>
              <p style={{ fontSize: '12px', color: textMuted, marginBottom: '8px' }}>
                Signed in as <strong style={{ color: textPrimary }}>{user.email}</strong>
              </p>
              <div style={{ marginBottom: '8px' }}>
                <button onClick={async () => { await signOut(); setUser(null); }}
                  style={{ width: '100%', padding: '8px', background: 'none', border: `1px solid ${border}`, borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: textMuted, fontFamily: 'inherit' }}>
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate('/auth')}
              style={{ width: '100%', padding: '10px', background: goldAccent, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: 'white', fontFamily: 'inherit', marginBottom: '8px' }}>
              Sign in / Create account
            </button>
          )}
          <button onClick={() => navigate('/')}
            style={{ width: '100%', padding: '10px', background: 'none', border: `1px solid ${border}`, borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: textPrimary, fontFamily: 'inherit' }}>
            ← All Psalms
          </button>
        </div>
      </div>
    </>
  );
}