import React from 'react';
import { Calendar, CheckCircle2, Copy, Check, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import {
  AVAILABLE_DATES,
  SHOOT_ADDONS,
  SHOOT_FORMATS,
  TIME_SLOTS,
} from '../data/studioData';
import { formatRubles } from './FormatConfigurator';

interface BookingSectionProps {
  selectedFormatId: string;
  onSelectFormat: (id: string) => void;
  selectedAddons: string[];
  briefText: string;
  onChangeBrief: (val: string) => void;
}

export function BookingSection({
  selectedFormatId,
  onSelectFormat,
  selectedAddons,
  briefText,
  onChangeBrief,
}: BookingSectionProps) {
  const [selectedDate, setSelectedDate] = React.useState(AVAILABLE_DATES[0].id);
  const [selectedTime, setSelectedTime] = React.useState(TIME_SLOTS[2].id);
  const [name, setName] = React.useState('');
  const [contact, setContact] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [submittedCode, setSubmittedCode] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const activeFormat =
    SHOOT_FORMATS.find((f) => f.id === selectedFormatId) || SHOOT_FORMATS[0];
  const activeAddons = SHOOT_ADDONS.filter((a) => selectedAddons.includes(a.id));
  const totalPrice =
    activeFormat.price + activeAddons.reduce((sum, item) => sum + item.price, 0);

  const activeDateObj =
    AVAILABLE_DATES.find((d) => d.id === selectedDate) || AVAILABLE_DATES[0];
  const activeTimeObj = TIME_SLOTS.find((t) => t.id === selectedTime) || TIME_SLOTS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanContact = contact.trim();
    const cleanEmail = email.trim();

    if (cleanName.length < 2) {
      setError('Укажите, пожалуйста, ваше имя.');
      return;
    }
    if (cleanContact.length < 3 && !cleanEmail.includes('@')) {
      setError('Оставьте Telegram, телефон или корректный email для связи.');
      return;
    }
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Проверьте формат email — похоже, в адресе есть опечатка.');
      return;
    }

    setError(null);
    const code = `VR-${activeDateObj.day}${activeDateObj.month.slice(0, 1).toUpperCase()}-${Math.floor(
      100 + Math.random() * 899
    )}`;
    setSubmittedCode(code);
  };

  const summaryText = `Заявка ${submittedCode || ''}\nФормат: ${activeFormat.title}\nДата: ${activeDateObj.day} ${activeDateObj.month} (${activeDateObj.weekday}), ${activeTimeObj.label}\nИтого: ${formatRubles(totalPrice)}\nИмя: ${name}\nКонтакт: ${contact || email}\nИдея: ${briefText || 'Обсудим на созвоне'}`;

  const handleCopyBrief = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      id="booking"
      className="border-t border-white/[0.07] bg-[#100D0B] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          {/* Left column: Date & Time Selection + Selected Summary */}
          <div className="lg:col-span-5">
            <p className="text-sm font-medium text-[#FFB27C]">Онлайн-бронирование</p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#FBF3EA]">
              Выберите дату и время съёмки
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#FBF3EA]/70">
              Бронь не требует предоплаты сразу — я свяжусь с вами в течение дня, чтобы
              подтвердить локацию, свет и детали.
            </p>

            {/* Date Picker */}
            <div className="mt-8">
              <div className="flex items-center gap-2 text-xs font-medium text-[#FBF3EA]/75">
                <Calendar size={14} className="text-[#FFB27C]" aria-hidden="true" />
                <span>Ближайшие свободные даты</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {AVAILABLE_DATES.map((date) => {
                  const active = selectedDate === date.id;
                  return (
                    <button
                      key={date.id}
                      type="button"
                      onClick={() => setSelectedDate(date.id)}
                      className={`rounded-xl border px-3 py-3 text-left cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#FFB27C] ${
                        active
                          ? 'border-[#FFB27C] bg-[#1E1612]'
                          : 'border-white/10 bg-[#15110F] hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="font-mono-tech text-lg font-medium text-[#FBF3EA]">
                          {date.day} {date.month}
                        </span>
                        <span className="text-xs text-[#FBF3EA]/55">{date.weekday}</span>
                      </div>
                      <p className="mt-1 text-xs text-[#FFB27C]">{date.spots}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-xs font-medium text-[#FBF3EA]/75">
                <Clock size={14} className="text-[#FFB27C]" aria-hidden="true" />
                <span>Предпочтительное время старта</span>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {TIME_SLOTS.map((slot) => {
                  const active = selectedTime === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedTime(slot.id)}
                      className={`rounded-xl border px-3.5 py-2.5 text-left cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#FFB27C] ${
                        active
                          ? 'border-[#FFB27C] bg-[#1E1612]'
                          : 'border-white/10 bg-[#15110F] hover:border-white/25'
                      }`}
                    >
                      <span className="block font-mono-tech text-sm font-medium text-[#FBF3EA]">
                        {slot.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-[#FBF3EA]/60">
                        {slot.note}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column: Booking Form or Confirmation Pass */}
          <div className="lg:col-span-7">
            {!submittedCode ? (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="rounded-2xl border border-white/10 bg-[#14100E] p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs text-[#FBF3EA]/55">Выбранный формат</p>
                    <p className="mt-0.5 font-display text-2xl text-[#FBF3EA]">
                      {activeFormat.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#FBF3EA]/55">Предварительная оценка</p>
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
                          className={`rounded-lg border px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
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
                      Ваше имя
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Например, Алиса"
                      className="mt-2 w-full rounded-xl border border-white/15 bg-[#0B0A09] px-4 py-3 text-sm text-[#FBF3EA] placeholder:text-[#FBF3EA]/35 focus:border-[#FFB27C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="booking-contact"
                      className="block text-xs font-medium text-[#FBF3EA]/75"
                    >
                      Telegram или телефон
                    </label>
                    <input
                      id="booking-contact"
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="@username или +7 999 000-00-00"
                      className="mt-2 w-full rounded-xl border border-white/15 bg-[#0B0A09] px-4 py-3 text-sm text-[#FBF3EA] placeholder:text-[#FBF3EA]/35 focus:border-[#FFB27C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="booking-email"
                    className="block text-xs font-medium text-[#FBF3EA]/75"
                  >
                    Email для отправки мудборда и галереи (необязательно)
                  </label>
                  <input
                    id="booking-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-[#0B0A09] px-4 py-3 text-sm text-[#FBF3EA] placeholder:text-[#FBF3EA]/35 focus:border-[#FFB27C] focus:outline-none"
                  />
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="booking-brief"
                    className="block text-xs font-medium text-[#FBF3EA]/75"
                  >
                    Идея, настроение или ссылка на референсы
                  </label>
                  <textarea
                    id="booking-brief"
                    rows={3}
                    value={briefText}
                    onChange={(e) => onChangeBrief(e.target.value)}
                    placeholder="Расскажите в двух словах, какие кадры хотите получить — студия, улица, плёнка или особый повод"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-[#0B0A09] px-4 py-3 text-sm text-[#FBF3EA] placeholder:text-[#FBF3EA]/35 focus:border-[#FFB27C] focus:outline-none"
                  />
                </div>

                {error && (
                  <p role="alert" className="mt-4 text-sm text-[#FF9C7A]">
                    {error}
                  </p>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[#FBF3EA]/55">
                    Выбран слот:{' '}
                    <span className="font-mono-tech text-[#FBF3EA]">
                      {activeDateObj.day} {activeDateObj.month}, {activeTimeObj.label}
                    </span>
                  </p>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-[#FBF3EA] px-7 py-3.5 text-sm font-semibold text-[#110D0B] whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-200 hover:bg-[#FFB27C] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#FFB27C]"
                  >
                    Отправить заявку
                  </button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-[#FFB27C]/45 bg-[#17120F] p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 text-[#FFB27C]">
                  <CheckCircle2 size={24} />
                  <span className="font-mono-tech text-sm">Заявка {submittedCode} принята</span>
                </div>

                <h3 className="mt-3 font-display text-3xl font-medium text-[#FBF3EA]">
                  {name}, слот предварительно закреплён
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#FBF3EA]/75">
                  Я свяжусь с вами по контакту{' '}
                  <span className="text-[#FBF3EA] font-medium">{contact || email}</span>,
                  чтобы обсудить локацию и прислать визуальные референсы.
                </p>

                <dl className="mt-6 space-y-3 border-y border-white/10 py-5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#FBF3EA]/60">Дата и старт</dt>
                    <dd className="font-mono-tech text-[#FBF3EA]">
                      {activeDateObj.day} {activeDateObj.month} ({activeDateObj.weekday}) ·{' '}
                      {activeTimeObj.label}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#FBF3EA]/60">Формат</dt>
                    <dd className="text-[#FBF3EA]">{activeFormat.title}</dd>
                  </div>
                  {activeAddons.length > 0 && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#FBF3EA]/60">Опции</dt>
                      <dd className="text-right text-[#FBF3EA]">
                        {activeAddons.map((a) => a.label).join(', ')}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#FBF3EA]/60">Бюджет</dt>
                    <dd className="font-mono-tech font-medium text-[#FFB27C]">
                      {formatRubles(totalPrice)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopyBrief}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-[#FBF3EA] cursor-pointer transition-colors hover:border-[#FFB27C] hover:text-[#FFB27C]"
                  >
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                    {copied ? 'Скопировано' : 'Скопировать детали'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmittedCode(null)}
                    className="inline-flex items-center rounded-full px-4 py-2.5 text-sm font-medium text-[#FBF3EA]/70 cursor-pointer hover:text-[#FBF3EA]"
                  >
                    Изменить заявку
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
