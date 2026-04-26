'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getLists, decodeSharedList, PsalmList } from '../../lib/lists';
import Logo from '../../components/Logo';

export default function ListPage() {
  const { id } = useParams();
  const router = useRouter();
  const [list, setList] = useState<{ name: string; description: string; psalms: number[] } | null>(null);
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    // First check if it's a local list
    const localLists = getLists();
    const localList = localLists.find(l => l.id === id);
    if (localList) {
      setList(localList);
      return;
    }
    // Otherwise try to decode as shared list
    const decoded = decodeSharedList(id as string);
    if (decoded) {
      setList(decoded);
      setIsShared(true);
    }
  }, [id]);

  const bg = '#fdf6ec';
  const border = '#e8d5b5';
  const textPrimary = '#2c1810';
  const textMuted = '#9a7a5a';
  const goldAccent = '#c9a96e';
  const surface = '#fff8ee';

  if (!list) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Lora', Georgia, serif" }}>
      <p style={{ color: textMuted }}>List not found.</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Lora', Georgia, serif", color: textPrimary }}>
      <div style={{ position: 'sticky', top: 0, background: bg, borderBottom: `1px solid ${border}`, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Logo size={28} />
        <button onClick={() => router.back()}
          style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: textPrimary, fontSize: '13px', fontFamily: 'inherit' }}>
          ← Back
        </button>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
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
              <button key={num} onClick={() => router.push(`/psalm/${num}`)}
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