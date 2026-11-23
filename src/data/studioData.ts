export type PhotoCategory =
  | 'all'
  | 'wedding'
  | 'portrait'
  | 'family'
  | 'reportage'
  | 'lovestory';

export interface PortfolioItem {
  id: string;
  index: string;
  title: string;
  category: Exclude<PhotoCategory, 'all'>;
  categoryLabel: string;
  subtitle: string;
  gridSpanClass: string;
  story: string;
  scenarios: string[];
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

export interface ProcessStep {
  number: string;
  title: string;
  summary: string;
  detail: string;
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'service-wedding',
    index: '01.',
    title: 'Свадьба',
    category: 'wedding',
    categoryLabel: 'Свадьба',
    subtitle: 'ЗАГС, прогулка вдвоём и банкет',
    gridSpanClass: 'md:col-span-6 lg:col-span-7',
    story:
      'Снимаю регистрацию в ЗАГСе, выездную церемонию, прогулку пары и банкет. Можно заказать съёмку на пару часов, полдня или на весь свадебный день.',
    scenarios: [
      'Сборы пары и утро перед церемонией',
      'Регистрация в ЗАГСе или выездная роспись',
      'Прогулка вдвоём и общие кадры с гостями',
      'Банкет, тосты и первый танец',
    ],
    suggestedFormatId: 'wedding',
    suggestedPrompt: 'Нужен фотограф на свадьбу',
  },
  {
    id: 'service-portrait',
    index: '02.',
    title: 'Портретная съёмка',
    category: 'portrait',
    categoryLabel: 'Портретная съёмка',
    subtitle: 'Студия, улица или интерьер',
    gridSpanClass: 'md:col-span-6 lg:col-span-5',
    story:
      'Индивидуальная съёмка для себя, соцсетей или работы. Подсказываю с выбором студии, одежды и тем, как естественно держаться перед камерой.',
    scenarios: [
      'Студийные портреты с разным светом',
      'Прогулочные кадры на улицах города',
      'Деловые и рабочие портреты для профиля',
      'Камерная съёмка в квартире или кафе',
    ],
    suggestedFormatId: 'portrait',
    suggestedPrompt: 'Хочу записаться на портретную съёмку',
  },
  {
    id: 'service-reportage',
    index: '03.',
    title: 'Репортаж',
    category: 'reportage',
    categoryLabel: 'Репортаж',
    subtitle: 'Дни рождения, праздники и события',
    gridSpanClass: 'md:col-span-6 lg:col-span-5',
    story:
      'Съёмка праздников, юбилеев, корпоративов и любых других событий. Ловлю живые эмоции гостей, общие планы и важные моменты вечера.',
    scenarios: [
      'Дни рождения, юбилеи и семейные ужины',
      'Конференции, лекции и презентации',
      'Корпоративы и закрытые вечеринки',
      'Выставки, концерты и открытия площадок',
    ],
    suggestedFormatId: 'reportage',
    suggestedPrompt: 'Нужна репортажная съёмка мероприятия',
  },
  {
    id: 'service-family',
    index: '04.',
    title: 'Семейная фотосессия',
    category: 'family',
    categoryLabel: 'Семейная фотосессия',
    subtitle: 'Дома, в парке или в фотостудии',
    gridSpanClass: 'md:col-span-6 lg:col-span-7',
    story:
      'Спокойная съёмка с детьми, родителями и близкими без заученных поз. Выбираем удобное время под режим детей и комфортную для всей семьи локацию.',
    scenarios: [
      'Живая прогулка в парке всей семьёй',
      'Домашняя тёплая съёмка в привычной обстановке',
      'Светлая фотостудия с минимумом реквизита',
      'Памятные портреты нескольких поколений',
    ],
    suggestedFormatId: 'family',
    suggestedPrompt: 'Хотим семейную фотосессию',
  },
  {
    id: 'service-lovestory',
    index: '05.',
    title: 'Love story для двоих',
    category: 'lovestory',
    categoryLabel: 'Love story для двоих',
    subtitle: 'Прогулка по городу или на природе',
    gridSpanClass: 'md:col-span-12',
    story:
      'Парная съёмка на улице, на природе или в уютной студии. Отличный вариант для памятной даты, подготовки к свадьбе или просто хорошего дня вдвоём.',
    scenarios: [
      'Закатная прогулка за городом или у воды',
      'Утренний маршрут по центру без толп людей',
      'Предсвадебная съёмка для знакомства с камерой',
      'Уютная парная серия дома или в кофейне',
    ],
    suggestedFormatId: 'lovestory',
    suggestedPrompt: 'Интересует съёмка Love story для двоих',
  },
];

// Average market prices in Moscow (2025-2026)
export const SHOOT_FORMATS: ShootFormat[] = [
  {
    id: 'wedding',
    index: '01.',
    title: 'Свадьба',
    subtitle: 'ЗАГС, прогулка вдвоём и банкет — от пары часов до полного дня.',
    price: 40000,
    priceNote: 'полдня 6 ч (~10 тыс. ₽/ч) · полный день ~70 тыс. ₽',
    durationHours: 6,
    framesCount: 350,
    deliveryDays: 14,
    highlights: [
      'Помогаю с таймингом дня и подбором мест для прогулки',
      'Снимаю пару, регистрацию, детали и живые кадры гостей',
      'Первые 20–25 фотографий отдаю уже через пару дней',
    ],
  },
  {
    id: 'portrait',
    index: '02.',
    title: 'Портретная съёмка',
    subtitle: 'Индивидуальные фотографии в студии, городе или у вас дома.',
    price: 10000,
    priceNote: 'средняя цена в Москве ~8–12 тыс. ₽',
    durationHours: 1.5,
    framesCount: 50,
    deliveryDays: 5,
    highlights: [
      'Помогу подобрать студию и несколько комплектов одежды',
      'Подсказываю позы и ракурсы на протяжении всей съёмки',
      'От 50 готовых фото с естественной цветокоррекцией',
    ],
  },
  {
    id: 'family',
    index: '03.',
    title: 'Семейная фотосессия',
    subtitle: 'Тёплые семейные кадры с детьми, родителями или питомцами.',
    price: 14000,
    priceNote: 'средняя цена по рынку ~12–16 тыс. ₽',
    durationHours: 1.5,
    framesCount: 65,
    deliveryDays: 6,
    highlights: [
      'Снимаем в спокойном темпе без усталости для детей',
      'Делаем и общие портреты, и живые кадры в движении',
      'От 65 готовых фотографий в онлайн-галерее',
    ],
  },
  {
    id: 'reportage',
    index: '04.',
    title: 'Репортаж',
    subtitle: 'Дни рождения, праздники, корпоративы и любые мероприятия.',
    price: 16000,
    priceNote: 'от 8 000 ₽/час, выезд от 2 часов',
    durationHours: 2,
    framesCount: 150,
    deliveryDays: 4,
    highlights: [
      'Снимаю гостей, эмоции и основные моменты программы',
      'Анонс из 15–20 фотографий на следующий день',
      'От 150 отобранных и обработанных кадров',
    ],
  },
  {
    id: 'lovestory',
    index: '05.',
    title: 'Love story для двоих',
    subtitle: 'Парная фотосессия в городе, на природе или в светлой студии.',
    price: 15000,
    priceNote: 'средняя цена пакета ~12–18 тыс. ₽',
    durationHours: 2,
    framesCount: 70,
    deliveryDays: 6,
    highlights: [
      'Выбираем время с мягким светом и спокойный маршрут',
      'Комфортная съёмка без натянутых постановочных поз',
      'От 70 готовых фото + первые кадры на следующий день',
    ],
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01.',
    title: 'Обсуждаем задачу в Telegram',
    summary: 'Выбираете услугу, дату и время — дальше договариваемся о деталях.',
    detail:
      'Обсуждаем формат съёмки, подходящее место (студия, парк, ЗАГС или дом) и все ваши пожелания, чтобы на встрече уже не тратить на это время.',
  },
  {
    number: '02.',
    title: 'Готовимся по одежде и времени',
    summary: 'Подсказываю, что лучше надеть и какой свет будет в выбранный час.',
    detail:
      'При желании присылаете фото вариантов одежды — помогаю подобрать цвета и сочетания, чтобы всё аккуратно смотрелось в кадре.',
  },
  {
    number: '03.',
    title: 'Спокойно проводим съёмку',
    summary: 'Помогаю с позами и направляю в процессе — позировать уметь не нужно.',
    detail:
      'Во время съёмки показываю удачные кадры на экране камеры, подсказываю ракурсы и слежу, чтобы вы чувствовали себя свободно.',
  },
  {
    number: '04.',
    title: 'Отдаю готовые фотографии ссылкой',
    summary: 'Ссылка на облачную галерею в полном качестве и варианте для телефона.',
    detail:
      'Все снимки проходят аккуратную цветокоррекцию и лёгкую ретушь без замыливания кожи. Готовые фото приходят в оговорённый срок.',
  },
];
