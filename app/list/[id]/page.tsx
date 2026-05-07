'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSettings } from '../../lib/settings';
import { getLists, decodeSharedList } from '../../lib/lists';

export default function ListPage() {
  const { id } = useParams();
  const router = useRouter();
  const { darkMode, highContrast } = useSettings();
  const [list, setList] = useState<{ name: string; description: string; psalms: number[] } | null>(null);
  const [isShared, setIsShared] = useState(false);

  const bg = highContrast ? '#ffffff' : darkMode ? '#1a1008' : '#fdf6ec';
  const border = highContrast ? '#000000' : darkMode ? '#5c3d1e' : '#e8d5b5';
  const textPrimary = highContrast ? '#000000' : darkMode ? '#f5e9d4' : '#2c1810';
  const textMuted = highContrast ? '#333333' : darkMode ? '#c9a96e' : '#7c6248';
  const goldAccent = highContrast ? '#000000' : '#c9a96e';
  const surface = highContrast ? '#f5f5f5' : darkMode ? '#2c1e0f' : '#fff8ee';

  useEffect(() => {
    const localLists = getLists();
    const localList = localLists.find(l => l.id === id);
    if (localList) {
      setList(localList);
      return;
    }
    const decoded = decodeSharedList(id as string);
    if (decoded) {
      setList(decoded);
      setIsShared(true);
    }
  }, [id]);

  if (!list) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "var(--font-lora), Georgia, serif" }}>
      <p style={{ color: textMuted }}>List not found.</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "var(--font-lora), Georgia, serif", color: textPrimary }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
        <button onClick={() => router.push('/lists')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: textMuted, fontSize: '13px', fontFamily: 'inherit', padding: '0 0 24px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ← My Lists
        </button>

        {isShared && (
          <div style={{ background: '#fef9f0', border: `1px solid ${goldAccent}`, borderRadius: '8px', padding: '10px 16px', marginBottom: '24px', fontSize: '13px', color: textMuted }}>
            Shared list — view only
          </div>
        )}

        <p style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '8px' }}>
          {isShared ? 'Shared List' : 'My List'}
        </p>
        <h1 style={{ fontSize: '36px', fontWeight: '400', marginBottom: '8px' }}>{list.name}</h1>
        {list.description && (
          <p style={{ fontSize: '16px', color: textMuted, marginBottom: '16px', fontStyle: 'italic' }}>{list.description}</p>
        )}
        <p style={{ fontSize: '14px', color: textMuted, marginBottom: '8px' }}>{list.psalms.length} psalm{list.psalms.length !== 1 ? 's' : ''}</p>
        <div style={{ width: '48px', height: '2px', background: goldAccent, marginBottom: '32px' }} />

        {list.psalms.length === 0 ? (
          <p style={{ color: textMuted, fontStyle: 'italic' }}>No psalms in this list yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {list.psalms.sort((a, b) => a - b).map(num => (
              <button key={num} onClick={() => router.push(`/psalm/${num}?list=${id}`)}
                style={{ padding: '16px 18px', background: surface, border: `1px solid ${border}`, borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontSize: '15px', color: textPrimary, fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '500' }}>Psalm {num}</span>
                <span style={{ color: textMuted, fontSize: '13px' }}>Read →</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
