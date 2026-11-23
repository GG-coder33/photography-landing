import React from 'react';
import {
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Send,
  Sun,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { SHOOT_ADDONS, SHOOT_FORMATS } from '../data/studioData';
import { formatRubles } from './FormatConfigurator';

interface BookingSectionProps {
  selectedFormatId: string;
  onSelectFormat: (id: string) => void;
  selectedAddons: string[];
  briefText: string;
  onChangeBrief: (val: string) => void;
}

interface CalendarMonth {
  id: string;
  title: string;
  year: number;
  monthIndex: number; // 0-based
  daysInMonth: number;
  startOffset: number; // 0 = Mon .. 6 = Sun
  minAvailableDay: number;
  busyDays: number[];
}

const CALENDAR_MONTHS: CalendarMonth[] = [
  {
    id: '2026-11',
    title: 'Ноябрь',
    year: 2026,
    monthIndex: 10,
    daysInMonth: 30,
    startOffset: 6, // 1 Nov 2026 is Sunday -> 6
    minAvailableDay: 24,
    busyDays: [25, 27],
  },
  {
    id: '2026-12',
    title: 'Декабрь',
    year: 2026,
    monthIndex: 11,
    daysInMonth: 31,
    startOffset: 1, // 1 Dec 2026 is Tuesday -> 1
    minAvailableDay: 1,
    busyDays: [4, 11, 18, 25],
  },
];

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const MONTH_GENITIVE: Record<number, string> = {
  10: 'ноября',
  11: 'декабря',
};

// Studio hours 09..20 mapped cleanly to true 12-hour dial slots (index 0 = 12 o'clock at 0deg)
const CLOCK_HOURS = [12, 13, 14, 15, 16, 17, 18, 19, 20, 9, 10, 11];
const TELEGRAM_HANDLE = 'Luccky33';

function getLightMood(hour: number): string {
  if (hour <= 11) return 'Утренний мягкий свет и свободные улицы для прогулки.';
  if (hour <= 14) return 'Яркий дневной свет — хорошо для залов с большими окнами.';
  if (hour <= 17) return 'Тёплое предзакатное солнце и мягкие тени на улице.';
  return 'Вечер — подходит для студийного света или съёмки с огнями города.';
}

export function BookingSection({
  selectedFormatId,
  onSelectFormat,
  selectedAddons,
  briefText,
  onChangeBrief,
}: BookingSectionProps) {
  const [monthCursor, setMonthCursor] = React.useState(0);
  const [monthDir, setMonthDir] = React.useState(1);
  const [selectedDay, setSelectedDay] = React.useState<{
    year: number;
    monthIndex: number;
    day: number;
  }>({ year: 2026, monthIndex: 10, day: 28 });

  const [selectedHour, setSelectedHour] = React.useState<number>(16);
  const [selectedMinute, setSelectedMinute] = React.useState<'00' | '30'>('30');

  // Interactive clock dial drag & live moving second hand
  const dialRef = React.useRef<HTMLDivElement | null>(null);
  const [isDraggingDial, setIsDraggingDial] = React.useState(false);
  const [dragAngle, setDragAngle] = React.useState<number | null>(null);
  const [secondAngle, setSecondAngle] = React.useState<number>(() => {
    const now = new Date();
    return (now.getSeconds() + now.getMilliseconds() / 1000) * 6;
  });

  const [name, setName] = React.useState('');
  const [contact, setContact] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isReadyToSend, setIsReadyToSend] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Smoothly moving second hand around the clock face
  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const tick = () => {
      const now = new Date();
      const angle = (now.getSeconds() + now.getMilliseconds() / 1000) * 6;
      setSecondAngle(angle);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const updateHourFromPointer = React.useCallback((clientX: number, clientY: number) => {
    const el = dialRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;
    setDragAngle(deg);
    const slotIndex = Math.round(deg / 30) % 12;
    setSelectedHour(CLOCK_HOURS[slotIndex]);
  }, []);

  const handleDialPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingDial(true);
    updateHourFromPointer(e.clientX, e.clientY);
  };

  const handleDialPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingDial) return;
    updateHourFromPointer(e.clientX, e.clientY);
  };

  const handleDialPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingDial) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDraggingDial(false);
    setDragAngle(null);
  };

  const activeMonth = CALENDAR_MONTHS[monthCursor];
  const activeFormat =
    SHOOT_FORMATS.find((f) => f.id === selectedFormatId) || SHOOT_FORMATS[0];
  const activeAddons = SHOOT_ADDONS.filter((a) => selectedAddons.includes(a.id));
  const totalPrice =
    activeFormat.price + activeAddons.reduce((sum, item) => sum + item.price, 0);

  const formattedDate = `${selectedDay.day} ${MONTH_GENITIVE[selectedDay.monthIndex]} ${selectedDay.year}`;
  const formattedTime = `${String(selectedHour).padStart(2, '0')}:${selectedMinute}`;

  // Clock hand angles
  const targetHourAngle = (selectedHour % 12) * 30 + (selectedMinute === '30' ? 15 : 0);
  const hourAngle = isDraggingDial && dragAngle !== null ? dragAngle : targetHourAngle;
  const minuteAngle = selectedMinute === '30' ? 180 : 0;

  const switchMonth = (dir: -1 | 1) => {
    const next = monthCursor + dir;
    if (next < 0 || next >= CALENDAR_MONTHS.length) return;
    setMonthDir(dir);
    setMonthCursor(next);
  };

  const buildTelegramMessage = () => {
    const lines = [
      'Привет! Хочу записаться на фотосессию (exposure).',
      '',
      `Формат: ${activeFormat.title}`,
      `Дата и время: ${formattedDate}, ${formattedTime}`,
      activeAddons.length
        ? `Доп. опции: ${activeAddons.map((a) => a.label).join(', ')}`
        : 'Доп. опции: базовый пакет',
      `Ориентир по бюджету: ${formatRubles(totalPrice)}`,
      '',
      `Имя: ${name.trim()}`,
      `Контакт: ${contact.trim() || email.trim()}`,
    ];
    if (email.trim() && contact.trim()) {
      lines.push(`Email: ${email.trim()}`);
    }
    if (briefText.trim()) {
      lines.push(`Пожелания: ${briefText.trim()}`);
    }
    return lines.join('\n');
  };

  const telegramMessage = buildTelegramMessage();
  const telegramUrl = `https://t.me/${TELEGRAM_HANDLE}?text=${encodeURIComponent(telegramMessage)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanContact = contact.trim();
    const cleanEmail = email.trim();

    if (cleanName.length < 2) {
      setError('Напишите ваше имя.');
      return;
    }
    if (cleanContact.length < 3 && !cleanEmail.includes('@')) {
      setError('Укажите Telegram, телефон или email, чтобы я мог ответить.');
      return;
    }
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Похоже, в email есть опечатка — проверьте адрес.');
      return;
    }

    setError(null);
    setIsReadyToSend(true);
  };

  const handleCopyBrief = async () => {
    try {
      await navigator.clipboard.writeText(telegramMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      id="booking"
      className="relative border-t border-white/[0.08] bg-[#0B0A09]/70 backdrop-blur-[2px] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#FFB27C]">Запись на съёмку</p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#FBF3EA]">
            Выберите дату и время на часах
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#FBF3EA]/75">
            Нажмите на свободный день в календаре, покрутите или кликните час на циферблате — и
            отправьте готовую заявку мне в Telegram{' '}
            <a
              href={`https://t.me/${TELEGRAM_HANDLE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFB27C] underline decoration-[#FFB27C]/40 underline-offset-4 hover:decoration-[#FFB27C]"
            >
              @{TELEGRAM_HANDLE}
            </a>
            .
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Left column: Animated Monthly Calendar + Moving/Draggable Analog Clock */}
          <div className="lg:col-span-6 space-y-6">
            {/* Monthly Calendar */}
            <div className="rounded-2xl border border-white/12 bg-[#14100E]/85 backdrop-blur-md p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-[#FBF3EA]">
                  <CalendarIcon size={16} className="text-[#FFB27C]" aria-hidden="true" />
                  <span>
                    {activeMonth.title} {activeMonth.year}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={monthCursor === 0}
                    onClick={() => switchMonth(-1)}
                    aria-label="Предыдущий месяц"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-[#FBF3EA]/80 cursor-pointer transition-colors hover:border-[#FFB27C] hover:text-[#FFB27C] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    disabled={monthCursor === CALENDAR_MONTHS.length - 1}
                    onClick={() => switchMonth(1)}
                    aria-label="Следующий месяц"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-[#FBF3EA]/80 cursor-pointer transition-colors hover:border-[#FFB27C] hover:text-[#FFB27C] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-7 gap-1.5 text-center text-xs text-[#FBF3EA]/45">
                {WEEKDAYS.map((wd) => (
                  <div key={wd} className="py-1">
                    {wd}
                  </div>
                ))}
              </div>

              <div className="relative mt-2 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeMonth.id}
                    initial={{ opacity: 0, x: monthDir * 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -monthDir * 18 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-7 gap-1.5"
                  >
                    {Array.from({ length: activeMonth.startOffset }).map((_, i) => (
                      <div key={`empty-${i}`} aria-hidden="true" />
                    ))}

                    {Array.from({ length: activeMonth.daysInMonth }).map((_, idx) => {
                      const day = idx + 1;
                      const isPast = day < activeMonth.minAvailableDay;
                      const isBusy = activeMonth.busyDays.includes(day);
                      const disabled = isPast || isBusy;
                      const isSelected =
                        selectedDay.year === activeMonth.year &&
                        selectedDay.monthIndex === activeMonth.monthIndex &&
                        selectedDay.day === day;

                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={disabled}
                          onClick={() =>
                            setSelectedDay({
                              year: activeMonth.year,
                              monthIndex: activeMonth.monthIndex,
                              day,
                            })
                          }
                          className={`relative flex h-10 items-center justify-center rounded-xl font-mono-tech text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#FFB27C] ${
                            disabled
                              ? 'text-[#FBF3EA]/20 cursor-not-allowed line-through'
                              : isSelected
                              ? 'text-[#110D0B] font-semibold cursor-pointer'
                              : 'text-[#FBF3EA]/85 hover:bg-white/10 cursor-pointer'
                          }`}
                        >
                          {isSelected && (
                            <motion.span
                              layoutId="calendar-selected-day"
                              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                              className="absolute inset-0 rounded-xl bg-[#FFB27C]"
                            />
                          )}
                          <span className="relative z-10">{day}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive Clock Dial with moving second hand & draggable hour hand */}
            <div className="rounded-2xl border border-white/12 bg-[#14100E]/85 backdrop-blur-md p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-[#FBF3EA]">
                  <Clock size={16} className="text-[#FFB27C]" aria-hidden="true" />
                  <span>Время начала съёмки</span>
                </div>

                {/* Minute step toggle (:00 / :30) */}
                <div
                  role="group"
                  aria-label="Выбор минут"
                  className="inline-flex items-center rounded-lg border border-white/15 bg-[#0B0A09]/80 p-0.5"
                >
                  {(['00', '30'] as const).map((min) => {
                    const active = selectedMinute === min;
                    return (
                      <button
                        key={min}
                        type="button"
                        onClick={() => setSelectedMinute(min)}
                        className={`relative rounded-md px-3 py-1 font-mono-tech text-xs cursor-pointer transition-colors ${
                          active ? 'text-[#110D0B] font-semibold' : 'text-[#FBF3EA]/70 hover:text-[#FBF3EA]'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="clock-minute-pill"
                            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                            className="absolute inset-0 rounded-md bg-[#FBF3EA]"
                          />
                        )}
                        <span className="relative z-10">:{min}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
                {/* Analog Clock Dial */}
                <div
                  ref={dialRef}
                  onPointerDown={handleDialPointerDown}
                  onPointerMove={handleDialPointerMove}
                  onPointerUp={handleDialPointerUp}
                  onPointerCancel={handleDialPointerUp}
                  className="relative h-60 w-60 shrink-0 select-none touch-none rounded-full border border-white/15 bg-[#0B0A09]/90 shadow-inner cursor-grab active:cursor-grabbing"
                >
                  {/* Concentric dial ring & tick marks */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-3 rounded-full border border-white/[0.06]"
                  />
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <div
                      key={idx}
                      aria-hidden="true"
                      style={{ transform: `rotate(${idx * 30}deg)` }}
                      className="pointer-events-none absolute left-1/2 top-2 h-1.5 w-px -ml-[0.5px] origin-[50%_112px] bg-white/15"
                    />
                  ))}

                  {/* Minute Hand */}
                  <motion.div
                    aria-hidden="true"
                    animate={{ rotate: minuteAngle }}
                    transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[88px] w-0.5 -ml-[1px] -mt-[88px] origin-bottom rounded-full bg-white/30"
                  />

                  {/* Interactive Hour Hand */}
                  <motion.div
                    aria-hidden="true"
                    animate={{ rotate: hourAngle }}
                    transition={
                      isDraggingDial
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 240, damping: 22 }
                    }
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[72px] w-1 -ml-0.5 -mt-[72px] origin-bottom rounded-full bg-[#FFB27C] shadow-[0_0_16px_rgba(255,178,124,0.55)]"
                  />

                  {/* Continuously moving Second Hand */}
                  <div
                    aria-hidden="true"
                    style={{ transform: `rotate(${secondAngle}deg)` }}
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[108px] w-px -ml-[0.5px] -mt-[94px] origin-[50%_94px] bg-[#FFB27C]/75"
                  />

                  {/* Center pin */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#0B0A09] bg-[#FFB27C]"
                  />

                  {/* 12 Clickable Hour Buttons (09..20) */}
                  {CLOCK_HOURS.map((hour, index) => {
                    const angleRad = ((index * 30 - 90) * Math.PI) / 180;
                    const radius = 92;
                    const x = 120 + radius * Math.cos(angleRad);
                    const y = 120 + radius * Math.sin(angleRad);
                    const isSelected = selectedHour === hour;

                    return (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => setSelectedHour(hour)}
                        style={{ left: `${x}px`, top: `${y}px` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full font-mono-tech text-xs transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FFB27C] ${
                          isSelected
                            ? 'bg-[#FFB27C] text-[#110D0B] font-bold scale-110 shadow-[0_0_20px_rgba(255,178,124,0.45)]'
                            : 'text-[#FBF3EA]/75 hover:bg-white/10 hover:text-[#FBF3EA]'
                        }`}
                      >
                        {hour}
                      </button>
                    );
                  })}
                </div>

                {/* Live Digital Time & Light Mood */}
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs text-[#FBF3EA]/55">Начало съёмки</p>
                  <motion.p
                    key={formattedTime}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className="mt-1 font-mono-tech text-4xl font-medium tracking-tight text-[#FBF3EA]"
                  >
                    {formattedTime}
                  </motion.p>
                  <p className="mt-1 font-mono-tech text-xs text-[#FFB27C]">
                    {formattedDate}
                  </p>
                  <p className="mt-1.5 text-[11px] text-[#FBF3EA]/45">
                    Нажмите на цифру или потяните стрелку
                  </p>

                  <div className="mt-4 flex items-start justify-center sm:justify-start gap-2 rounded-xl border border-white/10 bg-[#0B0A09]/75 p-3 text-left">
                    <Sun
                      size={15}
                      className="mt-0.5 shrink-0 text-[#FFB27C]"
                      aria-hidden="true"
                    />
                    <p className="text-xs leading-relaxed text-[#FBF3EA]/80">
                      {getLightMood(selectedHour)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Booking Form -> Direct Telegram @Luccky33 Send */}
          <div className="lg:col-span-6">
            {!isReadyToSend ? (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="rounded-2xl border border-white/12 bg-[#14100E]/85 backdrop-blur-md p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs text-[#FBF3EA]/55">Выбранный формат</p>
                    <p className="mt-0.5 font-display text-2xl text-[#FBF3EA]">
                      {activeFormat.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#FBF3EA]/55">Стоимость</p>
                    <p className="mt-0.5 font-mono-tech text-xl font-medium text-[#FFB27C]">
                      {formatRubles(totalPrice)}
                    </p>
                  </div>
                </div>

                {/* Quick format switcher inside form */}
                <div className="mt-5">
                  <label className="block text-xs font-medium text-[#FBF3EA]/70">
                    Формат съёмки
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SHOOT_FORMATS.map((fmt) => {
                      const active = fmt.id === activeFormat.id;
                      return (
                        <button
                          key={fmt.id}
                          type="button"
                          onClick={() => onSelectFormat(fmt.id)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                            active
                              ? 'border-[#FFB27C] bg-[#FFB27C] text-[#110D0B]'
                              : 'border-white/15 bg-transparent text-[#FBF3EA]/80 hover:border-white/35'
                          }`}
                        >
                          {fmt.title}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="booking-name"
                      className="block text-xs font-medium text-[#FBF3EA]/75"
                    >
                      Как вас зовут
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Например, Алина"
                      className="mt-2 w-full rounded-xl border border-white/15 bg-[#0B0A09]/85 px-4 py-3 text-sm text-[#FBF3EA] placeholder:text-[#FBF3EA]/35 focus:border-[#FFB27C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="booking-contact"
                      className="block text-xs font-medium text-[#FBF3EA]/75"
                    >
                      Ваш Telegram или телефон
                    </label>
                    <input
                      id="booking-contact"
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="@username или +7 999 000-00-00"
                      className="mt-2 w-full rounded-xl border border-white/15 bg-[#0B0A09]/85 px-4 py-3 text-sm text-[#FBF3EA] placeholder:text-[#FBF3EA]/35 focus:border-[#FFB27C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="booking-email"
                    className="block text-xs font-medium text-[#FBF3EA]/75"
                  >
                    Email для ссылки на фото (если удобно)
                  </label>
                  <input
                    id="booking-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-[#0B0A09]/85 px-4 py-3 text-sm text-[#FBF3EA] placeholder:text-[#FBF3EA]/35 focus:border-[#FFB27C] focus:outline-none"
                  />
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="booking-brief"
                    className="block text-xs font-medium text-[#FBF3EA]/75"
                  >
                    Пожелания по съёмке
                  </label>
                  <textarea
                    id="booking-brief"
                    rows={3}
                    value={briefText}
                    onChange={(e) => onChangeBrief(e.target.value)}
                    placeholder="Где хотите сниматься, сколько человек будет, нужна ли помощь с выбором студии"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-[#0B0A09]/85 px-4 py-3 text-sm text-[#FBF3EA] placeholder:text-[#FBF3EA]/35 focus:border-[#FFB27C] focus:outline-none"
                  />
                </div>

                {error && (
                  <p role="alert" className="mt-4 text-sm text-[#FF9C7A]">
                    {error}
                  </p>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[#FBF3EA]/65">
                    Выбрано:{' '}
                    <span className="font-mono-tech text-[#FBF3EA]">
                      {formattedDate} · {formattedTime}
                    </span>
                  </p>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FBF3EA] px-7 py-3.5 text-sm font-semibold text-[#110D0B] whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-200 hover:bg-[#FFB27C] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#FFB27C]"
                  >
                    <Send size={15} />
                    <span>Отправить в @Luccky33</span>
                  </button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-[#FFB27C]/45 bg-[#17120F]/90 backdrop-blur-md p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 text-[#FFB27C]">
                  <CheckCircle2 size={24} />
                  <span className="font-mono-tech text-sm">
                    Заявка готова для @{TELEGRAM_HANDLE}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-3xl font-medium text-[#FBF3EA]">
                  {name.trim()}, осталось нажать кнопку отправки
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#FBF3EA]/75">
                  Нажмите на кнопку ниже — откроется ваш личный чат с{' '}
                  <span className="font-medium text-[#FBF3EA]">@{TELEGRAM_HANDLE}</span>, где уже
                  вставлен весь текст заявки с выбранной датой и стоимостью.
                </p>

                <pre className="mt-5 whitespace-pre-wrap rounded-xl border border-white/10 bg-[#0B0A09]/90 p-4 font-mono-tech text-xs leading-relaxed text-[#FBF3EA]/85">
                  {telegramMessage}
                </pre>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFB27C] px-6 py-3 text-sm font-semibold text-[#110D0B] whitespace-nowrap transition-colors hover:bg-[#FBF3EA]"
                  >
                    <Send size={15} />
                    <span>Отправить в Telegram @{TELEGRAM_HANDLE}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyBrief}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-[#FBF3EA] cursor-pointer transition-colors hover:border-[#FFB27C] hover:text-[#FFB27C]"
                  >
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                    {copied ? 'Скопировано' : 'Скопировать текст'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsReadyToSend(false)}
                    className="inline-flex items-center rounded-full px-4 py-2.5 text-sm font-medium text-[#FBF3EA]/70 cursor-pointer hover:text-[#FBF3EA]"
                  >
                    Изменить данные
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
