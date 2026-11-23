import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { SHOOT_FORMATS } from '../data/studioData';

interface FormatConfiguratorProps {
  selectedFormatId: string;
  onSelectFormat: (id: string) => void;
  onProceedToBooking: () => void;
}

export function formatRubles(amount: number): string {
  return new Intl.NumberFormat('ru-RU').format(amount) + ' ₽';
}

export function FormatConfigurator({
  selectedFormatId,
  onSelectFormat,
  onProceedToBooking,
}: FormatConfiguratorProps) {
  const activeFormat =
    SHOOT_FORMATS.find((f) => f.id === selectedFormatId) || SHOOT_FORMATS[0];

  return (
    <section
      id="formats"
      className="border-t border-white/[0.08] bg-[#0E0B0A]/72 backdrop-blur-[2px] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#FFB27C]">Услуги и стоимость</p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#FBF3EA]">
            Форматы съёмок и средние цены
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#FBF3EA]/70">
            Актуальный прайс по средним ценам в Москве. Выберите нужную услугу, чтобы
            перейти к записи на удобную дату и время.
          </p>
        </div>

        {/* 5 Shoot Format Cards in balanced 6-col grid (3 top + 2 bottom) */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
          {SHOOT_FORMATS.map((fmt, idx) => {
            const isSelected = fmt.id === activeFormat.id;
            const spanClass =
              idx < 3
                ? 'lg:col-span-2'
                : idx === 3
                ? 'lg:col-span-3'
                : 'md:col-span-2 lg:col-span-3';
            return (
              <motion.button
                key={fmt.id}
                type="button"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onSelectFormat(fmt.id)}
                className={`${spanClass} flex flex-col justify-between rounded-2xl border p-6 sm:p-7 text-left cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#FFB27C] ${
                  isSelected
                    ? 'border-[#FFB27C]/70 bg-[#1B1410]'
                    : 'border-white/10 bg-[#14100E] hover:border-white/25'
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-mono-tech text-sm text-[#FFB27C]">{fmt.index}</span>
                    <span className="font-mono-tech text-xs text-[#FBF3EA]/60">
                      {fmt.durationHours} ч · от {fmt.framesCount} фото
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-3xl font-medium text-[#FBF3EA]">
                    {fmt.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#FBF3EA]/70">
                    {fmt.subtitle}
                  </p>

                  <ul className="mt-5 space-y-2.5 border-t border-white/[0.08] pt-5">
                    {fmt.highlights.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-2.5 text-sm text-[#FBF3EA]/80"
                      >
                        <Check
                          size={15}
                          className="mt-0.5 shrink-0 text-[#FFB27C]"
                          aria-hidden="true"
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 border-t border-white/[0.08] pt-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono-tech text-xl font-medium text-[#FBF3EA]">
                      {formatRubles(fmt.price)}
                    </span>
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        isSelected ? 'text-[#FFB27C]' : 'text-[#FBF3EA]/55'
                      }`}
                    >
                      {isSelected ? 'Выбрано' : 'Выбрать'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#FBF3EA]/50">{fmt.priceNote}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Service Summary Bar */}
        <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-[#FFB27C]/30 bg-[#18120F] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium text-[#FFB27C]">Выбранная услуга</p>
            <h3 className="mt-1 font-display text-3xl font-medium text-[#FBF3EA]">
              {activeFormat.title}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#FBF3EA]/70">
              <span>
                Длительность:{' '}
                <strong className="font-mono-tech font-normal text-[#FBF3EA]">
                  {activeFormat.durationHours} ч
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Готовых фото:{' '}
                <strong className="font-mono-tech font-normal text-[#FBF3EA]">
                  от {activeFormat.framesCount} шт.
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Срок отдачи:{' '}
                <strong className="font-mono-tech font-normal text-[#FBF3EA]">
                  до {activeFormat.deliveryDays} дней
                </strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:shrink-0">
            <div className="sm:text-right">
              <p className="text-xs text-[#FBF3EA]/60">Стоимость</p>
              <p className="font-mono-tech text-2xl sm:text-3xl font-medium text-[#FBF3EA]">
                {formatRubles(activeFormat.price)}
              </p>
            </div>
            <button
              type="button"
              onClick={onProceedToBooking}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FBF3EA] px-6 py-3.5 text-sm font-semibold text-[#110D0B] whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-200 hover:bg-[#FFB27C] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#FFB27C]"
            >
              Перейти к выбору даты
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
