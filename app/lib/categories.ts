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
    psalms: [24, 48, 82, 94, 81, 93, 92],
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
    title: 'For Travel',
    description: 'Psalms of protection recited before embarking on a journey for safe travel.',
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
    description: "Recited when seeking to return to God and repair one's actions.",
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
    description: "Psalm 91 (Yoshev b'seter) is the classic psalm of divine protection. Recited for personal safety and protection from harm.",
    psalms: [3, 20, 91, 121, 130, 142],
  },
  {
    slug: 'morning-psalms',
    title: "Morning Psalms (Pesukei D'Zimra)",
    description: "These psalms form the Pesukei D'Zimra section of the morning prayer service, recited daily to prepare the heart for prayer.",
    psalms: [19, 34, 90, 91, 92, 93, 100, 135, 136, 145, 146, 147, 148, 149, 150],
  },
  {
    slug: 'gratitude',
    title: 'Gratitude and Thanksgiving',
    description: "Psalm 100 (Mizmor L'Todah) is the classic psalm of gratitude. Recited to give thanks to God for His kindness.",
    psalms: [100, 118, 136],
  },
  {
    slug: 'times-of-need',
    title: 'General / Times of Need',
    description: 'A powerful general list for any time of difficulty or personal need, drawn from traditional sources.',
    psalms: [3, 6, 13, 16, 20, 22, 23, 27, 32, 41, 42, 51, 56, 59, 70, 77, 86, 88, 90, 102, 121, 128, 130, 137, 142, 143, 150],
  },
];

type LocaleKey = 'fr' | 'es' | 'nl';
type LocaleTranslation = { title: string; description: string };

const categoryTranslations: Record<string, Partial<Record<LocaleKey, LocaleTranslation>>> = {
  healing: {
    fr: { title: 'Pour la guérison (Refouah)', description: "Récités lors d'une prière pour une personne malade. Mentionnez le nom hébreu de la personne (ben/bat le nom de sa mère) avant la lecture." },
    es: { title: 'Para la curación (Refuá)', description: 'Recitados al rezar por alguien enfermo. Mencione el nombre hebreo de la persona (ben/bat nombre de la madre) antes de leer.' },
    nl: { title: 'Voor genezing (Refuah)', description: 'Gereciteerd bij het bidden voor iemand die ziek is. Noem de Hebreeuwse naam van de persoon (ben/bat naam moeder) voor het lezen.' },
  },
  funeral: {
    fr: { title: 'Pour un enterrement (Levaya)', description: "Récités en présence du défunt ou lors d'un service funèbre, pour apporter réconfort aux endeuillés et paix à l'âme." },
    es: { title: 'Para un funeral (Levaiyá)', description: 'Recitados en presencia del difunto o en un servicio fúnebre, para consolar a los dolientes y dar paz al alma.' },
    nl: { title: 'Voor een begrafenis (Levaya)', description: 'Gereciteerd in aanwezigheid van de overledene of bij een begrafenisdienst, om de rouwenden te troosten en de ziel vrede te geven.' },
  },
  shabbat: {
    fr: { title: 'Chabbat', description: 'Psaumes traditionnellement récités le Chabbat, incluant Kabbalat Chabbat et le service du matin.' },
    es: { title: 'Shabat', description: 'Salmos recitados tradicionalmente en Shabat, incluyendo Kabalat Shabat y el servicio de la mañana.' },
    nl: { title: 'Shabbat', description: 'Psalmen die traditioneel op Shabbat worden gereciteerd, inclusief Kabalat Shabbat en de ochtendservice.' },
  },
  'psalm-of-the-day': {
    fr: { title: 'Psaume du jour (Shir Shel Yom)', description: 'Chaque jour a un psaume désigné, chanté à l\'origine par les Lévites dans le Saint Temple. Dimanche: 24, Lundi: 48, Mardi: 82, Mercredi: 94, Jeudi: 81, Vendredi: 93, Chabbat: 92.' },
    es: { title: 'Salmo del día (Shir Shel Yom)', description: 'Cada día tiene un salmo designado, cantado por los Levitas en el Templo Sagrado. Domingo: 24, Lunes: 48, Martes: 82, Miércoles: 94, Jueves: 81, Viernes: 93, Shabat: 92.' },
    nl: { title: 'Psalm van de dag (Shir Shel Yom)', description: 'Elke dag heeft een aangewezen psalm, gezongen door de Levieten in de Heilige Tempel. Zondag: 24, Maandag: 48, Dinsdag: 82, Woensdag: 94, Donderdag: 81, Vrijdag: 93, Shabbat: 92.' },
  },
  'high-holidays': {
    fr: { title: 'Grandes Fêtes (Eloul, Roch Hachana, Yom Kippour)', description: "Le Psaume 27 est récité chaque jour de Roch Hodech Eloul à Hochana Raba. D'autres psaumes sont récités lors des services des Grandes Fêtes." },
    es: { title: 'Festividades importantes (Elul, Rosh Hashaná, Yom Kipur)', description: 'El Salmo 27 se recita diariamente de Rosh Jodesh Elul a Hoshaná Rabá. Otros salmos se recitan en los servicios de las festividades.' },
    nl: { title: 'Hoge Feestdagen (Eloel, Rosj Hasjana, Jom Kipoer)', description: 'Psalm 27 wordt dagelijks gereciteerd van Rosj Chodesj Eloel tot Hosjana Raba. Andere psalmen worden gereciteerd tijdens de Hoge Feestdagendiensten.' },
  },
  hallel: {
    fr: { title: 'Hallel (Fêtes et Roch Hodech)', description: 'Les psaumes du Hallel (113-118) sont récités lors des fêtes juives et de Roch Hodech en chants de louange à Dieu.' },
    es: { title: 'Halel (Festividades y Rosh Jodesh)', description: 'Los salmos del Halel (113-118) se recitan en festividades judías y Rosh Jodesh como cantos de alabanza a Dios.' },
    nl: { title: 'Hallel (Feestdagen en Rosj Chodesj)', description: 'De Hallel-psalmen (113-118) worden gereciteerd op Joodse feestdagen en Rosj Chodesj als lofzangen aan God.' },
  },
  'rosh-chodesh': {
    fr: { title: 'Roch Hodech (Nouvelle lune)', description: 'Au Roch Hodech, de nombreuses communautés récitent le Hallel complet et des psaumes supplémentaires de louange.' },
    es: { title: 'Rosh Jodesh (Mes nuevo)', description: 'En Rosh Jodesh, muchas comunidades recitan el Halel completo y salmos adicionales de alabanza.' },
    nl: { title: 'Rosj Chodesj (Nieuwe Maand)', description: 'Op Rosj Chodesj reciteert men in veel gemeenschappen de volledige Hallel en aanvullende lofpsalmen.' },
  },
  hanukkah: {
    fr: { title: 'Hanoukka', description: 'Le Psaume 30 est le psaume de la dédicace du Temple, récité à Hanoukka. Le Hallel complet est dit les 8 jours.' },
    es: { title: 'Janucá', description: 'El Salmo 30 es el salmo de la dedicación del Templo, recitado en Janucá. El Halel completo también se recita los 8 días.' },
    nl: { title: 'Chanoeka', description: 'Psalm 30 is de psalm van de tempelwijding, gereciteerd op Chanoeka. De volledige Hallel wordt ook alle 8 dagen gezegd.' },
  },
  passover: {
    fr: { title: "Pessa'h", description: "Le Psaume 136 relate la sortie d'Égypte et est traditionnellement lié au séder et au service de Pessa'h." },
    es: { title: 'Pésaj', description: 'El Salmo 136 relata el Éxodo de Egipto y está vinculado al séder y al servicio de Pésaj.' },
    nl: { title: 'Pesach', description: 'Psalm 136 beschrijft de Uittocht uit Egypte en is traditioneel verbonden aan de Pesach-seder.' },
  },
  travel: {
    fr: { title: 'Pour le voyage', description: 'Psaumes de protection récités avant de partir en voyage pour un voyage en sécurité.' },
    es: { title: 'Para el viaje', description: 'Salmos de protección recitados antes de emprender un viaje para viajar seguro.' },
    nl: { title: 'Voor de reis', description: 'Beschermingspsalmen gereciteerd voor vertrek op reis voor veilig reizen.' },
  },
  livelihood: {
    fr: { title: 'Pour la subsistance (Parnassa)', description: 'Récité pour la stabilité financière, le succès professionnel ou la recherche d\'emploi.' },
    es: { title: 'Para el sustento (Parnasá)', description: 'Recitado al buscar estabilidad financiera, éxito en los negocios o trabajo.' },
    nl: { title: 'Voor levensonderhoud (Parnassah)', description: 'Gereciteerd bij het zoeken naar financiële stabiliteit, zakelijk succes of werk.' },
  },
  wedding: {
    fr: { title: 'Pour un mariage (Hatan et Kalla)', description: 'Récités en l\'honneur de la mariée et du marié, pour un mariage béni et joyeux.' },
    es: { title: 'Para una boda (Jatán y Kalá)', description: 'Recitados en honor de la novia y el novio, para un matrimonio bendecido y alegre.' },
    nl: { title: 'Voor een bruiloft (Chatan en Kallah)', description: 'Gereciteerd ter ere van bruid en bruidegom, voor een gezegend en vreugdevol huwelijk.' },
  },
  shidduch: {
    fr: { title: 'Pour trouver un conjoint (Chiddoukh)', description: 'Récités pour prier de trouver son âme sœur.' },
    es: { title: 'Para encontrar pareja (Shiduj)', description: 'Recitados al pedir encontrar a su cónyuge.' },
    nl: { title: 'Voor het vinden van een huwelijkspartner (Shidduch)', description: 'Gereciteerd bij het bidden om de levenspartner te vinden.' },
  },
  pregnancy: {
    fr: { title: "Pour la grossesse et l'accouchement", description: 'Récités pour une grossesse sereine, un accouchement facile et une mère et un enfant en bonne santé.' },
    es: { title: 'Para el embarazo y el parto', description: 'Recitados para un embarazo seguro, parto fácil y madre e hijo saludables.' },
    nl: { title: 'Voor zwangerschap en bevalling', description: 'Gereciteerd voor een veilige zwangerschap, vlotte bevalling en gezonde moeder en kind.' },
  },
  teshuva: {
    fr: { title: 'Pour la téchouva (repentir)', description: 'Récités pour revenir vers Dieu et réparer ses actes.' },
    es: { title: 'Para la teshuvá (arrepentimiento)', description: 'Recitados para volver a Dios y reparar las propias acciones.' },
    nl: { title: 'Voor Tesjoeva (berouw)', description: 'Gereciteerd bij het terugkeren naar God en het herstellen van eigen daden.' },
  },
  israel: {
    fr: { title: 'Pour Israël et le peuple juif', description: "Récités en temps de danger ou de difficulté pour le peuple juif ou la Terre d'Israël." },
    es: { title: 'Para Israel y el pueblo judío', description: 'Recitados en tiempos de peligro o dificultad para el pueblo judío o la Tierra de Israel.' },
    nl: { title: 'Voor Israël en het Joodse volk', description: 'Gereciteerd in tijden van gevaar of moeilijkheden voor het Joodse volk of het Land Israël.' },
  },
  protection: {
    fr: { title: 'Pour la protection (Chmirah)', description: 'Le Psaume 91 est le psaume classique de la protection divine. Récité pour la sécurité personnelle.' },
    es: { title: 'Para la protección (Shmirah)', description: 'El Salmo 91 es el salmo clásico de protección divina. Recitado para la seguridad personal.' },
    nl: { title: 'Voor bescherming (Shmirah)', description: 'Psalm 91 is de klassieke psalm van goddelijke bescherming. Gereciteerd voor persoonlijke veiligheid.' },
  },
  'morning-psalms': {
    fr: { title: "Psaumes du matin (Pésouké deZimra)", description: 'Ces psaumes forment la section Pésouké deZimra du service du matin, récités quotidiennement pour préparer le cœur à la prière.' },
    es: { title: 'Salmos de la mañana (Pesukei deZimrá)', description: 'Estos salmos forman la sección Pesukei deZimrá del servicio matutino, recitados diariamente para preparar el corazón.' },
    nl: { title: 'Ochtendpsalmen (Pesoekei deZimra)', description: 'Deze psalmen vormen de Pesoekei deZimra-sectie van de ochtendgebedsservice, dagelijks gereciteerd om het hart voor te bereiden.' },
  },
  gratitude: {
    fr: { title: 'Gratitude et action de grâce', description: "Le Psaume 100 est le psaume classique de la gratitude. Récité pour remercier Dieu de Sa bonté." },
    es: { title: 'Gratitud y acción de gracias', description: 'El Salmo 100 es el salmo clásico de gratitud. Recitado para dar gracias a Dios por Su bondad.' },
    nl: { title: 'Dankbaarheid en lofprijzing', description: 'Psalm 100 is de klassieke psalm van dankbaarheid. Gereciteerd om God dank te zeggen voor Zijn goedheid.' },
  },
  'times-of-need': {
    fr: { title: 'Général / En temps de besoin', description: 'Une liste générale pour tout moment de difficulté ou de besoin personnel, tirée de sources traditionnelles.' },
    es: { title: 'General / En tiempos de necesidad', description: 'Una lista general poderosa para cualquier momento de dificultad o necesidad personal, de fuentes tradicionales.' },
    nl: { title: 'Algemeen / In tijden van nood', description: 'Een krachtige algemene lijst voor elk moment van moeilijkheid of persoonlijke behoefte, uit traditionele bronnen.' },
  },
};

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getLocalizedCategory(cat: Category, locale: string): { title: string; description: string } {
  if (locale === 'en') return { title: cat.title, description: cat.description };
  const trans = categoryTranslations[cat.slug];
  const localeData = trans?.[locale as LocaleKey];
  if (localeData) return localeData;
  return { title: cat.title, description: cat.description };
}
