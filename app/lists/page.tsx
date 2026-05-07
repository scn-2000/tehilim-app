'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '../lib/settings';
import { getLists, createList, deleteList, encodeListForSharing, PsalmList } from '../lib/lists';
import { useTranslations } from '../lib/i18n';

const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconShare = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function ListsPage() {
  const router = useRouter();
  const { darkMode, highContrast } = useSettings();
  const { t } = useTranslations();
  const [lists, setLists] = useState<PsalmList[]>([]);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const bg = highContrast ? '#ffffff' : darkMode ? '#1a1008' : '#fdf6ec';
  const border = highContrast ? '#000000' : darkMode ? '#5c3d1e' : '#e8d5b5';
  const textPrimary = highContrast ? '#000000' : darkMode ? '#f5e9d4' : '#2c1810';
  const textMuted = highContrast ? '#333333' : darkMode ? '#c9a96e' : '#7c6248';
  const goldAccent = highContrast ? '#000000' : '#c9a96e';
  const surface = highContrast ? '#f5f5f5' : darkMode ? '#2c1e0f' : '#fff8ee';

  useEffect(() => { setLists(getLists()); }, []);

  function handleCreate() {
    if (!name.trim()) return;
    createList(name.trim(), desc.trim());
    setLists(getLists());
    setName(''); setDesc(''); setCreating(false);
  }

  function handleDelete(id: string) {
    deleteList(id);
    setLists(getLists());
  }

  function handleShare(list: PsalmList) {
    const url = `https://tehilimforall.com/list/${encodeListForSharing(list)}`;
    if (navigator.share) {
      navigator.share({ title: `${list.name} — TehilimForAll`, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('List link copied!');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "var(--font-lora), Georgia, serif", color: textPrimary }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <p style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '8px' }}>
              {t.sidebar.listsTab}
            </p>
            <h1 style={{ fontSize: '36px', fontWeight: '400', marginBottom: '8px' }}>{t.sidebar.myLists}</h1>
          </div>
          <button
            onClick={() => setCreating(true)}
            style={{ background: goldAccent, border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', color: 'white', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '28px', flexShrink: 0 }}>
            <IconPlus /> {t.sidebar.newList}
          </button>
        </div>
        <div style={{ width: '48px', height: '2px', background: goldAccent, marginBottom: '32px' }} />

        {creating && (
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', fontWeight: '500', color: textPrimary, marginBottom: '12px' }}>{t.sidebar.newListTitle}</p>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder={t.sidebar.listNamePlaceholder}
              onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
              autoFocus
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${border}`, background: bg, color: textPrimary, fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '10px', outline: 'none' }} />
            <textarea
              value={desc} onChange={e => setDesc(e.target.value)}
              placeholder={t.sidebar.descPlaceholder} rows={2}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${border}`, background: bg, color: textPrimary, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '12px', outline: 'none', resize: 'none' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleCreate}
                style={{ flex: 1, padding: '9px', background: goldAccent, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: 'white', fontFamily: 'inherit' }}>
                {t.sidebar.create}
              </button>
              <button onClick={() => { setCreating(false); setName(''); setDesc(''); }}
                style={{ flex: 1, padding: '9px', background: 'none', border: `1px solid ${border}`, borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: textPrimary, fontFamily: 'inherit' }}>
                {t.sidebar.cancel}
              </button>
            </div>
          </div>
        )}

        {lists.length === 0 && !creating ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: '16px', color: textMuted, marginBottom: '8px' }}>{t.sidebar.noLists}</p>
            <p style={{ fontSize: '14px', color: textMuted, fontStyle: 'italic' }}>
              Create a list to organise psalms for a specific occasion or person.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lists.map(list => (
              <div key={list.id} style={{ border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
                <button
                  onClick={() => router.push(`/list/${list.id}`)}
                  style={{ width: '100%', padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                  <div>
                    <p style={{ fontSize: '15px', color: textPrimary, fontWeight: '500', marginBottom: '3px' }}>{list.name}</p>
                    {list.description && <p style={{ fontSize: '13px', color: textMuted, fontStyle: 'italic', marginBottom: '3px' }}>{list.description}</p>}
                    <p style={{ fontSize: '12px', color: textMuted }}>{list.psalms.length} {list.psalms.length !== 1 ? t.sidebar.psalms : t.sidebar.psalm}</p>
                  </div>
                  <span style={{ color: textMuted, fontSize: '18px', flexShrink: 0 }}>›</span>
                </button>
                <div style={{ borderTop: `1px solid ${border}`, padding: '10px 16px', background: darkMode ? '#2a1a0a' : highContrast ? '#ebebeb' : '#faf4ea', display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleShare(list)}
                    aria-label={`Share ${list.name}`}
                    style={{ padding: '7px 14px', background: 'none', border: `1px solid ${border}`, borderRadius: '7px', cursor: 'pointer', fontSize: '12px', color: textMuted, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <IconShare /> Share
                  </button>
                  <button
                    onClick={() => handleDelete(list.id)}
                    aria-label={`Delete ${list.name}`}
                    style={{ padding: '7px 14px', background: 'none', border: `1px solid ${border}`, borderRadius: '7px', cursor: 'pointer', fontSize: '12px', color: textMuted, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <IconClose /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
