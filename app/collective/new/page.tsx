'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { getUser } from '../../lib/auth';
import { useSettings } from '../../lib/settings';

export default function NewCollectiveReadingPage() {
  const router = useRouter();
  const { darkMode, highContrast } = useSettings();
  const [authReady, setAuthReady] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dedicatedTo, setDedicatedTo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getUser().then(u => {
      if (!u) {
        router.replace('/auth');
      } else {
        setAuthReady(true);
      }
    });
  }, []);

  const bg = highContrast ? '#ffffff' : darkMode ? '#1a1008' : '#fdf6ec';
  const border = highContrast ? '#000000' : darkMode ? '#5c3d1e' : '#e8d5b5';
  const textPrimary = highContrast ? '#000000' : darkMode ? '#f5e9d4' : '#2c1810';
  const textMuted = highContrast ? '#333333' : darkMode ? '#c9a96e' : '#7c6248';
  const goldAccent = highContrast ? '#000000' : '#c9a96e';

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
      const mine = JSON.parse(localStorage.getItem('my_collectives') || '[]');
      mine.push({ id, name: name.trim(), role: 'creator' });
      localStorage.setItem('my_collectives', JSON.stringify(mine));
      router.replace(`/collective/${id}`);
    }
  }

  if (!authReady) return <div style={{ minHeight: '100vh', background: bg }} />;

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "var(--font-lora), Georgia, serif", color: textPrimary }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 24px' }}>
        <button onClick={() => router.back()}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: textMuted, fontSize: '13px', fontFamily: 'inherit', padding: '0 0 24px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ← Back
        </button>

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
