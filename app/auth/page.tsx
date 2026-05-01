'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import Logo from '../components/Logo';
import LanguageSelector from '../components/LanguageSelector';
import Sidebar from '../components/Sidebar';

const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

export default function AuthPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
    if (mode === 'signup' && (!firstName.trim() || !lastName.trim())) { setError('Please enter your first and last name.'); return; }
    setLoading(true); setError(''); setSuccess('');

    if (mode === 'signup') {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          }
        }
      });
      if (err) { setError(err.message); setLoading(false); return; }
      if (data.user) {
        localStorage.setItem('tehilim_user_name', `${firstName.trim()} ${lastName.trim()}`.trim());
      }
      setSuccess('Account created! You are now signed in.');
      setTimeout(() => router.push('/'), 1500);
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError(err.message); setLoading(false); return; }
      router.push('/');
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://tehilimforall.com' },
    });
    if (error) setError(error.message);
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Lora', Georgia, serif", color: textPrimary, display: 'flex', flexDirection: 'column' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} darkMode={false} />

      <div style={{ position: 'sticky', top: 0, background: bg, borderBottom: `1px solid ${border}`, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '7px 9px', cursor: 'pointer', color: textMuted, display: 'flex', alignItems: 'center' }}>
            <IconMenu />
          </button>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <Logo size={28} />
          </button>
        </div>
        <LanguageSelector />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
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

        {/* Google login */}
        <button onClick={handleGoogleLogin}
          style={{ width: '100%', padding: '13px', background: 'white', border: `1px solid ${border}`, borderRadius: '8px', cursor: 'pointer', fontSize: '15px', color: textPrimary, fontFamily: 'inherit', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: border }} />
          <span style={{ fontSize: '12px', color: textMuted }}>or</span>
          <div style={{ flex: 1, height: '1px', background: border }} />
        </div>

        {/* Name fields for signup */}
        {mode === 'signup' && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <input value={firstName} onChange={e => setFirstName(e.target.value)}
              placeholder="First name" style={{ ...inputStyle, flex: 1 }} />
            <input value={lastName} onChange={e => setLastName(e.target.value)}
              placeholder="Last name" style={{ ...inputStyle, flex: 1 }} />
          </div>
        )}

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
          style={{ width: '100%', padding: '11px', background: 'none', border: `1px solid ${border}`, borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: textPrimary, fontFamily: 'inherit', marginTop: '12px' }}>
          Continue without account
        </button>
      </div>
      </div>
    </div>
  );
}