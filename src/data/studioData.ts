export type PhotoCategory = 'all' | 'portrait' | 'editorial' | 'lovestory' | 'film';

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
  camera: string;
  exif: string;
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
    id: 'amber-rim-portrait',
    title: 'Тёплый контур в тишине',
    category: 'portrait',
    categoryLabel: 'Портрет',
    year: '2026',
    location: 'Студия на Третьяковской',
    image: '/src/assets/images/photo_portrait_dramatic_1795454909873.jpg',
    aspectClass: 'aspect-[3/4]',
    gridSpanClass: 'md:col-span-5',
    camera: 'Leica SL2 · 85mm Summilux',
    exif: '85mm · f/1.4 · 1/250s · ISO 160',
    story:
      'Камерный мужской портрет с одним жёстким вольфрамовым источником и контровым рисунком. Задача — поймать спокойную уверенность без постановки и лишней ретуши.',
    suggestedFormatId: 'portrait',
    suggestedPrompt: 'Хочу студийный портрет с тёплым контровым светом и глубокими тенями',
  },
  {
    id: 'brutalist-editorial',
    title: 'Диагональ бетона и шерсти',
    category: 'editorial',
    categoryLabel: 'Editorial',
    year: '2026',
    location: 'Галерея современной архитектуры',
    image: '/src/assets/images/photo_editorial_fashion_1795454910973.jpg',
    aspectClass: 'aspect-[4/3]',
    gridSpanClass: 'md:col-span-7',
    camera: 'Hasselblad X2D · 55mm V',
    exif: '55mm · f/2.8 · 1/640s · ISO 100',
    story:
      'Съёмка осенней капсульной коллекции в естественном дневном свете. Работали в движении, ловя геометрию теней на бетонном полу и фактуру ткани.',
    suggestedFormatId: 'editorial',
    suggestedPrompt: 'Нужна editorial-съёмка в архитектурном пространстве с жёстким дневным светом',
  },
  {
    id: 'golden-pier-story',
    title: 'Последний час на пирсе',
    category: 'lovestory',
    categoryLabel: 'Для двоих',
    year: '2026',
    location: 'Финский залив',
    image: '/src/assets/images/photo_lovestory_golden_1795454912152.jpg',
    aspectClass: 'aspect-[16/9]',
    gridSpanClass: 'md:col-span-12',
    camera: 'Contax 645 · Portra 400',
    exif: '80mm · f/2.0 · 1/1000s · ISO 400',
    story:
      'Никаких команд «посмотрите в камеру». Мы просто гуляли по деревянному причалу за сорок минут до заката — ветер, солёный воздух и живой смех сделали всю серию.',
    suggestedFormatId: 'lovestory',
    suggestedPrompt: 'Ищем живую прогулочную съёмку для двоих на закате у воды',
  },
  {
    id: 'monochrome-atelier',
    title: 'Свет северного окна',
    category: 'film',
    categoryLabel: 'Плёнка и студия',
    year: '2026',
    location: 'Мастерская художника',
    image: '/src/assets/images/photo_monochrome_character_1795454912078.jpg',
    aspectClass: 'aspect-[3/4]',
    gridSpanClass: 'md:col-span-5',
    camera: 'Leica M6 · Ilford HP5 Plus',
    exif: '50mm · f/2.0 · 1/125s · ISO 400',
    story:
      'Документальный портрет в естественной среде: запах угля, старые эскизы и один мягкий поток света от окна. Отпечатано с ручной доработкой контраста.',
    suggestedFormatId: 'portrait',
    suggestedPrompt: 'Хочу документальный чёрно-белый портрет в моей мастерской или дома',
  },
  {
    id: 'darkroom-cyclorama',
    title: 'За кулисами октабокса',
    category: 'film',
    categoryLabel: 'Плёнка и студия',
    year: '2026',
    location: 'Собственная студия',
    image: '/src/assets/images/photo_studio_backstage_1795454912322.jpg',
    aspectClass: 'aspect-[4/3]',
    gridSpanClass: 'md:col-span-7',
    camera: 'Pentax 67 · Kodak Portra 800',
    exif: '105mm · f/2.4 · 1/60s · ISO 800',
    story:
      'Так выглядит сам процесс: тёплый пилотный свет, средний формат на деревянном штативе, музыка и спокойный темп без суеты администратора за дверью.',
    suggestedFormatId: 'editorial',
    suggestedPrompt: 'Интересует камерная студийная съёмка с комбинированным тёплым светом',
  },
];

export const SHOOT_FORMATS: ShootFormat[] = [
  {
    id: 'portrait',
    index: '01.',
    title: 'Портретная сессия',
    subtitle: 'Для тех, кому нужны сильные честные портреты — для себя, сцены или личного профиля.',
    price: 18000,
    durationHours: 1.5,
    framesCount: 35,
    deliveryDays: 5,
    highlights: [
      'Помощь с образом и референсами до встречи',
      '2–3 световые схемы в студии или на улице',
      '35 кадров в авторской цветокоррекции и деликатной ретуши',
    ],
  },
  {
    id: 'editorial',
    index: '02.',
    title: 'Editorial и бренд',
    subtitle: 'Визуальная история для основателей, дизайнеров, музыкантов и локальных марок.',
    price: 32000,
    durationHours: 3,
    framesCount: 70,
    deliveryDays: 7,
    highlights: [
      'Сценарный мудборд и подбор архитектуры или интерьера',
      'Сочетание цифровой камеры и среднего формата',
      '70 финальных кадров в горизонтальной и вертикальной вёрстке',
    ],
  },
  {
    id: 'lovestory',
    index: '03.',
    title: 'История для двоих',
    subtitle: 'Тёплая прогулочная или домашняя серия без шаблонных поз — о том, как вы чувствуете друг друга.',
    price: 24000,
    durationHours: 2,
    framesCount: 55,
    deliveryDays: 6,
    highlights: [
      'Маршрут под закатный или утренний свет без толп',
      'Лёгкое направление в кадре — вы общаетесь, я ловлю ритм',
      '55 кадров + приватная онлайн-галерея для печати',
    ],
  },
];

export const SHOOT_ADDONS: ShootAddon[] = [
  {
    id: 'film-roll',
    label: 'Катушка плёнки Kodak Portra 35mm',
    note: 'Живое зерно, скан в лаборатории и 15 дополнительных кадров',
    price: 4500,
    extraFrames: 15,
  },
  {
    id: 'studio-rent',
    label: 'Бронь авторской студии с дневным светом',
    note: '2 часа аренды зала с циклорамой и фактурной мебелью',
    price: 5500,
  },
  {
    id: 'mua-stylist',
    label: 'Укладка и естественный макияж на площадке',
    note: 'Проверенный мастер, который понимает студийный и плёночный свет',
    price: 6500,
  },
  {
    id: 'express-48h',
    label: 'Готовая серия за 48 часов',
    note: 'Приоритетный отбор и цветокоррекция сразу после съёмки',
    price: 5000,
    overrideDeliveryDays: 2,
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01.',
    title: 'Короткий созвон и визуальный бриф',
    summary: 'За 15 минут определяем настроение, свет и одежду — без длинных анкет.',
    detail:
      'После вашей заявки я присылаю 2–3 визуальные подборки под ваш запрос. Мы сразу понимаем, нужен ли мягкий свет от окна, контрастная студийная графика или вечерняя прогулка.',
  },
  {
    number: '02.',
    title: 'Локация, время и гардероб',
    summary: 'Собираю 3 готовых комплекта из вашего гардероба и бронирую свет.',
    detail:
      'Вы присылаете фото вещей, которые вам близки — я подсказываю, какие фактуры лучше работают в кадре и не спорят с цветом кожи и окружением.',
  },
  {
    number: '03.',
    title: 'Съёмка в живом темпе',
    summary: 'Первые десять минут — настройка ритма и знакомство с камерой.',
    detail:
      'Я никогда не прошу «улыбнуться на счёт три». Вместо этого даю простые задачи в движении, показываю промежуточные кадры на экране и корректирую свет в реальном времени.',
  },
  {
    number: '04.',
    title: 'Отбор, цвет и галерея',
    summary: 'Сначала вы видите черновой контакт-лист или получаете готовую серию в срок.',
    detail:
      'Никакого пластикового сглаживания кожи — сохраняю живую текстуру, пленочную пластику теней и отдаю файлы в разрешении для веба и галерейной печати.',
  },
];

export const AVAILABLE_DATES = [
  { id: '2026-11-26', day: '26', month: 'нояб', weekday: 'Чт', spots: '2 окна' },
  { id: '2026-11-28', day: '28', month: 'нояб', weekday: 'Сб', spots: '1 окно' },
  { id: '2026-11-29', day: '29', month: 'нояб', weekday: 'Вс', spots: '3 окна' },
  { id: '2026-12-03', day: '03', month: 'дек', weekday: 'Чт', spots: '2 окна' },
  { id: '2026-12-05', day: '05', month: 'дек', weekday: 'Сб', spots: '2 окна' },
  { id: '2026-12-06', day: '06', month: 'дек', weekday: 'Вс', spots: '1 окно' },
];

export const TIME_SLOTS = [
  { id: '10:30', label: '10:30', note: 'Мягкий утренний свет' },
  { id: '14:00', label: '14:00', note: 'Студия или интерьер' },
  { id: '16:30', label: '16:30', note: 'Закатный / тёплый свет' },
];
