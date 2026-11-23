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

// Standard classic watch dial numerals (12 at top, then 1..11 clockwise)
const CLASSIC_DIAL_NUMBERS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const TELEGRAM_HANDLE = 'Luccky33';

function getLightMood(hour: number): string {
  if (hour >= 5 && hour <= 11) return 'Утренний мягкий свет и свободные улицы для прогулки.';
  if (hour >= 12 && hour <= 15) return 'Яркий дневной свет — хорошо для залов с большими окнами.';
  if (hour >= 16 && hour <= 18) return 'Тёплое предзакатное солнце и мягкие тени на улице.';
  return 'Вечер или ночь — подходит для студии, интерьера или огней города.';
}

function nextShortestAngle(prevAngle: number, targetMod360: number): number {
  const currentMod = ((prevAngle % 360) + 360) % 360;
  let delta = targetMod360 - currentMod;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return prevAngle + delta;
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

  // Full 24h + 60m state (any time 00:00..23:59)
  const [selectedHour, setSelectedHour] = React.useState<number>(16);
  const [selectedMinute, setSelectedMinute] = React.useState<number>(30);
  const [dialMode, setDialMode] = React.useState<'hour' | 'minute'>('hour');

  // Cumulative angles for smooth clockwise/counter-clockwise shortest-path hand motion
  const [hourHandAngle, setHourHandAngle] = React.useState<number>(
    (16 % 12) * 30 + 30 * 0.5
  );
  const [minuteHandAngle, setMinuteHandAngle] = React.useState<number>(30 * 6);
  const [secondAngle, setSecondAngle] = React.useState<number>(() => {
    const now = new Date();
    return (now.getSeconds() + now.getMilliseconds() / 1000) * 6;
  });

  const dialRef = React.useRef<HTMLDivElement | null>(null);
  const [isDraggingDial, setIsDraggingDial] = React.useState(false);

  const [name, setName] = React.useState('');
  const [contact, setContact] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isReadyToSend, setIsReadyToSend] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const isPm = selectedHour >= 12;

  // Keep mechanical hands synced via shortest angular path whenever time changes
  React.useEffect(() => {
    const targetHourDeg = (selectedHour % 12) * 30 + selectedMinute * 0.5;
    const targetMinDeg = selectedMinute * 6;
    setHourHandAngle((prev) => nextShortestAngle(prev, targetHourDeg));
    setMinuteHandAngle((prev) => nextShortestAngle(prev, targetMinDeg));
  }, [selectedHour, selectedMinute]);

  // Continuously moving second hand around the clock face
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

  const updateTimeFromPointer = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = dialRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      if (deg < 0) deg += 360;

      if (dialMode === 'hour') {
        const hour12 = Math.round(deg / 30) % 12; // 0..11 (0 represents 12 on dial)
        const nextHour24 = isPm ? (hour12 === 0 ? 12 : hour12 + 12) : hour12;
        setSelectedHour(nextHour24);
      } else {
        const min = Math.round(deg / 6) % 60;
        setSelectedMinute(min);
      }
    },
    [dialMode, isPm]
  );

  const handleDialPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingDial(true);
    updateTimeFromPointer(e.clientX, e.clientY);
  };

  const handleDialPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingDial) return;
    updateTimeFromPointer(e.clientX, e.clientY);
  };

  const handleDialPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingDial) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDraggingDial(false);
  };

  const handleClassicNumberClick = (dialNum: number) => {
    if (dialMode === 'hour') {
      const base12 = dialNum % 12; // 12 -> 0
      const nextHour24 = isPm ? base12 + 12 : base12;
      setSelectedHour(nextHour24);
    } else {
      const min = (dialNum % 12) * 5; // 12 -> 00, 1 -> 05 ... 11 -> 55
      setSelectedMinute(min);
    }
  };

  const togglePeriod = (pm: boolean) => {
    setSelectedHour((prev) => {
      const mod12 = prev % 12;
      return pm ? mod12 + 12 : mod12;
    });
  };

  const handleDirectTimeChange = (value: string) => {
    const match = /^(\d{2}):(\d{2})$/.exec(value);
    if (!match) return;
    const h = Math.min(23, Math.max(0, Number(match[1])));
    const m = Math.min(59, Math.max(0, Number(match[2])));
    setSelectedHour(h);
    setSelectedMinute(m);
  };

  const activeMonth = CALENDAR_MONTHS[monthCursor];
  const activeFormat =
    SHOOT_FORMATS.find((f) => f.id === selectedFormatId) || SHOOT_FORMATS[0];
  const activeAddons = SHOOT_ADDONS.filter((a) => selectedAddons.includes(a.id));
  const totalPrice =
    activeFormat.price + activeAddons.reduce((sum, item) => sum + item.price, 0);

  const formattedDate = `${selectedDay.day} ${MONTH_GENITIVE[selectedDay.monthIndex]} ${selectedDay.year}`;
  const formattedTime = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;

  const switchMonth = (dir: -1 | 1) => {
    const next = monthCursor + dir;
    if (next < 0 || next >= CALENDAR_MONTHS.length) return;
    setMonthDir(dir);
    setMonthCursor(next);
  };

  const buildTelegramMessage = () => {
    const lines = [
      'Привет! Хочу записаться на съёмку (exposure).',
      '',
      `Услуга: ${activeFormat.title}`,
      `Дата и время: ${formattedDate}, ${formattedTime}`,
      activeAddons.length
        ? `Доп. опции: ${activeAddons.map((a) => a.label).join(', ')}`
        : 'Доп. опции: базовый пакет',
      `Ориентировочная стоимость: ${formatRubles(totalPrice)}`,
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

  // Highlighted classic numeral depending on mode
  const activeHourDialNum = selectedHour % 12 === 0 ? 12 : selectedHour % 12;
  const activeMinuteDialNum =
    selectedMinute % 5 === 0 ? (selectedMinute === 0 ? 12 : selectedMinute / 5) : null;

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
            Нажмите на свободный день в календаре, выставьте любое время на часах (переключая
            часы, минуты или 24-часовой формат) и отправьте заявку мне в Telegram{' '}
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
          {/* Left column: Animated Monthly Calendar + Classic Moving Analog Clock */}
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

            {/* Classic Analog Clock Dial (12, 1..11) supporting ANY 24h + 00..59 time */}
            <div className="rounded-2xl border border-white/12 bg-[#14100E]/85 backdrop-blur-md p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-[#FBF3EA]">
                  <Clock size={16} className="text-[#FFB27C]" aria-hidden="true" />
                  <span>Время съёмки</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Dial mode: Hour hand vs Minute hand */}
                  <div
                    role="group"
                    aria-label="Что выставлять на циферблате"
                    className="inline-flex items-center rounded-lg border border-white/15 bg-[#0B0A09]/80 p-0.5"
                  >
                    {(
                      [
                        { id: 'hour', label: 'Часы' },
                        { id: 'minute', label: 'Минуты' },
                      ] as const
                    ).map((mode) => {
                      const active = dialMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setDialMode(mode.id)}
                          className={`relative rounded-md px-2.5 py-1 text-xs cursor-pointer transition-colors whitespace-nowrap ${
                            active
                              ? 'text-[#110D0B] font-semibold'
                              : 'text-[#FBF3EA]/70 hover:text-[#FBF3EA]'
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="clock-dial-mode"
                              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                              className="absolute inset-0 rounded-md bg-[#FBF3EA]"
                            />
                          )}
                          <span className="relative z-10">{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Period toggle: 00-11 vs 12-23 */}
                  <div
                    role="group"
                    aria-label="Время суток"
                    className="inline-flex items-center rounded-lg border border-white/15 bg-[#0B0A09]/80 p-0.5"
                  >
                    <button
                      type="button"
                      onClick={() => togglePeriod(false)}
                      className={`relative rounded-md px-2.5 py-1 font-mono-tech text-xs cursor-pointer transition-colors whitespace-nowrap ${
                        !isPm
                          ? 'bg-[#FFB27C] text-[#110D0B] font-semibold'
                          : 'text-[#FBF3EA]/70 hover:text-[#FBF3EA]'
                      }`}
                    >
                      00–11
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePeriod(true)}
                      className={`relative rounded-md px-2.5 py-1 font-mono-tech text-xs cursor-pointer transition-colors whitespace-nowrap ${
                        isPm
                          ? 'bg-[#FFB27C] text-[#110D0B] font-semibold'
                          : 'text-[#FBF3EA]/70 hover:text-[#FBF3EA]'
                      }`}
                    >
                      12–23
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
                {/* Classic Analog Clock Face (12, 1, 2 .. 11) */}
                <div
                  ref={dialRef}
                  onPointerDown={handleDialPointerDown}
                  onPointerMove={handleDialPointerMove}
                  onPointerUp={handleDialPointerUp}
                  onPointerCancel={handleDialPointerUp}
                  className="relative h-64 w-64 shrink-0 select-none touch-none rounded-full border border-white/15 bg-[#0B0A09]/92 shadow-inner cursor-grab active:cursor-grabbing"
                >
                  {/* Concentric inner ring */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-3.5 rounded-full border border-white/[0.06]"
                  />

                  {/* 60 classic minute tick marks */}
                  {Array.from({ length: 60 }).map((_, idx) => {
                    const isMajor = idx % 5 === 0;
                    return (
                      <div
                        key={idx}
                        aria-hidden="true"
                        style={{ transform: `rotate(${idx * 6}deg)` }}
                        className={`pointer-events-none absolute left-1/2 top-1.5 -ml-[0.5px] origin-[50%_122px] ${
                          isMajor ? 'h-2 w-px bg-white/30' : 'h-1 w-px bg-white/10'
                        }`}
                      />
                    );
                  })}

                  {/* Classic Minute Hand */}
                  <motion.div
                    aria-hidden="true"
                    animate={{ rotate: minuteHandAngle }}
                    transition={
                      isDraggingDial && dialMode === 'minute'
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 200, damping: 22 }
                    }
                    className={`pointer-events-none absolute left-1/2 top-1/2 h-[92px] w-0.5 -ml-[1px] -mt-[92px] origin-bottom rounded-full transition-colors ${
                      dialMode === 'minute'
                        ? 'bg-[#FFB27C] shadow-[0_0_14px_rgba(255,178,124,0.55)]'
                        : 'bg-[#FBF3EA]/55'
                    }`}
                  />

                  {/* Classic Hour Hand */}
                  <motion.div
                    aria-hidden="true"
                    animate={{ rotate: hourHandAngle }}
                    transition={
                      isDraggingDial && dialMode === 'hour'
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 220, damping: 24 }
                    }
                    className={`pointer-events-none absolute left-1/2 top-1/2 h-[66px] w-1.5 -ml-[3px] -mt-[66px] origin-bottom rounded-full transition-colors ${
                      dialMode === 'hour'
                        ? 'bg-[#FFB27C] shadow-[0_0_16px_rgba(255,178,124,0.55)]'
                        : 'bg-[#FBF3EA]/80'
                    }`}
                  />

                  {/* Live Continuously Moving Second Hand */}
                  <div
                    aria-hidden="true"
                    style={{ transform: `rotate(${secondAngle}deg)` }}
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[112px] w-px -ml-[0.5px] -mt-[96px] origin-[50%_96px] bg-[#FFB27C]/80"
                  />

                  {/* Center pin */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#0B0A09] bg-[#FFB27C]"
                  />

                  {/* Classic Dial Numerals: 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 */}
                  {CLASSIC_DIAL_NUMBERS.map((num, index) => {
                    const angleRad = ((index * 30 - 90) * Math.PI) / 180;
                    const radius = 96; // px from center (256px diameter => center 128px)
                    const x = 128 + radius * Math.cos(angleRad);
                    const y = 128 + radius * Math.sin(angleRad);
                    const isSelected =
                      dialMode === 'hour'
                        ? activeHourDialNum === num
                        : activeMinuteDialNum === num;

                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleClassicNumberClick(num)}
                        style={{ left: `${x}px`, top: `${y}px` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full font-mono-tech text-sm transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FFB27C] ${
                          isSelected
                            ? 'bg-[#FFB27C] text-[#110D0B] font-bold scale-110 shadow-[0_0_18px_rgba(255,178,124,0.45)]'
                            : 'text-[#FBF3EA]/85 hover:bg-white/10 hover:text-[#FBF3EA]'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>

                {/* Live Digital Time + Exact Any-Time Picker */}
                <div className="flex-1 w-full text-center sm:text-left">
                  <p className="text-xs text-[#FBF3EA]/55">Выбранное время</p>
                  <p className="mt-1 font-mono-tech text-4xl font-medium tracking-tight text-[#FBF3EA]">
                    {formattedTime}
                  </p>
                  <p className="mt-1 font-mono-tech text-xs text-[#FFB27C]">
                    {formattedDate}
                  </p>

                  {/* Direct 24h time input so ANY exact minute (e.g. 07:17 or 21:43) can be set instantly */}
                  <div className="mt-4">
                    <label
                      htmlFor="exact-time-input"
                      className="block text-[11px] text-[#FBF3EA]/55"
                    >
                      Или введите любое время точно до минуты:
                    </label>
                    <input
                      id="exact-time-input"
                      type="time"
                      value={formattedTime}
                      onChange={(e) => handleDirectTimeChange(e.target.value)}
                      className="mt-1.5 w-full sm:w-auto rounded-xl border border-white/15 bg-[#0B0A09]/90 px-3.5 py-2 font-mono-tech text-sm text-[#FBF3EA] focus:border-[#FFB27C] focus:outline-none [color-scheme:dark]"
                    />
                  </div>

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
                    <p className="text-xs text-[#FBF3EA]/55">Выбранная услуга</p>
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

                {/* Quick service switcher */}
                <div className="mt-5">
                  <label className="block text-xs font-medium text-[#FBF3EA]/70">
                    Услуга
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
                    Email для ссылки на фото (по желанию)
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
                  вставлен весь текст заявки с выбранной датой и временем.
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

function activeAddonItemsSum(items: { price: number }[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
