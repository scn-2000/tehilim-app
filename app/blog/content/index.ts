export interface ArticleColors {
  bg: string;
  textPrimary: string;
  textMuted: string;
  goldAccent: string;
  surface: string;
  border: string;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  excerpt: string;
}

export const ARTICLES: ArticleMeta[] = [
  {
    slug: 'how-to-say-tehilim-for-healing',
    title: 'How to Say Tehilim for Someone Who is Ill',
    description:
      'A practical guide to the Jewish practice of reciting Tehilim for healing — which psalms to say, how to dedicate the reading using a Hebrew name and mother\'s name, and the concept of zekhut (spiritual merit).',
    date: '2026-05-11',
    readingTime: '5 min read',
    excerpt:
      'Reciting Tehilim for someone who is ill is one of the most ancient expressions of Jewish communal care. Learn which psalms to recite, how to dedicate the reading, and how a group can say all 150 psalms together.',
  },
  {
    slug: 'what-is-collective-tehilim',
    title: 'What is a Collective Tehilim Reading?',
    description:
      'The tradition of dividing Tehilim among a community — the history of chevrot tehilim (psalm societies), when and why groups organize collective readings, and how TehilimForAll\'s feature makes it simple.',
    date: '2026-05-11',
    readingTime: '4 min read',
    excerpt:
      'Throughout Jewish history, communities have gathered to say Tehilim together when one of their members was in need. Learn about the chevra tehilim tradition and how to organize a collective reading.',
  },
  {
    slug: 'tehilim-book-of-psalms-guide',
    title: 'Tehilim: A Complete Guide to the Book of Psalms',
    description:
      'A comprehensive introduction to Tehilim — its authorship, five-book structure, role in daily Jewish prayer, the monthly reading cycle, the Psalm of the Day (Shir Shel Yom), and its significance in Sephardic tradition.',
    date: '2026-05-11',
    readingTime: '8 min read',
    excerpt:
      'Tehilim, the Book of Psalms, is one of the most universally beloved texts ever written — 150 poems spanning the full range of human experience, all expressed as a direct address to God.',
  },
];
