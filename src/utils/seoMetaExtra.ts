// Localized SEO titles/descriptions for pages that are not covered by the
// keyword-optimized set in seoMetaTranslations.ts. Same rules apply:
// titles <= 60 characters, descriptions <= 160 characters, one entry per locale.
// After editing, run `bun scripts/build-i18n.ts` (also part of `bun run build`) so the per-language dictionaries the browser reads are regenerated.
import type { PageMeta } from './seoMetaSource';

type PageMetaByLocale = Record<string, PageMeta>;

const PROPERTY_WIZARD: PageMetaByLocale = {
  en: { title: 'Property Finder Wizard | Find Your Home Abroad', description: 'Answer a few quick questions and get a personal shortlist of apartments and villas for sale in Turkey, Dubai, Cyprus and Bali that match your budget.' },
  sv: { title: 'Bostadsguide | Hitta din bostad utomlands', description: 'Svara på några snabba frågor och få en personlig lista med lägenheter och villor till salu i Turkiet, Dubai, Cypern och Bali inom din budget.' },
  no: { title: 'Boligveiviser | Finn din bolig i utlandet', description: 'Svar på noen raske spørsmål og få en personlig liste over leiligheter og villaer til salgs i Tyrkia, Dubai, Kypros og Bali innenfor budsjettet ditt.' },
  da: { title: 'Boligguide | Find din bolig i udlandet', description: 'Svar på nogle hurtige spørgsmål og få en personlig liste over lejligheder og villaer til salg i Tyrkiet, Dubai, Cypern og Bali inden for dit budget.' },
  de: { title: 'Immobilien-Finder | Ihr Zuhause im Ausland', description: 'Beantworten Sie ein paar Fragen und erhalten Sie passende Wohnungen und Villen zum Kauf in der Türkei, Dubai, Zypern und auf Bali – passend zum Budget.' },
  fr: { title: 'Assistant immobilier | Trouvez votre bien', description: 'Répondez à quelques questions et recevez une sélection d’appartements et de villas à vendre en Turquie, à Dubaï, à Chypre et à Bali selon votre budget.' },
  es: { title: 'Buscador de propiedades | Tu casa en el extranjero', description: 'Responde unas preguntas rápidas y recibe una selección personal de pisos y villas en venta en Turquía, Dubái, Chipre y Bali que encajan con tu presupuesto.' },
  tr: { title: 'Emlak Sihirbazı | Yurt Dışında Evinizi Bulun', description: 'Birkaç kısa soruyu yanıtlayın; Türkiye, Dubai, Kıbrıs ve Bali’de bütçenize uygun satılık daire ve villalardan oluşan kişisel listenizi alın.' },
  ru: { title: 'Подбор недвижимости | Ваш дом за рубежом', description: 'Ответьте на несколько вопросов и получите персональную подборку квартир и вилл в Турции, Дубае, на Кипре и Бали в рамках вашего бюджета.' },
  ar: { title: 'معالج العقارات | اعثر على منزلك في الخارج', description: 'أجب عن بضعة أسئلة سريعة واحصل على قائمة شخصية بالشقق والفلل المعروضة للبيع في تركيا ودبي وقبرص وبالي بما يناسب ميزانيتك.' },
  fa: { title: 'دستیار انتخاب ملک | خانه خود را در خارج پیدا کنید', description: 'به چند سؤال کوتاه پاسخ دهید و فهرستی شخصی از آپارتمان‌ها و ویلاهای فروشی در ترکیه، دبی، قبرس و بالی متناسب با بودجه خود دریافت کنید.' },
  ur: { title: 'پراپرٹی وزرڈ | بیرونِ ملک اپنا گھر تلاش کریں', description: 'چند آسان سوالوں کے جواب دیں اور ترکی، دبئی، قبرص اور بالی میں اپنے بجٹ کے مطابق فروخت کے لیے اپارٹمنٹس اور ولاز کی ذاتی فہرست حاصل کریں۔' },
  id: { title: 'Wizard Properti | Temukan Rumah di Luar Negeri', description: 'Jawab beberapa pertanyaan singkat dan dapatkan daftar apartemen dan vila dijual di Turki, Dubai, Siprus, dan Bali yang sesuai dengan anggaran Anda.' },
};

const AI_PROPERTY_SEARCH: PageMetaByLocale = {
  en: { title: 'AI Property Search | Ask Emma About Homes Abroad', description: 'Describe your dream home and our AI assistant searches every listing in Turkey, Dubai, Cyprus and Bali — with prices, districts and buying advice.' },
  sv: { title: 'AI-bostadssök | Fråga Emma om bostäder utomlands', description: 'Beskriv din drömbostad så söker vår AI-assistent bland alla bostäder i Turkiet, Dubai, Cypern och Bali – med priser, områden och köpråd.' },
  no: { title: 'AI-boligsøk | Spør Emma om boliger i utlandet', description: 'Beskriv drømmeboligen din, så søker AI-assistenten vår i alle boliger i Tyrkia, Dubai, Kypros og Bali – med priser, områder og kjøpsråd.' },
  da: { title: 'AI-boligsøgning | Spørg Emma om boliger i udlandet', description: 'Beskriv din drømmebolig, så søger vores AI-assistent i alle boliger i Tyrkiet, Dubai, Cypern og Bali – med priser, områder og købsråd.' },
  de: { title: 'KI-Immobiliensuche | Fragen Sie Emma', description: 'Beschreiben Sie Ihr Traumhaus – unsere KI durchsucht alle Angebote in der Türkei, Dubai, Zypern und auf Bali, mit Preisen, Lagen und Kaufberatung.' },
  fr: { title: 'Recherche immobilière IA | Demandez à Emma', description: 'Décrivez la maison de vos rêves : notre assistante IA parcourt tous les biens en Turquie, à Dubaï, à Chypre et à Bali, avec prix, quartiers et conseils.' },
  es: { title: 'Búsqueda de propiedades con IA | Pregunta a Emma', description: 'Describe la casa de tus sueños y nuestra asistente IA busca en todos los inmuebles de Turquía, Dubái, Chipre y Bali, con precios, zonas y consejos.' },
  tr: { title: 'Yapay Zekâ ile Emlak Arama | Emma’ya Sorun', description: 'Hayalinizdeki evi anlatın; yapay zekâ asistanımız Türkiye, Dubai, Kıbrıs ve Bali’deki tüm ilanları fiyat, bölge ve satın alma tavsiyesiyle tarasın.' },
  ru: { title: 'ИИ-поиск недвижимости | Спросите Эмму', description: 'Опишите дом мечты, и наш ИИ-ассистент найдёт подходящие объекты в Турции, Дубае, на Кипре и Бали — с ценами, районами и советами по покупке.' },
  ar: { title: 'البحث العقاري بالذكاء الاصطناعي | اسأل إيما', description: 'صف منزل أحلامك وستبحث مساعدتنا الذكية في جميع العقارات في تركيا ودبي وقبرص وبالي مع الأسعار والمناطق ونصائح الشراء.' },
  fa: { title: 'جستجوی ملک با هوش مصنوعی | از اِما بپرسید', description: 'خانه رویایی خود را توصیف کنید تا دستیار هوشمند ما همه املاک ترکیه، دبی، قبرس و بالی را با قیمت، منطقه و مشاوره خرید جستجو کند.' },
  ur: { title: 'اے آئی پراپرٹی سرچ | ایما سے پوچھیں', description: 'اپنے خوابوں کے گھر کی تفصیل بتائیں، ہماری اے آئی اسسٹنٹ ترکی، دبئی، قبرص اور بالی کی تمام پراپرٹیز قیمت، علاقے اور مشورے کے ساتھ تلاش کرے گی۔' },
  id: { title: 'Pencarian Properti AI | Tanya Emma', description: 'Jelaskan rumah impian Anda dan asisten AI kami mencari semua listing di Turki, Dubai, Siprus, dan Bali lengkap dengan harga, kawasan, dan saran membeli.' },
};

const MAP_SEARCH: PageMetaByLocale = {
  en: { title: 'Property Map Search | Homes for Sale on the Map', description: 'Browse apartments and villas for sale in Turkey, Dubai, Cyprus and Bali on an interactive map. Filter by price, bedrooms and district.' },
  sv: { title: 'Kartsökning | Bostäder till salu på kartan', description: 'Utforska lägenheter och villor till salu i Turkiet, Dubai, Cypern och Bali på en interaktiv karta. Filtrera på pris, sovrum och område.' },
  no: { title: 'Kartsøk | Boliger til salgs på kartet', description: 'Se leiligheter og villaer til salgs i Tyrkia, Dubai, Kypros og Bali på et interaktivt kart. Filtrer på pris, soverom og område.' },
  da: { title: 'Kortsøgning | Boliger til salg på kortet', description: 'Se lejligheder og villaer til salg i Tyrkiet, Dubai, Cypern og Bali på et interaktivt kort. Filtrér efter pris, soveværelser og område.' },
  de: { title: 'Kartensuche | Immobilien zum Kauf auf der Karte', description: 'Wohnungen und Villen zum Kauf in der Türkei, Dubai, Zypern und auf Bali auf einer interaktiven Karte. Filter nach Preis, Zimmern und Lage.' },
  fr: { title: 'Recherche sur carte | Biens à vendre', description: 'Parcourez appartements et villas à vendre en Turquie, à Dubaï, à Chypre et à Bali sur une carte interactive. Filtrez par prix, chambres et quartier.' },
  es: { title: 'Búsqueda en mapa | Propiedades en venta', description: 'Explora pisos y villas en venta en Turquía, Dubái, Chipre y Bali en un mapa interactivo. Filtra por precio, dormitorios y zona.' },
  tr: { title: 'Haritada Emlak Arama | Satılık Evler', description: 'Türkiye, Dubai, Kıbrıs ve Bali’deki satılık daire ve villaları etkileşimli haritada inceleyin. Fiyat, oda sayısı ve bölgeye göre filtreleyin.' },
  ru: { title: 'Поиск на карте | Недвижимость на продажу', description: 'Квартиры и виллы на продажу в Турции, Дубае, на Кипре и Бали на интерактивной карте. Фильтры по цене, спальням и району.' },
  ar: { title: 'البحث على الخريطة | عقارات للبيع', description: 'تصفح الشقق والفلل المعروضة للبيع في تركيا ودبي وقبرص وبالي على خريطة تفاعلية، مع التصفية حسب السعر وعدد الغرف والمنطقة.' },
  fa: { title: 'جستجو روی نقشه | املاک فروشی', description: 'آپارتمان‌ها و ویلاهای فروشی ترکیه، دبی، قبرس و بالی را روی نقشه تعاملی ببینید و بر اساس قیمت، تعداد اتاق و منطقه فیلتر کنید.' },
  ur: { title: 'نقشے پر پراپرٹی تلاش کریں | برائے فروخت', description: 'ترکی، دبئی، قبرص اور بالی میں فروخت کے لیے اپارٹمنٹس اور ولاز انٹرایکٹو نقشے پر دیکھیں۔ قیمت، بیڈروم اور علاقے کے لحاظ سے فلٹر کریں۔' },
  id: { title: 'Cari Properti di Peta | Rumah Dijual', description: 'Jelajahi apartemen dan vila dijual di Turki, Dubai, Siprus, dan Bali di peta interaktif. Saring berdasarkan harga, kamar tidur, dan kawasan.' },
};

const DESIGN_YOUR_HOME: PageMetaByLocale = {
  en: { title: 'Design Your Home | AI Interior Design', description: 'Reimagine any home in seconds. Pick a property, choose a photo, describe your style and let AI redesign the interior before you buy.' },
  sv: { title: 'Designa ditt hem | AI-inredning', description: 'Förnya valfri bostad på några sekunder. Välj en bostad och en bild, beskriv din stil och låt AI inreda rummet innan du köper.' },
  no: { title: 'Design hjemmet ditt | AI-interiør', description: 'Forny en hvilken som helst bolig på sekunder. Velg bolig og bilde, beskriv stilen din og la AI innrede rommet før du kjøper.' },
  da: { title: 'Design dit hjem | AI-indretning', description: 'Forny enhver bolig på få sekunder. Vælg bolig og billede, beskriv din stil, og lad AI indrette rummet, før du køber.' },
  de: { title: 'Gestalten Sie Ihr Zuhause | KI-Interior-Design', description: 'Gestalten Sie jede Immobilie in Sekunden neu: Objekt und Foto wählen, Stil beschreiben und die KI richtet den Raum vor dem Kauf ein.' },
  fr: { title: 'Décorez votre maison | Design d’intérieur IA', description: 'Réinventez n’importe quel bien en quelques secondes : choisissez une photo, décrivez votre style et laissez l’IA aménager la pièce avant d’acheter.' },
  es: { title: 'Diseña tu hogar | Interiorismo con IA', description: 'Reimagina cualquier vivienda en segundos: elige una propiedad y una foto, describe tu estilo y deja que la IA decore el espacio antes de comprar.' },
  tr: { title: 'Evinizi Tasarlayın | Yapay Zekâ ile İç Mimari', description: 'Herhangi bir evi saniyeler içinde yeniden tasarlayın. Mülkü ve fotoğrafı seçin, tarzınızı yazın; satın almadan önce yapay zekâ döşesin.' },
  ru: { title: 'Дизайн вашего дома | ИИ-дизайн интерьера', description: 'Преобразите любую недвижимость за секунды: выберите объект и фото, опишите стиль, и ИИ оформит интерьер ещё до покупки.' },
  ar: { title: 'صمّم منزلك | تصميم داخلي بالذكاء الاصطناعي', description: 'أعد تصور أي منزل خلال ثوانٍ: اختر العقار والصورة وصف أسلوبك، ودع الذكاء الاصطناعي يصمم المساحة قبل الشراء.' },
  fa: { title: 'خانه‌تان را طراحی کنید | طراحی داخلی هوشمند', description: 'هر خانه‌ای را در چند ثانیه از نو تصور کنید: ملک و عکس را انتخاب کنید، سبک خود را بنویسید و هوش مصنوعی پیش از خرید فضا را طراحی می‌کند.' },
  ur: { title: 'اپنا گھر ڈیزائن کریں | اے آئی انٹیریئر ڈیزائن', description: 'کسی بھی گھر کو سیکنڈوں میں نیا روپ دیں: پراپرٹی اور تصویر چنیں، اپنا انداز بتائیں اور خریدنے سے پہلے اے آئی جگہ کو سجا دے گی۔' },
  id: { title: 'Desain Rumah Anda | Desain Interior AI', description: 'Bayangkan ulang rumah mana pun dalam hitungan detik: pilih properti dan foto, jelaskan gaya Anda, lalu biarkan AI menata ruang sebelum membeli.' },
};

const ARTICLES: PageMetaByLocale = {
  en: { title: 'Property Buying Guides & Articles | Future Homes', description: 'Guides on buying property in Turkey, Dubai, Cyprus and Bali: costs, taxes, citizenship, districts and lifestyle articles from our local experts.' },
  sv: { title: 'Guider om att köpa bostad utomlands | Future Homes', description: 'Guider om att köpa bostad i Turkiet, Dubai, Cypern och Bali: kostnader, skatter, medborgarskap, områden och livsstil från våra lokala experter.' },
  no: { title: 'Guider om boligkjøp i utlandet | Future Homes', description: 'Guider om å kjøpe bolig i Tyrkia, Dubai, Kypros og Bali: kostnader, skatt, statsborgerskap, områder og livsstil fra våre lokale eksperter.' },
  da: { title: 'Guider om boligkøb i udlandet | Future Homes', description: 'Guider om at købe bolig i Tyrkiet, Dubai, Cypern og Bali: omkostninger, skat, statsborgerskab, områder og livsstil fra vores lokale eksperter.' },
  de: { title: 'Ratgeber Immobilienkauf im Ausland | Future Homes', description: 'Ratgeber zum Immobilienkauf in der Türkei, Dubai, Zypern und auf Bali: Kosten, Steuern, Staatsbürgerschaft, Lagen und Lifestyle von lokalen Experten.' },
  fr: { title: 'Guides pour acheter à l’étranger | Future Homes', description: 'Guides pour acheter un bien en Turquie, à Dubaï, à Chypre et à Bali : frais, fiscalité, citoyenneté, quartiers et art de vivre par nos experts locaux.' },
  es: { title: 'Guías para comprar vivienda | Future Homes', description: 'Guías para comprar vivienda en Turquía, Dubái, Chipre y Bali: costes, impuestos, ciudadanía, zonas y estilo de vida de nuestros expertos locales.' },
  tr: { title: 'Yurt Dışında Ev Alma Rehberleri | Future Homes', description: 'Türkiye, Dubai, Kıbrıs ve Bali’de ev satın alma rehberleri: masraflar, vergiler, vatandaşlık, bölgeler ve yaşam tarzı yazıları.' },
  ru: { title: 'Гиды по покупке недвижимости | Future Homes', description: 'Статьи о покупке недвижимости в Турции, Дубае, на Кипре и Бали: расходы, налоги, гражданство, районы и образ жизни от местных экспертов.' },
  ar: { title: 'أدلة شراء العقارات في الخارج | Future Homes', description: 'أدلة شراء العقارات في تركيا ودبي وقبرص وبالي: التكاليف والضرائب والجنسية والمناطق ونمط الحياة من خبرائنا المحليين.' },
  fa: { title: 'راهنمای خرید ملک در خارج | Future Homes', description: 'راهنمای خرید ملک در ترکیه، دبی، قبرس و بالی: هزینه‌ها، مالیات، شهروندی، مناطق و سبک زندگی از کارشناسان محلی ما.' },
  ur: { title: 'بیرونِ ملک پراپرٹی خریدنے کے رہنما | Future Homes', description: 'ترکی، دبئی، قبرص اور بالی میں پراپرٹی خریدنے کے رہنما مضامین: اخراجات، ٹیکس، شہریت، علاقے اور طرزِ زندگی۔' },
  id: { title: 'Panduan Membeli Properti | Future Homes', description: 'Panduan membeli properti di Turki, Dubai, Siprus, dan Bali: biaya, pajak, kewarganegaraan, kawasan, dan gaya hidup dari pakar lokal kami.' },
};

const COURSES: PageMetaByLocale = {
  en: { title: 'Free Property Buying Courses | Future Homes', description: 'Free step-by-step courses on buying property in Turkey, Dubai, Cyprus and Bali — legal process, costs, financing and residency, with a final exam.' },
  sv: { title: 'Gratis kurser om bostadsköp utomlands', description: 'Gratis steg-för-steg-kurser om att köpa bostad i Turkiet, Dubai, Cypern och Bali – juridik, kostnader, finansiering och uppehåll, med slutprov.' },
  no: { title: 'Gratis kurs om boligkjøp i utlandet', description: 'Gratis trinnvise kurs om å kjøpe bolig i Tyrkia, Dubai, Kypros og Bali – juss, kostnader, finansiering og opphold, med avsluttende test.' },
  da: { title: 'Gratis kurser om boligkøb i udlandet', description: 'Gratis trin-for-trin-kurser om at købe bolig i Tyrkiet, Dubai, Cypern og Bali – jura, omkostninger, finansiering og ophold, med afsluttende test.' },
  de: { title: 'Kostenlose Kurse zum Immobilienkauf', description: 'Kostenlose Schritt-für-Schritt-Kurse zum Immobilienkauf in der Türkei, Dubai, Zypern und auf Bali: Recht, Kosten, Finanzierung, Aufenthalt.' },
  fr: { title: 'Cours gratuits : acheter un bien à l’étranger', description: 'Cours gratuits étape par étape pour acheter en Turquie, à Dubaï, à Chypre et à Bali : procédure, frais, financement et résidence, avec examen final.' },
  es: { title: 'Cursos gratis para comprar vivienda fuera', description: 'Cursos gratuitos paso a paso para comprar en Turquía, Dubái, Chipre y Bali: proceso legal, costes, financiación y residencia, con examen final.' },
  tr: { title: 'Ücretsiz Yurt Dışı Emlak Alım Kursları', description: 'Türkiye, Dubai, Kıbrıs ve Bali’de mülk almak için ücretsiz adım adım kurslar: yasal süreç, masraflar, finansman ve oturum, final sınavıyla.' },
  ru: { title: 'Бесплатные курсы по покупке недвижимости', description: 'Бесплатные пошаговые курсы о покупке недвижимости в Турции, Дубае, на Кипре и Бали: юридический процесс, расходы, финансирование и ВНЖ.' },
  ar: { title: 'دورات مجانية لشراء العقارات في الخارج', description: 'دورات مجانية خطوة بخطوة لشراء العقارات في تركيا ودبي وقبرص وبالي: الإجراءات القانونية والتكاليف والتمويل والإقامة مع اختبار نهائي.' },
  fa: { title: 'دوره‌های رایگان خرید ملک در خارج', description: 'دوره‌های رایگان گام‌به‌گام خرید ملک در ترکیه، دبی، قبرس و بالی: روند حقوقی، هزینه‌ها، تأمین مالی و اقامت، همراه با آزمون نهایی.' },
  ur: { title: 'بیرونِ ملک پراپرٹی خریدنے کے مفت کورسز', description: 'ترکی، دبئی، قبرص اور بالی میں پراپرٹی خریدنے کے مفت مرحلہ وار کورسز: قانونی عمل، اخراجات، فنانسنگ اور رہائش، آخری امتحان کے ساتھ۔' },
  id: { title: 'Kursus Gratis Membeli Properti di Luar Negeri', description: 'Kursus gratis langkah demi langkah membeli properti di Turki, Dubai, Siprus, dan Bali: proses hukum, biaya, pembiayaan, dan izin tinggal.' },
};

const VIEWING_TRIP: PageMetaByLocale = {
  en: { title: 'Property Viewing Trip Planner | Future Homes', description: 'Plan a day-by-day property viewing trip in Turkey, Dubai, Cyprus or Bali by city, dates, budget and home type — with airport pickup and local guides.' },
  sv: { title: 'Planera en visningsresa | Future Homes', description: 'Planera en visningsresa dag för dag i Turkiet, Dubai, Cypern eller Bali efter stad, datum, budget och bostadstyp – med flygplatshämtning och guide.' },
  no: { title: 'Planlegg en visningsreise | Future Homes', description: 'Planlegg en visningsreise dag for dag i Tyrkia, Dubai, Kypros eller Bali etter by, datoer, budsjett og boligtype – med henting på flyplassen.' },
  da: { title: 'Planlæg en fremvisningsrejse | Future Homes', description: 'Planlæg en fremvisningsrejse dag for dag i Tyrkiet, Dubai, Cypern eller Bali efter by, datoer, budget og boligtype – med lufthavnsafhentning.' },
  de: { title: 'Besichtigungsreise planen | Future Homes', description: 'Planen Sie Ihre Besichtigungsreise in der Türkei, Dubai, Zypern oder auf Bali nach Stadt, Datum, Budget und Objektart – inklusive Flughafentransfer.' },
  fr: { title: 'Planifiez un voyage de visites | Future Homes', description: 'Planifiez jour par jour vos visites de biens en Turquie, à Dubaï, à Chypre ou à Bali selon la ville, les dates, le budget et le type de logement.' },
  es: { title: 'Planifica un viaje de visitas | Future Homes', description: 'Planifica día a día tu viaje para visitar propiedades en Turquía, Dubái, Chipre o Bali según ciudad, fechas, presupuesto y tipo de vivienda.' },
  tr: { title: 'Mülk Görme Gezisi Planlayıcı | Future Homes', description: 'Türkiye, Dubai, Kıbrıs veya Bali’de şehir, tarih, bütçe ve ev tipine göre gün gün mülk görme gezinizi planlayın; havalimanı karşılama dahil.' },
  ru: { title: 'Планировщик ознакомительного тура | Future Homes', description: 'Спланируйте по дням тур для просмотра недвижимости в Турции, Дубае, на Кипре или Бали: город, даты, бюджет и тип жилья, трансфер из аэропорта.' },
  ar: { title: 'خطط لرحلة معاينة العقارات | Future Homes', description: 'خطط يومًا بيوم لرحلة معاينة العقارات في تركيا أو دبي أو قبرص أو بالي حسب المدينة والتواريخ والميزانية ونوع المنزل مع الاستقبال من المطار.' },
  fa: { title: 'برنامه‌ریزی سفر بازدید ملک | Future Homes', description: 'سفر بازدید ملک خود را روزبه‌روز در ترکیه، دبی، قبرس یا بالی بر اساس شهر، تاریخ، بودجه و نوع خانه برنامه‌ریزی کنید؛ همراه با ترانسفر فرودگاه.' },
  ur: { title: 'پراپرٹی وزٹ ٹرپ پلانر | Future Homes', description: 'ترکی، دبئی، قبرص یا بالی میں شہر، تاریخوں، بجٹ اور گھر کی قسم کے مطابق دن بہ دن پراپرٹی وزٹ ٹرپ کی منصوبہ بندی کریں۔' },
  id: { title: 'Perencana Perjalanan Survei Properti', description: 'Rencanakan perjalanan survei properti harian di Turki, Dubai, Siprus, atau Bali berdasarkan kota, tanggal, anggaran, dan tipe rumah.' },
};

const WHERE_SHOULD_I_BUY: PageMetaByLocale = {
  en: { title: 'Where Should I Buy Property Abroad? Free Quiz', description: 'Find out whether Turkey, Dubai, Northern Cyprus or Bali best fits your budget, lifestyle and investment goals in two minutes.' },
  sv: { title: 'Var ska jag köpa bostad utomlands? Gratis test', description: 'Ta reda på om Turkiet, Dubai, Nordcypern eller Bali passar din budget, livsstil och dina investeringsmål bäst – på två minuter.' },
  no: { title: 'Hvor bør jeg kjøpe bolig i utlandet? Gratis test', description: 'Finn ut om Tyrkia, Dubai, Nord-Kypros eller Bali passer best for budsjettet, livsstilen og investeringsmålene dine – på to minutter.' },
  da: { title: 'Hvor skal jeg købe bolig i udlandet? Gratis test', description: 'Find ud af, om Tyrkiet, Dubai, Nordcypern eller Bali passer bedst til dit budget, din livsstil og dine investeringsmål – på to minutter.' },
  de: { title: 'Wo soll ich im Ausland kaufen? Gratis-Quiz', description: 'Finden Sie in zwei Minuten heraus, ob die Türkei, Dubai, Nordzypern oder Bali am besten zu Budget, Lebensstil und Anlagezielen passt.' },
  fr: { title: 'Où acheter un bien à l’étranger ? Quiz gratuit', description: 'Découvrez en deux minutes si la Turquie, Dubaï, Chypre du Nord ou Bali correspond le mieux à votre budget, votre style de vie et vos objectifs.' },
  es: { title: '¿Dónde comprar vivienda en el extranjero? Test', description: 'Descubre en dos minutos si Turquía, Dubái, el norte de Chipre o Bali encaja mejor con tu presupuesto, estilo de vida y objetivos de inversión.' },
  tr: { title: 'Yurt Dışında Nereden Ev Almalıyım? Ücretsiz Test', description: 'Türkiye, Dubai, Kuzey Kıbrıs veya Bali’den hangisinin bütçenize, yaşam tarzınıza ve yatırım hedeflerinize uyduğunu iki dakikada öğrenin.' },
  ru: { title: 'Где купить недвижимость за рубежом? Тест', description: 'Узнайте за две минуты, что лучше подходит вашему бюджету, образу жизни и инвестиционным целям: Турция, Дубай, Северный Кипр или Бали.' },
  ar: { title: 'أين أشتري عقارًا في الخارج؟ اختبار مجاني', description: 'اكتشف خلال دقيقتين أي وجهة تناسب ميزانيتك وأسلوب حياتك وأهدافك الاستثمارية: تركيا أم دبي أم شمال قبرص أم بالي.' },
  fa: { title: 'کجا ملک بخرم؟ آزمون رایگان', description: 'در دو دقیقه بفهمید ترکیه، دبی، قبرس شمالی یا بالی کدام با بودجه، سبک زندگی و اهداف سرمایه‌گذاری شما سازگارتر است.' },
  ur: { title: 'بیرونِ ملک پراپرٹی کہاں خریدیں؟ مفت کوئز', description: 'دو منٹ میں جانیں کہ ترکی، دبئی، شمالی قبرص یا بالی میں سے کون سا آپ کے بجٹ، طرزِ زندگی اور سرمایہ کاری کے اہداف کے لیے بہترین ہے۔' },
  id: { title: 'Di Mana Sebaiknya Beli Properti? Kuis Gratis', description: 'Ketahui dalam dua menit apakah Turki, Dubai, Siprus Utara, atau Bali paling cocok dengan anggaran, gaya hidup, dan tujuan investasi Anda.' },
};

const INVESTMENT_CALCULATOR: PageMetaByLocale = {
  en: { title: 'Property Investment Calculator | Rental Yield & ROI', description: 'Calculate purchase costs, rental yield, fees and net cash flow for property in Antalya, Dubai and Bali before you invest.' },
  sv: { title: 'Investeringskalkylator | Hyresavkastning & ROI', description: 'Räkna ut köpkostnader, hyresavkastning, avgifter och netto-kassaflöde för bostäder i Antalya, Dubai och Bali innan du investerar.' },
  no: { title: 'Investeringskalkulator | Leieavkastning og ROI', description: 'Beregn kjøpskostnader, leieavkastning, gebyrer og netto kontantstrøm for boliger i Antalya, Dubai og Bali før du investerer.' },
  da: { title: 'Investeringsberegner | Lejeafkast og ROI', description: 'Beregn købsomkostninger, lejeafkast, gebyrer og netto pengestrøm for boliger i Antalya, Dubai og Bali, før du investerer.' },
  de: { title: 'Immobilien-Renditerechner | Mietrendite & ROI', description: 'Berechnen Sie Kaufnebenkosten, Mietrendite, Gebühren und Netto-Cashflow für Immobilien in Antalya, Dubai und auf Bali vor dem Investment.' },
  fr: { title: 'Calculateur d’investissement immobilier | ROI', description: 'Calculez frais d’achat, rendement locatif, charges et cash-flow net pour un bien à Antalya, à Dubaï ou à Bali avant d’investir.' },
  es: { title: 'Calculadora de inversión inmobiliaria | ROI', description: 'Calcula costes de compra, rentabilidad por alquiler, gastos y flujo de caja neto de una vivienda en Antalya, Dubái o Bali antes de invertir.' },
  tr: { title: 'Emlak Yatırım Hesaplayıcı | Kira Getirisi & ROI', description: 'Antalya, Dubai ve Bali’de yatırım yapmadan önce satın alma masraflarını, kira getirisini, giderleri ve net nakit akışını hesaplayın.' },
  ru: { title: 'Калькулятор инвестиций в недвижимость | ROI', description: 'Рассчитайте расходы на покупку, арендную доходность, сборы и чистый денежный поток для недвижимости в Анталии, Дубае и на Бали.' },
  ar: { title: 'حاسبة الاستثمار العقاري | العائد الإيجاري', description: 'احسب تكاليف الشراء والعائد الإيجاري والرسوم وصافي التدفق النقدي للعقارات في أنطاليا ودبي وبالي قبل أن تستثمر.' },
  fa: { title: 'ماشین‌حساب سرمایه‌گذاری ملک | بازده اجاره', description: 'پیش از سرمایه‌گذاری، هزینه‌های خرید، بازده اجاره، عوارض و جریان نقدی خالص ملک در آنتالیا، دبی و بالی را محاسبه کنید.' },
  ur: { title: 'پراپرٹی انویسٹمنٹ کیلکولیٹر | کرایہ منافع', description: 'سرمایہ کاری سے پہلے انطالیہ، دبئی اور بالی میں پراپرٹی کی خریداری لاگت، کرایہ منافع، فیس اور خالص کیش فلو کا حساب لگائیں۔' },
  id: { title: 'Kalkulator Investasi Properti | Yield & ROI', description: 'Hitung biaya pembelian, imbal hasil sewa, biaya, dan arus kas bersih properti di Antalya, Dubai, dan Bali sebelum berinvestasi.' },
};

const PARTNERS: PageMetaByLocale = {
  en: { title: 'Real Estate Partner Program | Future Homes', description: 'Refer property buyers to Future Homes with your own link and partner portal, and earn an agreed commission on every completed sale.' },
  sv: { title: 'Partnerprogram för fastighetsförmedling', description: 'Hänvisa bostadsköpare till Future Homes med din egen länk och partnerportal och få överenskommen provision på varje genomförd affär.' },
  no: { title: 'Partnerprogram for eiendom | Future Homes', description: 'Henvis boligkjøpere til Future Homes med din egen lenke og partnerportal, og tjen avtalt provisjon på hvert gjennomført salg.' },
  da: { title: 'Partnerprogram for ejendomme | Future Homes', description: 'Henvis boligkøbere til Future Homes med dit eget link og partnerportal, og tjen aftalt provision på hvert gennemført salg.' },
  de: { title: 'Immobilien-Partnerprogramm | Future Homes', description: 'Empfehlen Sie Käufer mit Ihrem eigenen Link und Partnerportal an Future Homes und erhalten Sie für jeden Abschluss die vereinbarte Provision.' },
  fr: { title: 'Programme partenaires immobilier | Future Homes', description: 'Recommandez des acheteurs à Future Homes avec votre lien et votre portail partenaire, et touchez une commission convenue sur chaque vente.' },
  es: { title: 'Programa de socios inmobiliarios | Future Homes', description: 'Recomienda compradores a Future Homes con tu propio enlace y portal de socios, y gana una comisión acordada por cada venta cerrada.' },
  tr: { title: 'Emlak İş Ortaklığı Programı | Future Homes', description: 'Kendi bağlantınız ve iş ortağı portalınızla alıcıları Future Homes’a yönlendirin, tamamlanan her satıştan anlaşılan komisyonu kazanın.' },
  ru: { title: 'Партнёрская программа | Future Homes', description: 'Рекомендуйте покупателей Future Homes по своей ссылке через партнёрский кабинет и получайте согласованную комиссию с каждой сделки.' },
  ar: { title: 'برنامج شركاء العقارات | Future Homes', description: 'رشّح المشترين إلى Future Homes عبر رابطك الخاص وبوابة الشركاء، واحصل على عمولة متفق عليها عن كل عملية بيع مكتملة.' },
  fa: { title: 'برنامه همکاری املاک | Future Homes', description: 'خریداران را با لینک اختصاصی و پنل همکاری خود به Future Homes معرفی کنید و از هر فروش انجام‌شده کمیسیون توافقی دریافت کنید.' },
  ur: { title: 'رئیل اسٹیٹ پارٹنر پروگرام | Future Homes', description: 'اپنے لنک اور پارٹنر پورٹل کے ذریعے خریداروں کو Future Homes کی طرف ریفر کریں اور ہر مکمل فروخت پر طے شدہ کمیشن حاصل کریں۔' },
  id: { title: 'Program Mitra Properti | Future Homes', description: 'Rujuk pembeli properti ke Future Homes dengan tautan dan portal mitra Anda sendiri, dan dapatkan komisi yang disepakati dari setiap penjualan.' },
};

const VIP: PageMetaByLocale = {
  en: { title: 'Future Homes VIP Club | Free Membership', description: 'Save favourites, get Smart Property Alerts and price-drop notices, and early access to selected pre-launch projects — free.' },
  sv: { title: 'Future Homes VIP-klubb | Gratis medlemskap', description: 'Spara favoriter, få smarta bostadsbevakningar och prissänkningar samt tidig tillgång till utvalda förhandslanseringar – helt gratis.' },
  no: { title: 'Future Homes VIP-klubb | Gratis medlemskap', description: 'Lagre favoritter, få smarte boligvarsler og prisfall, og tidlig tilgang til utvalgte prosjekter før lansering – helt gratis.' },
  da: { title: 'Future Homes VIP-klub | Gratis medlemskab', description: 'Gem favoritter, få smarte boligadvarsler og prisfald samt tidlig adgang til udvalgte projekter før lancering – helt gratis.' },
  de: { title: 'Future Homes VIP Club | Kostenlose Mitgliedschaft', description: 'Favoriten speichern, smarte Immobilien-Alerts und Preissenkungen erhalten und früher Zugang zu ausgewählten Pre-Launch-Projekten – kostenlos.' },
  fr: { title: 'Club VIP Future Homes | Adhésion gratuite', description: 'Enregistrez vos favoris, recevez des alertes immobilières et baisses de prix, et un accès anticipé à des projets en prélancement – gratuitement.' },
  es: { title: 'Club VIP Future Homes | Membresía gratuita', description: 'Guarda favoritos, recibe alertas inteligentes y bajadas de precio, y acceso anticipado a proyectos en prelanzamiento seleccionados, gratis.' },
  tr: { title: 'Future Homes VIP Kulüp | Ücretsiz Üyelik', description: 'Favorilerinizi kaydedin, akıllı emlak bildirimleri ve fiyat düşüşleri alın, seçili ön lansman projelerine erken erişin – ücretsiz.' },
  ru: { title: 'VIP-клуб Future Homes | Бесплатное членство', description: 'Сохраняйте избранное, получайте умные уведомления о новых объектах и снижении цен, а также ранний доступ к проектам до старта продаж.' },
  ar: { title: 'نادي Future Homes VIP | عضوية مجانية', description: 'احفظ مفضلاتك واحصل على تنبيهات عقارية ذكية وإشعارات انخفاض الأسعار ووصول مبكر إلى مشاريع مختارة قبل الإطلاق مجانًا.' },
  fa: { title: 'باشگاه VIP فیوچر هومز | عضویت رایگان', description: 'علاقه‌مندی‌ها را ذخیره کنید، هشدار هوشمند ملک و کاهش قیمت دریافت کنید و به پروژه‌های پیش از عرضه زودتر دسترسی داشته باشید؛ رایگان.' },
  ur: { title: 'Future Homes VIP کلب | مفت رکنیت', description: 'پسندیدہ پراپرٹیز محفوظ کریں، اسمارٹ الرٹس اور قیمت میں کمی کی اطلاعات پائیں اور منتخب پری لانچ منصوبوں تک جلد رسائی حاصل کریں۔' },
  id: { title: 'Klub VIP Future Homes | Keanggotaan Gratis', description: 'Simpan favorit, dapatkan notifikasi properti pintar dan penurunan harga, serta akses awal ke proyek pra-peluncuran pilihan – gratis.' },
};

const EXPENSES_ARTICLE: PageMetaByLocale = {
  en: { title: 'Costs of Buying Property in Turkey | 2026 Guide', description: 'Every cost of buying property in Turkey explained: title deed tax, notary, translation, valuation report, utilities and yearly running costs.' },
  sv: { title: 'Kostnader vid bostadsköp i Turkiet | Guide 2026', description: 'Alla kostnader när du köper bostad i Turkiet: lagfartsskatt, notarie, översättning, värderingsrapport, abonnemang och årliga driftskostnader.' },
  no: { title: 'Kostnader ved boligkjøp i Tyrkia | Guide 2026', description: 'Alle kostnader ved kjøp av bolig i Tyrkia: skjøteavgift, notarius, oversettelse, verditakst, abonnementer og årlige driftskostnader.' },
  da: { title: 'Omkostninger ved boligkøb i Tyrkiet | Guide 2026', description: 'Alle omkostninger ved køb af bolig i Tyrkiet: tinglysningsafgift, notar, oversættelse, vurderingsrapport, forsyning og årlige driftsudgifter.' },
  de: { title: 'Kaufnebenkosten Immobilie Türkei | Ratgeber 2026', description: 'Alle Kosten beim Immobilienkauf in der Türkei: Grunderwerbsteuer (Tapu), Notar, Übersetzung, Wertgutachten, Anschlüsse und laufende Kosten.' },
  fr: { title: 'Frais d’achat immobilier en Turquie | Guide 2026', description: 'Tous les frais pour acheter en Turquie : taxe sur le titre de propriété, notaire, traduction, expertise, raccordements et charges annuelles.' },
  es: { title: 'Gastos al comprar vivienda en Turquía | Guía 2026', description: 'Todos los gastos de comprar vivienda en Turquía: impuesto de escritura, notario, traducción, tasación, suministros y costes anuales.' },
  tr: { title: 'Türkiye’de Ev Alırken Masraflar | 2026 Rehberi', description: 'Türkiye’de ev satın alırken tüm masraflar: tapu harcı, noter, tercüme, ekspertiz raporu, abonelikler ve yıllık işletme giderleri.' },
  ru: { title: 'Расходы при покупке недвижимости в Турции 2026', description: 'Все расходы при покупке жилья в Турции: налог на ТАПУ, нотариус, перевод, отчёт об оценке, подключение коммунальных услуг и ежегодные платежи.' },
  ar: { title: 'تكاليف شراء عقار في تركيا | دليل 2026', description: 'جميع تكاليف شراء عقار في تركيا: رسوم سند الملكية (الطابو) والكاتب العدل والترجمة وتقرير التقييم والاشتراكات والتكاليف السنوية.' },
  fa: { title: 'هزینه‌های خرید ملک در ترکیه | راهنمای ۲۰۲۶', description: 'همه هزینه‌های خرید ملک در ترکیه: مالیات سند (طابو)، دفتر اسناد، ترجمه، گزارش ارزیابی، اشتراک‌ها و هزینه‌های سالانه.' },
  ur: { title: 'ترکی میں پراپرٹی خریدنے کے اخراجات | گائیڈ 2026', description: 'ترکی میں پراپرٹی خریدنے کے تمام اخراجات: ٹائٹل ڈیڈ ٹیکس، نوٹری، ترجمہ، ویلیوایشن رپورٹ، یوٹیلیٹیز اور سالانہ اخراجات۔' },
  id: { title: 'Biaya Membeli Properti di Turki | Panduan 2026', description: 'Semua biaya membeli properti di Turki: pajak sertifikat (tapu), notaris, penerjemahan, laporan penilaian, utilitas, dan biaya tahunan.' },
};

/** Locale-free path -> locale -> localized title/description. */
export const SEO_META_EXTRA: Record<string, PageMetaByLocale> = {
  '/property-wizard': PROPERTY_WIZARD,
  '/ai-property-search': AI_PROPERTY_SEARCH,
  '/map-search': MAP_SEARCH,
  '/design-your-home': DESIGN_YOUR_HOME,
  '/articles': ARTICLES,
  '/courses': COURSES,
  '/viewing-trip': VIEWING_TRIP,
  '/where-should-i-buy': WHERE_SHOULD_I_BUY,
  '/investment-calculator': INVESTMENT_CALCULATOR,
  '/partners': PARTNERS,
  '/vip': VIP,
  '/articles/expenses-buying-property-turkey': EXPENSES_ARTICLE,
};
