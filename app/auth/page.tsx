'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import Logo from '../components/Logo';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const bg = '#fdf6ec';
  const surface = '#fff8ee';
  const border = '#e8d5b5';
  const textPrimary = '#2c1810';
  const textMuted = '#9a7a5a';
  const goldAccent = '#c9a96e';

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '8px',
    border: `1px solid ${border}`, background: bg, color: textPrimary,
    fontSize: '15px', fontFamily: 'inherit',
    boxSizing: 'border-box' as const, outline: 'none', marginBottom: '12px',
  };

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError(''); setSuccess('');

    if (mode === 'signup') {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) { setError(err.message); setLoading(false); return; }
      setSuccess('Account created! You are now signed in.');
      setTimeout(() => router.push('/'), 1500);
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError(err.message); setLoading(false); return; }
      router.push('/');
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Lora', Georgia, serif", color: textPrimary, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px' }}>
          <Logo size={56} />
        </button>
        <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '4px' }}>TehilimForAll</h1>
        <p style={{ fontSize: '14px', color: textMuted }}>תהילים לכולם</p>
      </div>

      <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '24px', borderBottom: `1px solid ${border}` }}>
          {(['signin', 'signup'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccess(''); }}
              style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: mode === m ? `2px solid ${goldAccent}` : '2px solid transparent', cursor: 'pointer', fontSize: '14px', fontWeight: mode === m ? '600' : '400', color: mode === m ? textPrimary : textMuted, fontFamily: 'inherit' }}>
              {m === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Email address" style={inputStyle} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Password" onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
          style={{ ...inputStyle, marginBottom: '20px' }} />

        {error && <p style={{ fontSize: '14px', color: '#c0392b', marginBottom: '12px' }}>{error}</p>}
        {success && <p style={{ fontSize: '14px', color: '#1e4d2b', marginBottom: '12px' }}>{success}</p>}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', padding: '13px', background: goldAccent, border: 'none', borderRadius: '8px', cursor: loading ? 'default' : 'pointer', fontSize: '15px', color: 'white', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>

        <button onClick={() => router.push('/')}
          style={{ width: '100%', padding: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: textMuted, fontFamily: 'inherit', marginTop: '12px' }}>
          Continue without account
        </button>
      </div>
    </div>
  );
}