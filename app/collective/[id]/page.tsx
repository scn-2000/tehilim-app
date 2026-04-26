'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Logo from '../../components/Logo';
import Sidebar from '../../components/Sidebar';

interface Claim {
  psalmNum: number;
  name: string;
  claimedAt: string;
}

interface CollectiveReading {
  id: string;
  name: string;
  description: string;
  dedicated_to: string;
  start_date: string | null;
  end_date: string | null;
  claims: Claim[];
}

export default function CollectiveReadingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [reading, setReading] = useState<CollectiveReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [savedName, setSavedName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [pendingPsalm, setPendingPsalm] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nameRef = useRef<HTMLDivElement>(null);

  const bg = '#fdf6ec';
  const surface = '#fff8ee';
  const border = '#e8d5b5';
  const textPrimary = '#2c1810';
  const textMuted = '#9a7a5a';
  const goldAccent = '#c9a96e';
  const englishColor = '#1e4d2b';

  useEffect(() => {
    const stored = localStorage.getItem('tehilim_user_name');
    if (stored) { setUserName(stored); setSavedName(stored); }
    fetchReading();
  }, [id]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (nameRef.current && !nameRef.current.contains(e.target as Node)) setShowNamePrompt(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function fetchReading() {
    setLoading(true);
    const { data } = await supabase
      .from('collective_readings')
      .select('*')
      .eq('id', id)
      .single();
    if (data) setReading(data);
    setLoading(false);
  }

  async function claimPsalm(psalmNum: number, name: string) {
    if (!reading) return;
    setSaving(true);
    const existingClaims: Claim[] = reading.claims || [];
    const updated = existingClaims.filter(c => c.psalmNum !== psalmNum);
    updated.push({ psalmNum, name, claimedAt: new Date().toISOString() });
    const { data } = await supabase
      .from('collective_readings')
      .update({ claims: updated })
      .eq('id', id)
      .select()
      .single();
    if (data) setReading(data);
    setSaving(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  }

  async function unclaimPsalm(psalmNum: number) {
    if (!reading) return;
    setSaving(true);
    const updated = (reading.claims || []).filter(c => c.psalmNum !== psalmNum);
    const { data } = await supabase
      .from('collective_readings')
      .update({ claims: updated })
      .eq('id', id)
      .select()
      .single();
    if (data) setReading(data);
    setSaving(false);
  }

  function handlePsalmClick(psalmNum: number) {
    const claim = reading?.claims?.find(c => c.psalmNum === psalmNum);
    if (claim && claim.name === userName) {
      unclaimPsalm(psalmNum);
      return;
    }
    if (userName) {
      claimPsalm(psalmNum, userName);
    } else {
      setPendingPsalm(psalmNum);
      setShowNamePrompt(true);
    }
  }

  function handleNameSubmit() {
    if (!nameInput.trim()) return;
    const name = nameInput.trim();
    setUserName(name);
    setSavedName(name);
    localStorage.setItem('tehilim_user_name', name);
    const joined = JSON.parse(localStorage.getItem('my_collectives') || '[]');
    if (!joined.find((c: {id: string}) => c.id === id)) {
      joined.push({ id, name: reading?.name || '', role: 'participant' });
      localStorage.setItem('my_collectives', JSON.stringify(joined));
    }
    setShowNamePrompt(false);
    if (pendingPsalm !== null) {
      claimPsalm(pendingPsalm, name);
      setPendingPsalm(null);
    }
  }

  function handleShare() {
    const url = `https://tehilimforall.com/collective/${id}`;
    if (navigator.share) {
      navigator.share({ title: `${reading?.name} — TehilimForAll`, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied!');
    }
  }

  const totalClaimed = reading?.claims?.length || 0;
  const totalPsalms = 150;
  const progress = Math.round((totalClaimed / totalPsalms) * 100);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Lora', Georgia, serif" }}>
      <p style={{ color: textMuted }}>Loading...</p>
    </div>
  );

  if (!reading) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Lora', Georgia, serif" }}>
      <p style={{ color: textMuted }}>Collective reading not found.</p>
    </div>
  );

  const participants = Array.from(new Set((reading.claims || []).map(c => c.name))).map(name => ({
    name,
    count: (reading.claims || []).filter(c => c.name === name).length,
  }));

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Lora', Georgia, serif", color: textPrimary }}>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} darkMode={false} />

      {/* Name prompt */}
      {showNamePrompt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div ref={nameRef} style={{ background: surface, border: `1px solid ${border}`, borderRadius: '16px', padding: '32px', width: '320px', boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '400', marginBottom: '8px', color: textPrimary }}>What is your name?</h3>
            <p style={{ fontSize: '14px', color: textMuted, marginBottom: '20px' }}>Your name will be shown next to the psalms you commit to read.</p>
            <input value={nameInput} onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleNameSubmit(); }}
              placeholder="Your name..." autoFocus
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${border}`, background: bg, color: textPrimary, fontSize: '15px', fontFamily: 'inherit', boxSizing: 'border-box' as const, marginBottom: '12px', outline: 'none' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleNameSubmit}
                style={{ flex: 1, padding: '10px', background: goldAccent, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: 'white', fontFamily: 'inherit' }}>
                Continue
              </button>
              <button onClick={() => { setShowNamePrompt(false); setPendingPsalm(null); }}
                style={{ flex: 1, padding: '10px', background: 'none', border: `1px solid ${border}`, borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: textPrimary, fontFamily: 'inherit' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ position: 'sticky', top: 0, background: bg, borderBottom: `1px solid ${border}`, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '7px 9px', cursor: 'pointer', color: textMuted, display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <Logo size={28} />
          </button>
          <button onClick={() => router.back()}
            style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: textPrimary, fontSize: '13px', fontFamily: 'inherit' }}>
            ← Back
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {justSaved && <span style={{ fontSize: '13px', color: englishColor, fontStyle: 'italic' }}>✓ Saved</span>}
          {savedName && <span style={{ fontSize: '13px', color: textMuted }}>Reading as <strong style={{ color: textPrimary }}>{savedName}</strong></span>}
          <button onClick={handleShare}
            style={{ background: goldAccent, border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', color: 'white', fontFamily: 'inherit' }}>
            Share link
          </button>
          <button onClick={() => router.back()}
            style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', color: textPrimary, fontFamily: 'inherit' }}>
            Done
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px 0' }}>
        <p style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '8px' }}>Collective Reading</p>
        <h1 style={{ fontSize: '36px', fontWeight: '400', marginBottom: '8px' }}>{reading.name}</h1>
        {reading.dedicated_to && <p style={{ fontSize: '16px', color: goldAccent, marginBottom: '8px', fontStyle: 'italic' }}>Dedicated to: {reading.dedicated_to}</p>}
        {reading.description && <p style={{ fontSize: '15px', color: textMuted, marginBottom: '12px' }}>{reading.description}</p>}
        {(reading.start_date || reading.end_date) && (
          <p style={{ fontSize: '13px', color: textMuted, marginBottom: '12px' }}>
            {reading.start_date && `From ${reading.start_date}`}
            {reading.start_date && reading.end_date && ' — '}
            {reading.end_date && `Until ${reading.end_date}`}
          </p>
        )}
        <div style={{ width: '48px', height: '2px', background: goldAccent, margin: '16px 0 24px' }} />

        {/* Progress */}
        <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', color: textPrimary, fontWeight: '500' }}>{totalClaimed} / {totalPsalms} psalms claimed</span>
            <span style={{ fontSize: '14px', color: goldAccent, fontWeight: '500' }}>{progress}%</span>
          </div>
          <div style={{ height: '8px', background: border, borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: goldAccent, borderRadius: '4px', transition: 'width 0.3s' }} />
          </div>
          {totalClaimed === totalPsalms && (
            <p style={{ fontSize: '14px', color: englishColor, marginTop: '10px', fontWeight: '500', textAlign: 'center' }}>
              ✓ All 150 psalms have been claimed! 🎉
            </p>
          )}
        </div>

        {/* Participants */}
        {participants.length > 0 && (
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Participants</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {participants.map(p => (
                <div key={p.name} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '20px', padding: '6px 12px', fontSize: '13px', color: textPrimary }}>
                  <strong>{p.name}</strong>
                  <span style={{ color: textMuted, marginLeft: '6px' }}>{p.count} psalm{p.count !== 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <p style={{ fontSize: '14px', color: textMuted, marginBottom: '20px', fontStyle: 'italic' }}>
          Click a psalm to commit to reading it. Click again to unclaim.
          {!savedName && ' You will be asked for your name when you first claim a psalm.'}
        </p>

        {/* Psalm grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '60px' }}>
          {Array.from({ length: 150 }, (_, i) => i + 1).map(num => {
            const claim = reading.claims?.find(c => c.psalmNum === num);
            const isMyPsalm = claim?.name === userName && userName !== '';
            const isClaimed = !!claim;
            return (
              <div key={num}
                style={{ borderRadius: '10px', border: `1px solid ${isMyPsalm ? goldAccent : isClaimed ? '#d4c5a0' : border}`, background: isMyPsalm ? goldAccent : isClaimed ? '#f5edd8' : surface, overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => handlePsalmClick(num)}>
                <div style={{ padding: '10px 8px 6px', textAlign: 'center' }}>
                  <p style={{ fontSize: '15px', fontWeight: '500', color: isMyPsalm ? 'white' : textPrimary, marginBottom: '4px' }}>{num}</p>
                </div>
                <div style={{ padding: '0 6px 8px', textAlign: 'center' }}>
                  <p style={{ fontSize: '10px', color: isMyPsalm ? 'rgba(255,255,255,0.85)' : textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {claim ? claim.name : '—'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}