import Link from 'next/link';
import type { ArticleColors } from './index';

const FIVE_BOOKS = [
  { range: '1–41', num: 'I', theme: 'Largely Davidic. Themes of personal trust in God, suffering, and individual deliverance. Opens with the Torah-like "Happy is the man who did not walk in the counsel of the wicked" (Psalm 1) and closes with Psalm 41.' },
  { range: '42–72', num: 'II', theme: 'Psalms of Korah and Asaph, alongside Davidic psalms. Themes of national longing and lament. Includes the watershed Psalm 51 — David\'s profound prayer of repentance.' },
  { range: '73–89', num: 'III', theme: 'Predominantly Asaph and Korah psalms. Darker in tone — dealing with exile, the destruction of the Temple, and divine hiddenness. Psalm 73 opens with a profound wrestle with theodicy.' },
  { range: '90–106', num: 'IV', theme: 'Opens with the only psalm attributed to Moses (Psalm 90: "A prayer of Moses, the man of God"). Reflects on God\'s eternality against human frailty and explores themes of divine kingship.' },
  { range: '107–150', num: 'V', theme: 'A crescendo of praise. Includes Psalm 119 (the longest chapter in the entire Bible), the Songs of Ascent (120–134), and concludes with the five grand Hallelu-Yah psalms (146–150).' },
];

const PSALM_OF_DAY = [
  { day: 'Sunday', num: 24, verse: '"The earth is the Lord\'s and all that fills it, the world and its inhabitants"' },
  { day: 'Monday', num: 48, verse: '"Great is God and highly praised, in the city of our God, His holy mountain"' },
  { day: 'Tuesday', num: 82, verse: '"God stands in the congregation of the Almighty; He judges among the judges"' },
  { day: 'Wednesday', num: 94, verse: '"God of vengeance, Lord — God of vengeance, appear!"' },
  { day: 'Thursday', num: 81, verse: '"Sing joyously to God, our strength; call out to the God of Jacob"' },
  { day: 'Friday', num: 93, verse: '"God reigns; He has donned grandeur; God has donned might and girded Himself"' },
  { day: 'Shabbat', num: 92, verse: '"A psalm, a song for the Shabbat day"' },
];

export default function GuideContent({ colors }: { colors: ArticleColors }) {
  const { textPrimary, textMuted, goldAccent, surface, border } = colors;

  const h2 = { fontSize: '22px', fontWeight: '500' as const, color: textPrimary, marginBottom: '14px', marginTop: '40px', lineHeight: 1.3 };
  const h3 = { fontSize: '17px', fontWeight: '600' as const, color: textPrimary, marginBottom: '8px', marginTop: '24px' };
  const p = { fontSize: '16px', lineHeight: 1.85, color: textPrimary, marginBottom: '16px' };
  const link = { color: goldAccent, textDecoration: 'underline' as const, textUnderlineOffset: '2px' };

  return (
    <div>
      <p style={p}>
        Tehilim (תְּהִלִּים), the Book of Psalms, is one of the most universally beloved texts in human history.
        Known in Greek as the <em>Psalter</em>, it occupies a singular place in the Hebrew Bible (Tanakh) as the
        third section of the Ketuvim — the Writings. Its 150 poems span the full range of human experience: love
        and grief, gratitude and despair, triumph and exile, awe and accusation — all expressed as a direct,
        unmediated address to God.
      </p>
      <p style={p}>
        Unlike the Torah, which commands, or the Prophets, who rebuke and console, Tehilim speaks in a different
        direction: it is the human voice speaking <em>to</em> God. This is why, across Jewish communities of
        every background and tradition, Tehilim has become the default language of prayer in times of joy and
        in times of need. It does not require translation because the emotions it voices are already universal.
      </p>

      <h2 style={h2}>Authorship</h2>
      <p style={p}>
        According to tradition, Sefer Tehilim was compiled and largely authored by King David (דָּוִד הַמֶּלֶךְ),
        the shepherd-king-poet whose life — full of beauty, sin, suffering, and divine closeness — reads as a
        template for the full range of the human soul. The Talmud (Bava Batra 14b–15a) states that "David wrote
        the Book of Psalms with the help of ten elders," among them Adam, Moses, Asaph, and the Sons of Korah.
      </p>
      <p style={p}>
        Of the 150 psalms, 73 carry a superscription that includes David&apos;s name (<em>le-David</em>, "of David"
        or "by David"). Others are attributed to Asaph (12 psalms, Psalms 50 and 73–83), the Sons of Korah
        (11 psalms), Solomon (2 psalms: 72 and 127), Moses (1 psalm:{' '}
        <Link href="/psalm/90" style={link}>Psalm 90</Link>), Heman (1 psalm:{' '}
        <Link href="/psalm/88" style={link}>Psalm 88</Link>), and Ethan the Ezrahite (1 psalm:{' '}
        <Link href="/psalm/89" style={link}>Psalm 89</Link>). Some psalms carry no attribution — traditionally
        called the "orphan psalms."
      </p>
      <p style={p}>
        Tradition holds that even psalms not directly attributed to David were written with his spirit — that he
        was the <em>ne&apos;im zemirot Yisrael</em>, the "sweet singer of Israel" (2 Samuel 23:1), whose soul touched
        the full scope of human experience and gave voice to prayers that would resonate for all generations.
      </p>

      <h2 style={h2}>Structure: The Five Books</h2>
      <p style={p}>
        Tehilim is divided into five books — a structure the Midrash explicitly connects to the five books of
        the Torah. <em>Midrash Shocher Tov</em> states: "Moses gave Israel the five books of the Torah, and
        David gave Israel the five books of Tehilim." Each book concludes with a doxology — a verse of praise
        that marks the end of that section.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '28px' }}>
        {FIVE_BOOKS.map(({ num, range, theme }) => (
          <div key={num} style={{ background: surface, border: `1px solid ${border}`, borderRadius: '10px', padding: '16px 18px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ textAlign: 'center' as const, flexShrink: 0, minWidth: '56px' }}>
              <p style={{ fontSize: '11px', color: textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '2px' }}>Book</p>
              <p style={{ fontSize: '20px', fontWeight: '500', color: goldAccent }}>{num}</p>
              <p style={{ fontSize: '12px', color: textMuted }}>{range}</p>
            </div>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: textPrimary }}>{theme}</p>
          </div>
        ))}
      </div>

      <h2 style={h2}>Tehilim in Daily Jewish Prayer</h2>
      <p style={p}>
        Tehilim is not a book that sits on a shelf. It is woven through every major Jewish prayer service,
        recited daily by Jews around the world in the very words King David wrote thousands of years ago.
      </p>

      <h3 style={h3}>Pesukei D&apos;Zimra — Verses of Song</h3>
      <p style={p}>
        The opening section of the morning (Shacharit) service, recited daily, consists almost entirely of
        Tehilim. The core of <em>Pesukei D&apos;Zimra</em> includes Psalms{' '}
        <Link href="/psalm/145" style={link}>145</Link> through{' '}
        <Link href="/psalm/150" style={link}>150</Link>, along with other psalms added for Shabbat and
        holidays. The Talmud (Berakhot 32a) explains that these psalms are recited to "prepare the heart" before
        formal prayer — warming the soul with praise before bringing personal requests.
      </p>

      <h3 style={h3}>Hallel — Songs of Praise</h3>
      <p style={p}>
        On major holidays (Pesach, Shavuot, Sukkot, Hanukkah, Rosh Chodesh, and in many communities Yom
        Ha&apos;Atzmaut), the{' '}
        <Link href="/category/hallel" style={link}>Hallel psalms</Link>
        {' '}— Psalms 113–118 — are chanted as a collection of songs celebrating God&apos;s redemption and
        ongoing kindness. The word <em>hallelu-Yah</em> (praise God) appears repeatedly throughout these psalms,
        lending them an exuberant, communal character.
      </p>

      <h3 style={h3}>Kabbalat Shabbat</h3>
      <p style={p}>
        The Friday evening service welcoming{' '}
        <Link href="/category/shabbat" style={link}>Shabbat</Link>
        {' '}includes Psalms{' '}
        <Link href="/psalm/95" style={link}>95</Link> through{' '}
        <Link href="/psalm/99" style={link}>99</Link> and{' '}
        <Link href="/psalm/29" style={link}>Psalm 29</Link>, culminating in the poem{' '}
        <em>Lecha Dodi</em>. These psalms set the spiritual tone for the day of rest with themes of divine
        kingship and joy.
      </p>

      <h3 style={h3}>Psalm 27 — From Elul Through Hoshana Raba</h3>
      <p style={p}>
        <Link href="/psalm/27" style={link}>Psalm 27</Link> ("God is my light and my salvation — whom shall I
        fear?") is recited daily from Rosh Chodesh Elul (the month preceding Rosh Hashana) through Hoshana
        Raba (the final day of Sukkot) — spanning nearly two months of the Jewish calendar.
      </p>

      <h2 style={h2}>The Monthly Reading Cycle</h2>
      <p style={p}>
        The tradition of completing the entire book of Tehilim once a month is widespread across Jewish
        communities. The 150 psalms are divided into 30 daily portions — one for each day of the month.
        Many communities read the same daily portion together, so that collectively, all of Tehilim is
        always being recited.
      </p>
      <p style={p}>
        The monthly cycle can be found in the{' '}
        <Link href="/category/daily-tehilim" style={link}>Complete Tehilim in a Month</Link>
        {' '}category on TehilimForAll, where today&apos;s portion is highlighted.
      </p>

      <h2 style={h2}>Psalm of the Day — Shir Shel Yom</h2>
      <p style={p}>
        In the time of the Holy Temple (Beit HaMikdash) in Jerusalem, the Levites would sing a specific psalm
        each day of the week as accompaniment to the morning sacrifice (<em>tamid</em>). The Mishnah (Tamid
        7:4) records the exact assignment. This tradition is preserved to this day: at the end of the morning
        service, the <em>Shir Shel Yom</em> ("Song of the Day") is recited.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '28px' }}>
        {PSALM_OF_DAY.map(({ day, num, verse }) => (
          <div key={day} style={{ background: surface, border: `1px solid ${border}`, borderRadius: '8px', padding: '12px 16px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ minWidth: '80px', flexShrink: 0 }}>
              <p style={{ fontSize: '13px', color: textMuted, fontWeight: '600' }}>{day}</p>
              <Link href={`/psalm/${num}`} style={{ ...link, fontSize: '14px', fontWeight: '500' }}>Psalm {num}</Link>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: textMuted, fontStyle: 'italic' }}>{verse}</p>
          </div>
        ))}
      </div>

      <h2 style={h2}>Significance in Sephardic Tradition</h2>
      <p style={p}>
        In Sephardic communities — those whose traditions derive from Spain, North Africa (Moroccan, Algerian,
        Tunisian, Libyan), the Middle East (Iraqi, Syrian, Yemenite), and Turkey — the reading of Tehilim holds
        a place of particular centrality. Many Sephardic Jews recite the entire book on Erev Rosh Hashana;
        Moroccan communities have the tradition of completing Tehilim on Motzei Shabbat (Saturday night). Daily
        Tehilim reading, beyond what is required by the liturgy, is the norm rather than the exception.
      </p>
      <p style={p}>
        The Sephardic approach to the text is also distinctive: Sephardic Jews read Tehilim in the traditional
        Sephardic Hebrew pronunciation — the same pronunciation used in Modern Israeli Hebrew — with the vowel
        markings (<em>nikud</em>) shown clearly. This is the tradition TehilimForAll is built to support.
      </p>
      <p style={p}>
        All 150 psalms on TehilimForAll are available with the complete Hebrew text and nikud, alongside
        Sephardic phonetic transliteration for those learning the pronunciation, and an English translation (JPS)
        for those who want to understand the meaning as they read. The goal is simple: to make Tehilim accessible
        to every Jew, at every level of Hebrew knowledge, wherever they are.
      </p>
      <p style={{ ...p, color: textMuted, fontStyle: 'italic' }}>
        Ready to begin?{' '}
        <Link href="/" style={link}>Browse all 150 Psalms</Link>
        {' '}or explore the{' '}
        <Link href="/categories" style={link}>Categories</Link>
        {' '}to find psalms for any occasion.
      </p>
    </div>
  );
}
