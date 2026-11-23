export type PhotoCategory =
  | 'all'
  | 'wedding'
  | 'family'
  | 'portrait'
  | 'lovestory'
  | 'editorial'
  | 'reportage';

export interface PortfolioItem {
  id: string;
  title: string;
  category: Exclude<PhotoCategory, 'all'>;
  categoryLabel: string;
  year: string;
  location: string;
  image: string;
  aspectClass: string;
  gridSpanClass: string;
  story: string;
  suggestedFormatId: string;
  suggestedPrompt: string;
}

export interface ShootFormat {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  price: number;
  priceNote: string;
  durationHours: number;
  framesCount: number;
  deliveryDays: number;
  highlights: string[];
}

export interface ShootAddon {
  id: string;
  label: string;
  note: string;
  price: number;
  extraFrames?: number;
  overrideDeliveryDays?: number;
}

export interface ProcessStep {
  number: string;
  title: string;
  summary: string;
  detail: string;
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'wedding-day-ceremony',
    title: 'Свадьба в усадьбе на закате',
    category: 'wedding',
    categoryLabel: 'Свадебная съёмка',
    year: '2026',
    location: 'Подмосковье',
    image: '/src/assets/images/photo_wedding_ceremony_1795458279108.jpg',
    aspectClass: 'aspect-[4/3]',
    gridSpanClass: 'md:col-span-7',
    story:
      'Камерная церемония в саду, прогулка вдвоём и живые эмоции гостей без затянутой постановки. Снимали с полудня до первого танца под тёплое вечернее солнце.',
    suggestedFormatId: 'wedding',
    suggestedPrompt: 'Нужен фотограф на свадьбу: церемония и прогулка вдвоём',
  },
  {
    id: 'amber-rim-portrait',
    title: 'Мужской портрет в студии',
    category: 'portrait',
    categoryLabel: 'Портрет',
    year: '2026',
    location: 'Студия на Третьяковской',
    image: '/src/assets/images/photo_portrait_dramatic_1795454909873.jpg',
    aspectClass: 'aspect-[3/4]',
    gridSpanClass: 'md:col-span-5',
    story:
      'Спокойный студийный портрет для личного профиля и рабочих задач. Работали с одним тёплым источником света, чтобы кадры получились объёмными и без лишней ретуши.',
    suggestedFormatId: 'portrait',
    suggestedPrompt: 'Нужны свежие портреты в студии для себя или работы',
  },
  {
    id: 'family-park-autumn',
    title: 'Выходной в парке с семьёй',
    category: 'family',
    categoryLabel: 'Семейная фотосессия',
    year: '2026',
    location: 'Нескучный сад',
    image: '/src/assets/images/photo_family_warmth_1795458279734.jpg',
    aspectClass: 'aspect-[4/3]',
    gridSpanClass: 'md:col-span-7',
    story:
      'Обычная прогулка в выходные без команд «встаньте ровно и смотрите сюда». Дети бегают, родители отдыхают — именно в такие моменты выходят лучшие домашние кадры.',
    suggestedFormatId: 'family',
    suggestedPrompt: 'Хотим семейную фотосессию на прогулке в парке или дома',
  },
  {
    id: 'event-evening-reportage',
    title: 'Вечерний ивент и открытие',
    category: 'reportage',
    categoryLabel: 'Репортаж',
    year: '2026',
    location: 'Винзавод, Москва',
    image: '/src/assets/images/photo_event_reportage_1795458279685.jpg',
    aspectClass: 'aspect-[3/4]',
    gridSpanClass: 'md:col-span-5',
    story:
      'Репортаж с закрытого ужина и презентации: живые разговоры гостей, детали пространства, тосты и общая атмосфера вечера без вспышки в лоб.',
    suggestedFormatId: 'reportage',
    suggestedPrompt: 'Ищу фотографа на мероприятие, день рождения или корпоратив',
  },
  {
    id: 'golden-pier-story',
    title: 'Прогулка вдвоём у воды',
    category: 'lovestory',
    categoryLabel: 'Love Story',
    year: '2026',
    location: 'Пирс на закате',
    image: '/src/assets/images/photo_lovestory_golden_1795454912152.jpg',
    aspectClass: 'aspect-[16/9]',
    gridSpanClass: 'md:col-span-12',
    story:
      'Встретились за час до заката на деревянном пирсе. Никаких сложных поз — просто прогулка, ветер и тёплый вечерний свет.',
    suggestedFormatId: 'lovestory',
    suggestedPrompt: 'Хотим живую съёмку для двоих на природе на закате',
  },
  {
    id: 'monochrome-atelier',
    title: 'Чёрно-белый портрет в мастерской',
    category: 'portrait',
    categoryLabel: 'Портрет',
    year: '2026',
    location: 'Мастерская художника',
    image: '/src/assets/images/photo_monochrome_character_1795454912078.jpg',
    aspectClass: 'aspect-[3/4]',
    gridSpanClass: 'md:col-span-5',
    story:
      'Съёмка в привычной для героя обстановке с мягким светом из окна. Показывает человека в деле без студийного глянца.',
    suggestedFormatId: 'portrait',
    suggestedPrompt: 'Хочу документальный портрет у меня в офисе, мастерской или дома',
  },
  {
    id: 'brutalist-editorial',
    title: 'Съёмка коллекции одежды',
    category: 'editorial',
    categoryLabel: 'Editorial',
    year: '2026',
    location: 'Городская архитектура',
    image: '/src/assets/images/photo_editorial_fashion_1795454910973.jpg',
    aspectClass: 'aspect-[4/3]',
    gridSpanClass: 'md:col-span-7',
    story:
      'Коммерческая съёмка осенней коллекции для локального бренда: работали на улице с жёстким дневным солнцем и геометрией бетона.',
    suggestedFormatId: 'editorial',
    suggestedPrompt: 'Нужна съёмка бренда одежды или контента для каталога',
  },
];

// Average Moscow / Russia photography market prices (2025-2026)
export const SHOOT_FORMATS: ShootFormat[] = [
  {
    id: 'portrait',
    index: '01.',
    title: 'Портретная съёмка',
    subtitle: 'Индивидуальные кадры в студии, на улице или у вас дома — для себя и работы.',
    price: 10000,
    priceNote: 'средняя цена в Москве ~8–12 тыс. ₽',
    durationHours: 1.5,
    framesCount: 50,
    deliveryDays: 5,
    highlights: [
      'Помогу подобрать одежду и удобную студию или маршрут',
      'Подсказываю позы на месте — не нужно уметь позировать',
      '50 обработанных кадров в цвете и ч/б с естественной кожей',
    ],
  },
  {
    id: 'family',
    index: '02.',
    title: 'Семейная фотосессия',
    subtitle: 'Тёплые домашние или прогулочные кадры с детьми, родителями и питомцами.',
    price: 14000,
    priceNote: 'средняя цена по рынку ~12–16 тыс. ₽',
    durationHours: 1.5,
    framesCount: 65,
    deliveryDays: 6,
    highlights: [
      'Подстраиваюсь под ритм и настроение детей без спешки',
      'Снимаем и общие портреты, и живые моменты в движении',
      '65 готовых фотографий в онлайн-галерее для скачивания и печати',
    ],
  },
  {
    id: 'lovestory',
    index: '03.',
    title: 'Love Story / Для двоих',
    subtitle: 'Прогулка перед свадьбой, годовщина или просто красивый день вдвоём.',
    price: 15000,
    priceNote: 'средняя цена пакета ~12–18 тыс. ₽',
    durationHours: 2,
    framesCount: 70,
    deliveryDays: 6,
    highlights: [
      'Составляю спокойный маршрут без толп на закатный или утренний свет',
      'Комфортная атмосфера — вы просто проводите время вместе',
      '70 готовых фотографий + первые 10 кадров на следующий день',
    ],
  },
  {
    id: 'reportage',
    index: '04.',
    title: 'Репортаж мероприятий',
    subtitle: 'Дни рождения, конференции, ужины, выставки и камерные вечеринки.',
    price: 16000,
    priceNote: 'от 8 000 ₽/час, выезд от 2 часов',
    durationHours: 2,
    framesCount: 150,
    deliveryDays: 4,
    highlights: [
      'Снимаю гостей, спикеров, эмоции и детали оформления незаметно',
      'Анонс из 15–20 фотографий для соцсетей уже на следующее утро',
      'От 150 отобранных и выровненных по цвету кадров',
    ],
  },
  {
    id: 'editorial',
    index: '05.',
    title: 'Бренды и Editorial',
    subtitle: 'Контент для локальных марок, дизайнеров, экспертов и журнальных историй.',
    price: 28000,
    priceNote: 'средний коммерческий пакет ~25–35 тыс. ₽',
    durationHours: 3,
    framesCount: 90,
    deliveryDays: 7,
    highlights: [
      'Заранее обсуждаем задачу, референсы и список обязательных кадров',
      'Готовлю файлы как для сайта и каталога, так и под вертикальные сторис',
      '90 готовых фотографий с аккуратной технической ретушью',
    ],
  },
  {
    id: 'wedding',
    index: '06.',
    title: 'Свадебная фотография',
    subtitle: 'ЗАГС и прогулка или половина свадебного дня до торта и танцев.',
    price: 40000,
    priceNote: 'полдня 6 ч (~10 тыс. ₽/ч) · полный день 70 тыс. ₽',
    durationHours: 6,
    framesCount: 350,
    deliveryDays: 14,
    highlights: [
      'Помогаю составить тайминг дня, чтобы осталось время на прогулку',
      'Снимаю и вас вдвоём, и живые портреты всех близких гостей',
      'От 350 готовых фотографий + 25 кадров уже через 2 дня после свадьбы',
    ],
  },
];

export const SHOOT_ADDONS: ShootAddon[] = [
  {
    id: 'extra-hour',
    label: 'Дополнительный час съёмки',
    note: 'Средняя почасовая ставка — если хочется без спешки сменить две локации',
    price: 8000,
    extraFrames: 40,
  },
  {
    id: 'studio-rent',
    label: 'Аренда студии в Москве',
    note: 'Средний чек за 1–1,5 часа светлого зала с большими окнами',
    price: 3500,
  },
  {
    id: 'mua-stylist',
    label: 'Макияж и укладка перед съёмкой',
    note: 'Проверенный визажист, который собирает естественно под дневной и студийный свет',
    price: 6000,
  },
  {
    id: 'film-roll',
    label: 'Катушка плёнки 35mm',
    note: 'Покупка плёнки, проявка и скан в лаборатории (+15 живых плёночных кадров)',
    price: 4000,
    extraFrames: 15,
  },
  {
    id: 'express-48h',
    label: 'Готовые фото за 48 часов',
    note: 'Быстрый отбор и обработка всей серии вне очереди',
    price: 5000,
    overrideDeliveryDays: 2,
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01.',
    title: 'Обсуждаем идею в Telegram',
    summary: 'Коротко списываемся, чтобы понять формат, локацию и дату.',
    detail:
      'Никаких длинных брифов. Вы пишете, что хотите снять, присылаете 2–3 примера по настроению (если есть), и мы сразу выбираем место — студию, парк, ЗАГС или ваш дом.',
  },
  {
    number: '02.',
    title: 'Подбираем одежду и время под свет',
    summary: 'Подсказываю, что лучше надеть и в какой час выйдет мягкий свет.',
    detail:
      'За пару дней до встречи можете сфотографировать пару комплектов одежды на телефон — помогу собрать гармоничные сочетания по цветам, чтобы все смотрелись в кадре естественно.',
  },
  {
    number: '03.',
    title: 'Спокойно снимаем без неловкости',
    summary: 'Говорю, куда встать и куда деть руки — позировать уметь не нужно.',
    detail:
      'Первые 10 минут просто привыкаете к камере, общаемся и двигаемся. Периодически показываю кадры на экране, чтобы вы видели, как здорово всё получается.',
  },
  {
    number: '04.',
    title: 'Отдаю готовую серию ссылкой',
    summary: 'Удобная галерея на Яндекс/облачном диске в двух размерах.',
    detail:
      'Все фотографии проходят аккуратную цветокоррекцию и лёгкую чистку кожи без эффекта «пластика». Отдаю архив в полном качестве для печати и сжатые файлы для телефона.',
  },
];
