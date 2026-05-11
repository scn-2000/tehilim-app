import type { Metadata } from 'next';
import { categories } from '../../lib/categories';

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

// Priority order: most liturgically specific first, most general last
const CATEGORY_PRIORITY = [
  'hallel', 'shabbat', 'psalm-of-the-day', 'high-holidays',
  'hanukkah', 'passover', 'rosh-chodesh', 'healing', 'funeral',
  'protection', 'teshuva', 'gratitude', 'morning-psalms',
  'livelihood', 'wedding', 'shidduch', 'pregnancy', 'israel',
  'travel', 'times-of-need',
];

const THEME_LABEL: Record<string, string> = {
  hallel: 'Hallel',
  shabbat: 'Shabbat',
  'psalm-of-the-day': 'Psalm of the Day',
  'high-holidays': 'High Holidays',
  hanukkah: 'Hanukkah',
  passover: 'Passover',
  'rosh-chodesh': 'Rosh Chodesh',
  healing: 'Healing',
  funeral: 'Mourning',
  protection: 'Protection',
  teshuva: 'Repentance',
  gratitude: 'Gratitude',
  'morning-psalms': 'Morning Prayers',
  livelihood: 'Livelihood',
  wedding: 'Wedding',
  shidduch: 'Finding a Spouse',
  pregnancy: 'Pregnancy',
  israel: 'For Israel',
  travel: 'Travel',
  'times-of-need': 'Times of Need',
};

const CAT_CONTEXT: Record<string, string> = {
  hallel: 'as part of Hallel, the psalms of praise sung on Jewish holidays and Rosh Chodesh',
  shabbat: 'on Shabbat, during Kabbalat Shabbat and the morning service',
  'psalm-of-the-day': 'as the daily Levite Psalm (Shir Shel Yom) in the Temple service',
  'high-holidays': 'during Elul, Rosh Hashana, and Yom Kippur',
  hanukkah: 'on Hanukkah as a psalm of the Temple dedication',
  passover: 'at Passover, evoking the Exodus from Egypt',
  'rosh-chodesh': 'on Rosh Chodesh, the Jewish New Month',
  healing: 'when praying for healing and recovery (Refuah)',
  funeral: 'at funerals to comfort mourners and bring peace to the soul',
  protection: 'as a psalm of divine protection and safety (Shmirah)',
  teshuva: 'for repentance and returning to God (Teshuva)',
  gratitude: 'as a psalm of gratitude and thanksgiving to God',
  'morning-psalms': "in the daily morning service (Pesukei D'Zimra)",
  livelihood: 'when praying for livelihood and financial blessing (Parnassah)',
  wedding: 'at weddings to bless the bride and groom',
  shidduch: "when praying to find one's life partner",
  pregnancy: 'during pregnancy and when praying for a safe birth',
  israel: 'in times of difficulty facing the Jewish people and the Land of Israel',
  travel: 'before travel, as a prayer for divine protection on the journey',
  'times-of-need': 'in times of personal difficulty or need',
};

function getPsalmMeta(psalmNum: number) {
  let matchedSlug: string | null = null;
  for (const slug of CATEGORY_PRIORITY) {
    const cat = categories.find(c => c.slug === slug);
    if (cat?.psalms.includes(psalmNum)) { matchedSlug = slug; break; }
  }

  if (matchedSlug) {
    const theme = THEME_LABEL[matchedSlug];
    const context = CAT_CONTEXT[matchedSlug];
    return {
      title: `Psalm ${psalmNum} — ${theme} | TehilimForAll`,
      description: `Psalm ${psalmNum} is traditionally recited ${context}. Read in Hebrew with nikud, Sephardic phonetic transliteration, and English translation on TehilimForAll.`,
    };
  }

  return {
    title: `Psalm ${psalmNum} — Tehilim | TehilimForAll`,
    description: `Psalm ${psalmNum} is one of the 150 psalms of Tehilim, traditionally attributed to King David. Read in Hebrew with nikud, Sephardic phonetic transliteration, and English translation on TehilimForAll.`,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const psalmNum = parseInt(id, 10);
  const { title, description } = getPsalmMeta(psalmNum);

  return {
    title,
    description,
    alternates: {
      canonical: `https://tehilimforall.com/psalm/${psalmNum}`,
    },
    openGraph: {
      title,
      description,
      url: `https://tehilimforall.com/psalm/${psalmNum}`,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function PsalmLayout({ params, children }: Props) {
  const { id } = await params;
  const psalmNum = parseInt(id, 10);
  const { description } = getPsalmMeta(psalmNum);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    name: `Psalm ${psalmNum}`,
    description,
    inLanguage: ['he', 'en'],
    isPartOf: {
      '@type': 'WebSite',
      name: 'TehilimForAll',
      url: 'https://tehilimforall.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
