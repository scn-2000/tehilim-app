'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Logo from '../../components/Logo';

export default function NewCollectiveReadingPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dedicatedTo, setDedicatedTo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const bg = '#fdf6ec';
  const surface = '#fff8ee';
  const border = '#e8d5b5';
  const textPrimary = '#2c1810';
  const textMuted = '#9a7a5a';
  const goldAccent = '#c9a96e';

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: `1px solid ${border}`, background: bg, color: textPrimary,
    fontSize: '15px', fontFamily: 'inherit',
    boxSizing: 'border-box' as const, outline: 'none', marginBottom: '16px',
  };

  async function handleCreate() {
    if (!name.trim()) { setError('Please enter a name.'); return; }
    setCreating(true);
    setError('');
    const id = Math.random().toString(36).slice(2, 12);
    const { data, error: err } = await supabase
      .from('collective_readings')
      .insert({
        id,
        name: name.trim(),
        description: description.trim(),
        dedicated_to: dedicatedTo.trim(),
        start_date: startDate || null,
        end_date: endDate || null,
        claims: [],
      })
      .select()
      .single();
    if (err) { setError('Something went wrong. Please try again.'); setCreating(false); return; }
    if (data) {
      // Save to my collectives
      const mine = JSON.parse(localStorage.getItem('my_collectives') || '[]');
      mine.push({ id, name: name.trim(), role: 'creator' });
      localStorage.setItem('my_collectives', JSON.stringify(mine));
      router.push(`/collective/${id}`);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Lora', Georgia, serif", color: textPrimary }}>
      <div style={{ position: 'sticky', top: 0, background: bg, borderBottom: `1px solid ${border}`, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Logo size={28} />
        <button onClick={() => router.back()}
          style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: textPrimary, fontSize: '13px', fontFamily: 'inherit' }}>
          ← Back
        </button>
      </div>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 24px' }}>
        <p style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '8px' }}>New</p>
        <h1 style={{ fontSize: '32px', fontWeight: '400', marginBottom: '32px' }}>Collective Reading</h1>

        <label style={{ fontSize: '13px', color: textMuted, display: 'block', marginBottom: '6px' }}>Name *</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Refuah for Moshe ben Sara" style={inputStyle} />

        <label style={{ fontSize: '13px', color: textMuted, display: 'block', marginBottom: '6px' }}>Dedicated to</label>
        <input value={dedicatedTo} onChange={e => setDedicatedTo(e.target.value)} placeholder="e.g. Moshe ben Sara" style={inputStyle} />

        <label style={{ fontSize: '13px', color: textMuted, display: 'block', marginBottom: '6px' }}>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          placeholder="Add a message or intention..." rows={3}
          style={{ ...inputStyle, resize: 'none' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: textMuted, display: 'block', marginBottom: '6px' }}>Start date (optional)</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              style={{ ...inputStyle, marginBottom: 0 }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: textMuted, display: 'block', marginBottom: '6px' }}>End date (optional)</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              style={{ ...inputStyle, marginBottom: 0 }} />
          </div>
        </div>

        {error && <p style={{ fontSize: '14px', color: '#c0392b', marginBottom: '12px' }}>{error}</p>}

        <button onClick={handleCreate} disabled={creating}
          style={{ width: '100%', padding: '14px', background: goldAccent, border: 'none', borderRadius: '10px', cursor: creating ? 'default' : 'pointer', fontSize: '16px', color: 'white', fontFamily: 'inherit', opacity: creating ? 0.7 : 1, marginTop: '8px' }}>
          {creating ? 'Creating...' : 'Create Collective Reading'}
        </button>
      </div>
    </div>
  );
}