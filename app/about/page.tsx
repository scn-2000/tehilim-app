'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../components/Logo';
import Sidebar from '../components/Sidebar';
import LanguageSelector from '../components/LanguageSelector';

const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const LEILUI_NAMES = [
  'Venus Nedjma bat Esther z\'l',
  'Chmouel ben Zara Tekouka z\'l',
  'Lazare ben Zara Tekouka',
  'Lory-Marine Goumara Levana z\'l bat Yvonne Haya',
  'Jean-Marc Mordehaï z\'l ben Alain David',
  'Maxime Nessim ben Messaouda z\'l',
  'Danielle Hanna bat Messaouda z\'l',
  'Hayal Liav z\'l Ben Orith Ryvka',
  'Hayal Omri z\'l Ben Iris',
  'Harel z\'l ben Solange',
];

export default function AboutPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bg = '#fdf6ec';
  const border = '#e8d5b5';
  const textPrimary = '#2c1810';
  const textMuted = '#7c6248';
  const goldAccent = '#c9a96e';
  const surface = '#fff8ee';

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "var(--font-lora), Georgia, serif", color: textPrimary }}>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} darkMode={false} />

      {/* Sticky top bar */}
      <div style={{ position: 'sticky', top: 0, background: bg, borderBottom: `1px solid ${border}`, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu"
            style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '7px 9px', cursor: 'pointer', color: textMuted, display: 'flex', alignItems: 'center' }}>
            <IconMenu />
          </button>
          <button onClick={() => router.push('/')} aria-label="TehilimForAll home" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <Logo size={28} />
          </button>
        </div>
        <LanguageSelector />
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px 80px' }}>
        <p style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '8px' }}>
          About
        </p>
        <h1 style={{ fontSize: '36px', fontWeight: '400', marginBottom: '8px', lineHeight: 1.2 }}>
          About TehilimForAll
        </h1>
        <div style={{ width: '48px', height: '2px', background: goldAccent, marginBottom: '40px' }} />

        {/* Section 1 — What is TehilimForAll */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '16px', color: textPrimary }}>
            What is TehilimForAll?
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: textPrimary, marginBottom: '14px' }}>
            TehilimForAll is a free platform for reading Tehilim on your phone. All 150 psalms are available in Hebrew with nikud (vowel marks), Sephardic phonetic transliteration, and English translation (JPS). No ads, no account required.
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: textPrimary, marginBottom: '14px' }}>
            Features include bookmarks, custom reading lists, and <em>Collective Reading</em> — where a group divides all 150 psalms among its members. Each person claims their portion and reads it, while a shared progress bar tracks the group's completion in real time.
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: textPrimary }}>
            Built for everyone: from fluent Hebrew readers to those who rely on phonetics to follow along. Whether you know every word by heart or are encountering the psalms for the first time, TehilimForAll meets you where you are.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '24px' }}>
            {['Hebrew with nikud', 'Phonetic transliteration', 'English (JPS)', 'Bookmarks', 'Custom lists', 'Collective Reading', 'Free, no account'].map(f => (
              <span key={f} style={{ padding: '5px 12px', background: surface, border: `1px solid ${border}`, borderRadius: '20px', fontSize: '13px', color: textMuted }}>
                {f}
              </span>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: border, marginBottom: '48px' }} />

        {/* Section 2 — What is Tehilim */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '16px', color: textPrimary }}>
            What is Tehilim?
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: textPrimary, marginBottom: '20px' }}>
            Tehilim — the Book of Psalms — is one of the most beloved books of the Hebrew Bible. It belongs to the Ketuvim, the Writings, the third section of the Tanakh. Unlike the Torah, which commands, or the Prophets, who rebuke and console, Tehilim speaks in a different direction: it is the human voice addressing God. It is prayer in its purest form.
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: textPrimary, marginBottom: '20px' }}>
            Tradition attributes the psalms to King David, the shepherd-poet-king who was, in the words of the Talmud, <em>"pleasant in songs and hymns."</em> Yet the book itself is more inclusive. Its superscriptions name other authors — the sons of Korah, Asaph, Moses, Solomon — and many psalms carry no attribution at all. David may be the book's great architect, but Tehilim belongs to the whole people.
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: textPrimary, marginBottom: '20px' }}>
            One hundred and fifty psalms, spanning the full range of human experience: radiant praise and anguished petition, gratitude and grief, longing, repentance, wonder, despair, and unshakeable hope. Tehilim does not present a tidied version of the spiritual life. It presents it honestly — which is precisely why it has endured.
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: textPrimary }}>
            In Jewish life, Tehilim is never far away. Portions are recited daily in the morning service; the entire book is completed each month by communities that take this upon themselves. Psalms are said at the bedside of the ill, for soldiers in the field, for the departed, before Shabbat, and in moments of communal crisis when words of one's own feel insufficient. The power of Tehilim is precisely this: every person in every generation finds their own situation reflected in its verses. The psalm that David wrote in hiding from his enemies becomes, centuries later, the prayer of someone sitting in a hospital waiting room. The words are old; the experience is immediate.
          </p>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: border, marginBottom: '48px' }} />

        {/* Section 3 — Leilui Nishmat */}
        <section>
          <div style={{ borderTop: `2px solid ${goldAccent}`, paddingTop: '36px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', color: textMuted, marginBottom: '12px' }}>
              This page was written
            </p>
            <p
              style={{
                fontSize: '28px',
                fontFamily: "var(--font-frank-ruhl-libre), 'Frank Ruhl Libre', serif",
                fontWeight: '400',
                color: textPrimary,
                marginBottom: '6px',
                direction: 'rtl',
              }}
            >
              לעילוי נשמת
            </p>
            <p style={{ fontSize: '14px', color: textMuted, marginBottom: '32px', fontStyle: 'italic' }}>
              Leilouï Nichmat
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              {LEILUI_NAMES.map((name) => (
                <p
                  key={name}
                  style={{
                    fontSize: '15px',
                    color: textMuted,
                    lineHeight: 1.6,
                    maxWidth: '420px',
                    margin: 0,
                  }}
                >
                  {name}
                </p>
              ))}
            </div>

            <p style={{ marginTop: '36px', fontSize: '13px', color: goldAccent, letterSpacing: '0.08em' }}>
              ז״ל — May their memory be a blessing
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
