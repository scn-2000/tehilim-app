export interface Category {
  slug: string;
  title: string;
  description: string;
  psalms: number[];
}

export const BEFORE_READING_NOTE =
  "Before reading, many begin with a declaration of intent (L'shem yichud). When reading for someone else, mention their Hebrew name: [Name] ben/bat [Mother's name]. Conclude with a personal prayer in your own words.";

export const PSALM_OF_THE_DAY: Record<number, number> = {
  0: 24,
  1: 48,
  2: 82,
  3: 94,
  4: 81,
  5: 93,
  6: 92,
};

export const DAY_NAMES: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

export const categories: Category[] = [
  {
    slug: 'healing',
    title: 'For Healing (Refuah)',
    description: "Recited when praying for someone who is ill. Mention the person's Hebrew name (ben/bat their mother's name) before reading.",
    psalms: [6, 9, 13, 16, 17, 18, 20, 22, 23, 28, 30, 31, 32, 33, 37, 38, 39, 41, 49, 55, 56, 69, 86, 88, 89, 90, 91, 102, 103, 104, 107, 116, 118, 142, 143, 148],
  },
  {
    slug: 'funeral',
    title: 'For a Funeral / Burial (Levaya)',
    description: 'Recited in the presence of the deceased or at a funeral service, to bring comfort to the mourners and peace to the soul.',
    psalms: [23, 90, 91, 121, 130],
  },
  {
    slug: 'shabbat',
    title: 'Shabbat',
    description: 'Psalms traditionally recited on Shabbat, including Kabbalat Shabbat and the Shabbat morning service.',
    psalms: [29, 92, 93, 95, 96, 97, 98, 99, 100],
  },
  {
    slug: 'psalm-of-the-day',
    title: 'Psalm of the Day (Shir Shel Yom)',
    description: 'Each day of the week has a designated psalm, originally sung by the Levites in the Holy Temple during the morning sacrifice. Each psalm corresponds to a day of Creation. Sunday: 24, Monday: 48, Tuesday: 82, Wednesday: 94, Thursday: 81, Friday: 93, Shabbat: 92.',
    psalms: [24, 48, 81, 82, 92, 93, 94],
  },
  {
    slug: 'high-holidays',
    title: 'High Holidays (Elul, Rosh Hashana, Yom Kippur)',
    description: 'Psalm 27 is traditionally recited every day from Rosh Chodesh Elul through Hoshana Raba. Other psalms are recited during High Holiday services.',
    psalms: [27, 47, 81, 93, 113, 114, 115, 116, 117, 118],
  },
  {
    slug: 'hallel',
    title: 'Hallel (Holidays and Rosh Chodesh)',
    description: 'The Hallel psalms (113-118) are recited on Jewish holidays and Rosh Chodesh as songs of praise and gratitude to God.',
    psalms: [113, 114, 115, 116, 117, 118],
  },
  {
    slug: 'rosh-chodesh',
    title: 'Rosh Chodesh (New Month)',
    description: 'On the New Month, many communities recite the full Hallel and additional psalms of praise.',
    psalms: [104, 113, 114, 115, 116, 117, 118],
  },
  {
    slug: 'hanukkah',
    title: 'Hanukkah',
    description: 'Psalm 30 is the psalm of dedication of the Temple, recited on Hanukkah. The full Hallel is also said on all 8 days.',
    psalms: [30, 113, 114, 115, 116, 117, 118],
  },
  {
    slug: 'passover',
    title: 'Passover (Pesach)',
    description: 'Psalm 136 recounts the Exodus from Egypt and is traditionally connected to the Passover seder and service.',
    psalms: [113, 114, 115, 116, 117, 118, 136],
  },
  {
    slug: 'travel',
    title: 'For Travel (Tefillat HaDerech)',
    description: 'Recited before embarking on a journey for protection and safe travel.',
    psalms: [91, 121],
  },
  {
    slug: 'livelihood',
    title: 'For Livelihood (Parnassah)',
    description: 'Recited when seeking financial stability, success in business, or finding work.',
    psalms: [23, 67, 112, 128, 144, 145],
  },
  {
    slug: 'wedding',
    title: 'For a Wedding (Chatan and Kallah)',
    description: 'Recited in honor of a bride and groom, for a blessed and joyful marriage.',
    psalms: [45, 48, 84, 87, 128],
  },
  {
    slug: 'shidduch',
    title: 'For Finding a Spouse (Shidduch)',
    description: "Recited when praying to find one's life partner.",
    psalms: [32, 38, 70, 71, 121, 128],
  },
  {
    slug: 'pregnancy',
    title: 'For Pregnancy and Childbirth',
    description: 'Recited for a safe pregnancy, easy birth, and healthy mother and child.',
    psalms: [1, 2, 20, 22, 71, 91, 102, 107, 116, 128],
  },
  {
    slug: 'teshuva',
    title: 'For Teshuva (Repentance)',
    description: 'Recited when seeking to return to God and repair one\'s actions.',
    psalms: [6, 25, 32, 38, 51, 86, 90, 102, 130, 143],
  },
  {
    slug: 'israel',
    title: 'For Israel and the Jewish People',
    description: 'Recited in times of danger or difficulty facing the Jewish people or the Land of Israel.',
    psalms: [20, 44, 74, 79, 80, 83, 85, 102, 121, 122, 125, 126, 130, 137],
  },
  {
    slug: 'protection',
    title: 'For Protection (Shmirah)',
    description: 'Psalm 91 (Yoshev b\'seter) is the classic psalm of divine protection. Recited for personal safety and protection from harm.',
    psalms: [3, 20, 91, 121, 130, 142],
  },
  {
    slug: 'morning-psalms',
    title: 'Morning Psalms (Pesukei D\'Zimra)',
    description: 'These psalms form the Pesukei D\'Zimra section of the morning prayer service, recited daily to prepare the heart for prayer.',
    psalms: [19, 34, 90, 91, 92, 93, 100, 135, 136, 145, 146, 147, 148, 149, 150],
  },
  {
    slug: 'gratitude',
    title: 'Gratitude and Thanksgiving',
    description: 'Psalm 100 (Mizmor L\'Todah) is the classic psalm of gratitude. Recited to give thanks to God for His kindness.',
    psalms: [100, 118, 136],
  },
  {
    slug: 'times-of-need',
    title: 'General / Times of Need',
    description: 'A powerful general list for any time of difficulty or personal need, drawn from traditional sources.',
    psalms: [3, 6, 13, 16, 20, 22, 23, 27, 32, 41, 42, 51, 56, 59, 70, 77, 86, 88, 90, 102, 121, 128, 130, 137, 142, 143, 150],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}
