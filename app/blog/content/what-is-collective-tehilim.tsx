import Link from 'next/link';
import type { ArticleColors } from './index';

const USE_CASES = [
  {
    title: 'For someone who is ill',
    desc: 'The most common occasion. A chevra tehilim ensures the entire Sefer Tehilim is completed at once for the person in need, combining many voices into a single act of prayer.',
  },
  {
    title: 'For soldiers in danger',
    desc: 'Communities organize collective readings for military personnel serving in harm\'s way, drawing on the tradition of Psalm 91 as a prayer for protection.',
  },
  {
    title: 'For a simcha',
    desc: 'Collective readings are sometimes done as a communal blessing before a wedding, brit milah, or bar/bat mitzvah — dedicating the zekhut to the occasion and those celebrating.',
  },
  {
    title: 'For national and communal need',
    desc: 'At times of crisis affecting the Jewish people — antisemitic violence, war, natural disaster — mass Tehilim readings are organized in communities worldwide, often simultaneously.',
  },
  {
    title: 'For the High Holidays',
    desc: 'Many Sephardic communities complete the entire Sefer Tehilim on Erev Rosh Hashana. Ashkenazic communities often organize communal readings as part of High Holiday preparations.',
  },
];

export default function CollectiveContent({ colors }: { colors: ArticleColors }) {
  const { textPrimary, textMuted, goldAccent, surface, border } = colors;

  const h2 = { fontSize: '22px', fontWeight: '500' as const, color: textPrimary, marginBottom: '14px', marginTop: '40px', lineHeight: 1.3 };
  const p = { fontSize: '16px', lineHeight: 1.85, color: textPrimary, marginBottom: '16px' };
  const link = { color: goldAccent, textDecoration: 'underline' as const, textUnderlineOffset: '2px' };

  const stepNum = {
    width: '28px', height: '28px', borderRadius: '50%', background: goldAccent,
    color: 'white', display: 'flex' as const, alignItems: 'center' as const, justifyContent: 'center' as const,
    fontSize: '14px', fontWeight: '600' as const, flexShrink: 0,
  };

  return (
    <div>
      <p style={p}>
        Throughout Jewish history, communities have gathered to say Tehilim together when one of their members
        was in need. This practice — the <em>collective Tehilim reading</em> — transforms what can be a
        solitary prayer into an act of communal solidarity and shared spiritual effort. When a community divides
        the 150 psalms and reads them all at once, every member contributes to a single, unified intention.
      </p>
      <p style={p}>
        Today, technology makes it possible to organize such a reading across any distance — connecting family
        members, friends, and community members spread across cities and continents into one shared act of prayer.
      </p>

      <h2 style={h2}>Historical Background: The Chevra Tehilim</h2>
      <p style={p}>
        The institution of the <em>chevra tehilim</em> (חֶבְרָה תְּהִלִּים) — the Psalm Society — has deep roots
        in Jewish communal life, traceable to at least the 17th and 18th centuries in both Ashkenazic and Sephardic
        communities. These were formal, organized groups — sometimes meeting weekly, sometimes daily — whose members
        would divide the book of Psalms and read them together for the general welfare of the community.
      </p>
      <p style={p}>
        The Baal Shem Tov (founder of Hasidism, 18th century) is widely credited with popularizing and elevating
        the spiritual significance of Tehilim recitation among ordinary Jews. He taught that even a simple Jew
        reciting Tehilim with sincere feeling reaches heights that a scholar analyzing Torah might not — because
        Tehilim is prayer in its purest form, spoken directly from the heart to God.
      </p>
      <p style={p}>
        The idea of <em>communal</em> reading has a theological basis as well. The Talmud speaks of the special
        capacity of a <em>tzibur</em> (community) to invoke divine compassion — a prayer said by many voices
        with a shared intention has a spiritual weight that exceeds the sum of its parts. When ten, a hundred,
        or a thousand people all read Tehilim for the same person on the same day, that represents something
        qualitatively different from one person reading alone.
      </p>

      <h2 style={h2}>When and Why It Is Done</h2>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px', marginBottom: '28px' }}>
        {USE_CASES.map(({ title, desc }) => (
          <div key={title} style={{ background: surface, border: `1px solid ${border}`, borderRadius: '10px', padding: '16px 18px' }}>
            <p style={{ fontSize: '15px', fontWeight: '600', color: textPrimary, marginBottom: '6px' }}>{title}</p>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: textPrimary }}>{desc}</p>
          </div>
        ))}
      </div>

      <h2 style={h2}>How TehilimForAll&apos;s Collective Reading Works</h2>
      <p style={p}>
        TehilimForAll&apos;s{' '}
        <Link href="/collective" style={link}>Collective Reading feature</Link>
        {' '}is built specifically for this purpose. Here is how it works, step by step:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px', marginBottom: '28px' }}>
        {[
          { step: 1, title: 'Create a reading', desc: 'Go to the Collective page and start a new reading. Give it a name — typically the name and purpose, such as "Refuah shleimah for Miriam bat Sarah" — so participants know who they are praying for.' },
          { step: 2, title: 'Portions are assigned automatically', desc: 'The 150 psalms are divided into portions. Each participant can claim one or more portions. The system tracks who has claimed what, ensuring full coverage.' },
          { step: 3, title: 'Share the link', desc: 'Each reading has a unique shareable link. Send it via WhatsApp, email, or social media. Anyone with the link can join and claim their portion — no account required.' },
          { step: 4, title: 'Read and complete', desc: 'Each participant reads their assigned psalms — in Hebrew, phonetics, and English, with the full TehilimForAll experience. Progress updates in real time.' },
          { step: 5, title: 'The whole Tehilim is said', desc: 'When all portions are claimed, the entire Sefer Tehilim has been completed — a unified communal act of prayer, even if the participants are scattered around the world.' },
        ].map(({ step, title, desc }) => (
          <div key={step} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={stepNum}>{step}</div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: '600', color: textPrimary, marginBottom: '4px' }}>{title}</p>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: textPrimary }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: surface, border: `1px solid ${goldAccent}`, borderRadius: '12px', padding: '24px', textAlign: 'center' as const, marginTop: '32px' }}>
        <p style={{ fontSize: '17px', color: textPrimary, marginBottom: '6px', fontWeight: '500' }}>
          Ready to organize a collective reading?
        </p>
        <p style={{ fontSize: '15px', color: textPrimary, marginBottom: '20px', lineHeight: 1.7 }}>
          Whether for healing, protection, or any communal need — bring your community together in one shared act of prayer.
        </p>
        <Link href="/collective" style={{ display: 'inline-block', background: goldAccent, color: 'white', padding: '12px 28px', borderRadius: '8px', fontWeight: '600', fontSize: '15px', textDecoration: 'none' }}>
          Start a Collective Reading →
        </Link>
      </div>

      <p style={{ ...p, marginTop: '32px' }}>
        To learn how to dedicate a reading for someone who is ill and which psalms to recite, see our article:{' '}
        <Link href="/blog/how-to-say-tehilim-for-healing" style={link}>
          How to Say Tehilim for Someone Who is Ill
        </Link>.
      </p>
    </div>
  );
}
