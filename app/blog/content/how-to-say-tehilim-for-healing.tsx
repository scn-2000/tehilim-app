import Link from 'next/link';
import type { ArticleColors } from './index';

const HEALING_PSALMS = [
  {
    num: 20,
    name: 'La-menatzeach',
    desc: '"May God answer you on a day of distress; may the name of Jacob\'s God safeguard you." A prayer that God intervene on behalf of someone in need.',
  },
  {
    num: 23,
    name: 'Mizmor le-David',
    desc: 'The beloved shepherd psalm — "Though I walk in the valley of the shadow of death, I fear no evil, for You are with me." Read at times of great vulnerability and fear.',
  },
  {
    num: 121,
    name: 'Shir la-ma\'alot',
    desc: '"I lift my eyes to the mountains; from where will my help come? My help comes from God, Maker of heaven and earth." A psalm of divine guardianship and unwavering protection.',
  },
  {
    num: 130,
    name: 'Shir ha-ma\'alot',
    desc: '"From the depths I called to You, O Lord." A prayer of supplication from a place of desperate need, recited for healing and for the peace of the soul.',
  },
  {
    num: 142,
    name: 'Maskil le-David',
    desc: '"I pour out my complaint before Him; I tell my trouble before Him." A personal, raw cry for help in a time of affliction — David speaking from a place of isolation.',
  },
];

export default function HealingContent({ colors }: { colors: ArticleColors }) {
  const { textPrimary, textMuted, goldAccent, surface, border } = colors;

  const h2 = { fontSize: '22px', fontWeight: '500' as const, color: textPrimary, marginBottom: '14px', marginTop: '40px', lineHeight: 1.3 };
  const p = { fontSize: '16px', lineHeight: 1.85, color: textPrimary, marginBottom: '16px' };
  const link = { color: goldAccent, textDecoration: 'underline' as const, textUnderlineOffset: '2px' };
  const muted = { color: textMuted };

  return (
    <div>
      <p style={p}>
        Reciting Tehilim for someone who is ill — known as saying Tehilim for a <em>choleh</em> (חולה) — is one of the most ancient
        expressions of Jewish communal care. The belief that our prayers, especially those of King David, carry
        spiritual weight to aid someone in their time of need is found throughout Jewish literature, from the
        Talmud to the responsa of the greatest authorities.
      </p>
      <p style={p}>
        Unlike formal liturgy, Tehilim requires no synagogue, no quorum, and no particular time of day. You can
        say these psalms anywhere, at any moment, for anyone — which is precisely why this practice has endured
        across communities, continents, and centuries.
      </p>

      <h2 style={h2}>Which Psalms to Recite</h2>
      <p style={p}>
        The{' '}
        <Link href="/category/healing" style={link}>healing category</Link>
        {' '}on TehilimForAll includes 36 psalms traditionally connected to refuah (healing). For a focused
        reading — especially when time is limited — the following five are most commonly cited:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px', marginBottom: '28px' }}>
        {HEALING_PSALMS.map(({ num, name, desc }) => (
          <div key={num} style={{ background: surface, border: `1px solid ${border}`, borderRadius: '10px', padding: '16px 18px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <Link href={`/psalm/${num}`} style={{ ...link, fontSize: '20px', fontWeight: '500', flexShrink: 0, minWidth: '48px', textAlign: 'center' as const, paddingTop: '2px' }}>
              {num}
            </Link>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: textMuted, marginBottom: '4px', letterSpacing: '0.03em' }}>{name}</p>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: textPrimary }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p style={p}>
        Many people also read{' '}
        <Link href="/psalm/6" style={link}>Psalm 6</Link>
        {' '}(the opening psalm of the healing category, a cry for God&apos;s mercy in illness) and{' '}
        <Link href="/psalm/91" style={link}>Psalm 91</Link>
        {' '}(<em>Yoshev be-seter</em> — "He who dwells in the shelter of the Most High"), which speaks of
        divine protection from illness and danger.
      </p>

      <h2 style={h2}>How to Dedicate the Reading</h2>
      <p style={p}>
        Before beginning, it is customary to state the name of the person you are praying for. The traditional
        formula is:
      </p>

      <div style={{ background: surface, borderLeft: `3px solid ${goldAccent}`, borderRadius: '6px', padding: '18px 22px', marginBottom: '20px' }}>
        <p style={{ fontSize: '15px', color: textMuted, marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, fontWeight: '600', fontSize: '11px' as unknown as string }}>
          Dedication formula
        </p>
        <p style={{ fontSize: '17px', lineHeight: 1.7, color: textPrimary, marginBottom: '8px' }}>
          <em>Li-refuat [Hebrew name] ben/bat [mother&apos;s Hebrew name]</em>
        </p>
        <p style={{ fontSize: '14px', color: textMuted, lineHeight: 1.6 }}>
          "For the healing of [name], son/daughter of [mother&apos;s name]"
        </p>
        <p style={{ fontSize: '14px', color: textMuted, lineHeight: 1.6, marginTop: '6px' }}>
          Example: <em>Li-refuat Miriam bat Sarah</em> — "For the healing of Miriam daughter of Sarah"
        </p>
      </div>

      <p style={p}>
        The use of the mother&apos;s name in this context is traditional — as the Zohar teaches, in matters of
        prayer for another, a person is identified through their mother (<em>mitoch binah ve-rachamim</em> —
        from a place of understanding and mercy).
      </p>
      <p style={p}>
        If you do not know the person&apos;s Hebrew name, you may say{' '}
        <em>li-refuat [given name] ben/bat Sarah Imenu</em> — "son or daughter of our foremother Sarah."
        Many authorities hold that this dedication is fully effective even in this form.
      </p>

      <h2 style={h2}>Zekhut — The Merit of the Reading</h2>
      <p style={p}>
        The concept of <em>zekhut</em> (זְכוּת) — spiritual merit — is central to understanding why this
        practice matters. When we perform a mitzvah — such as reading Tehilim — with the explicit intention of
        benefiting another person, the spiritual merit of that act can be transferred to them. This is not a
        mystical transaction but a deeply held theological understanding: the interconnectedness of all Jewish
        souls, and the power of sincere intention.
      </p>
      <p style={p}>
        The Talmud (Bava Batra 116a) states: <em>"Whoever prays on behalf of his fellow while he himself needs
        the same thing — he is answered first."</em> Saying Tehilim for another is an act of selfless prayer
        that, according to our tradition, benefits both the person in need and the one who reads.
      </p>

      <h2 style={h2}>Reading as a Group</h2>
      <p style={p}>
        One of the most powerful expressions of communal prayer for the sick is the <em>collective</em> Tehilim
        reading — where an entire community divides the 150 psalms among its members, so that the whole book is
        completed at once. This practice has deep roots in Jewish communal life (see{' '}
        <Link href="/blog/what-is-collective-tehilim" style={link}>our article on collective readings</Link>).
      </p>
      <p style={p}>
        TehilimForAll&apos;s{' '}
        <Link href="/collective" style={link}>Collective Reading feature</Link>
        {' '}makes this straightforward: create a reading, assign the person&apos;s name, share a link with
        your community, and let each member claim and complete their portion. When all 150 psalms are covered,
        the entire Tehilim has been said — a powerful communal act of prayer on behalf of someone who needs it.
      </p>
    </div>
  );
}
