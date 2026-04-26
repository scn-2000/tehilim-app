'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { decodeSharedList } from '../../lib/lists';
import Logo from '../../components/Logo';

export default function SharedListPage() {
  const { id } = useParams();
  const router = useRouter();
  const [list, setList] = useState<{ name: string; psalms: number[] } | null>(null);

  useEffect(() => {
    const decoded = decodeSharedList(id as string);
    setList(decoded);
  }, [id]);

  const bg = '#fdf6ec';
  const border = '#e8d5b5';
  const textPrimary = '#2c1810';
  const textMuted = '#9a7a5a';
  const goldAccent = '#c9a96e';
  const surface = '#fff8ee';

  if (!list) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Lora', Georgia, serif" }}>
      <p style={{ color: textMuted }}>Invalid or expired list link.</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Lora', Georgia, serif", color: textPrimary }}>
      <div style={{ position: 'sticky', top: 0, background: bg, borderBottom: `1px solid ${border}`, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Logo size={28} />
        <button onClick={() => router.push('/')}
          style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: textPrimary, fontSize: '13px', fontFamily: 'inherit' }}>
          ← Home
        </button>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
        <p style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '8px' }}>Shared List</p>
        <h1 style={{ fontSize: '32px', fontWeight: '400', marginBottom: '8px' }}>{list.name}</h1>
        <p style={{ fontSize: '14px', color: textMuted, marginBottom: '32px' }}>{list.psalms.length} psalm{list.psalms.length !== 1 ? 's' : ''}</p>
        <div style={{ width: '48px', height: '2px', background: goldAccent, marginBottom: '32px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {list.psalms.sort((a, b) => a - b).map(num => (
            <button key={num} onClick={() => router.push(`/psalm/${num}`)}
              style={{ padding: '14px 18px', background: surface, border: `1px solid ${border}`, borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontSize: '15px', color: textPrimary, fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Psalm {num}</span>
              <span style={{ color: textMuted, fontSize: '13px' }}>Read →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}