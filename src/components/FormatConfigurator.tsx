import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { SHOOT_ADDONS, SHOOT_FORMATS } from '../data/studioData';

interface FormatConfiguratorProps {
  selectedFormatId: string;
  onSelectFormat: (id: string) => void;
  selectedAddons: string[];
  onToggleAddon: (id: string) => void;
  onProceedToBooking: () => void;
}

export function formatRubles(amount: number): string {
  return new Intl.NumberFormat('ru-RU').format(amount) + ' ₽';
}

export function FormatConfigurator({
  selectedFormatId,
  onSelectFormat,
  selectedAddons,
  onToggleAddon,
  onProceedToBooking,
}: FormatConfiguratorProps) {
  const activeFormat =
    SHOOT_FORMATS.find((f) => f.id === selectedFormatId) || SHOOT_FORMATS[0];

  const activeAddonItems = SHOOT_ADDONS.filter((a) => selectedAddons.includes(a.id));

  const totalPrice =
    activeFormat.price + activeAddonItems.reduce((sum, item) => sum + item.price, 0);
  const totalFrames =
    activeFormat.framesCount +
    activeAddonItems.reduce((sum, item) => sum + (item.extraFrames || 0), 0);
  const fastestDelivery = activeAddonItems.reduce(
    (days, item) =>
      item.overrideDeliveryDays ? Math.min(days, item.overrideDeliveryDays) : days,
    activeFormat.deliveryDays
  );

  return (
    <section
      id="formats"
      className="border-t border-white/[0.07] bg-[#100D0B] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#FFB27C]">Форматы и калькулятор съёмки</p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#FBF3EA]">
            Соберите свою сессию под задачу
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#FBF3EA]/70">
            Выберите базовый формат и добавьте плёнку, студию или стилиста — стоимость и сроки
            пересчитываются сразу без скрытых доплат.
          </p>
        </div>

        {/* 3 Shoot Format Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {SHOOT_FORMATS.map((fmt) => {
            const isSelected = fmt.id === activeFormat.id;
            return (
              <motion.button
                key={fmt.id}
                type="button"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onSelectFormat(fmt.id)}
                className={`flex flex-col justify-between rounded-2xl border p-6 sm:p-8 text-left cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#FFB27C] ${
                  isSelected
                    ? 'border-[#FFB27C]/70 bg-[#1B1410]'
                    : 'border-white/10 bg-[#14100E] hover:border-white/25'
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-mono-tech text-sm text-[#FFB27C]">{fmt.index}</span>
                    <span className="font-mono-tech text-xs text-[#FBF3EA]/60">
                      {fmt.durationHours} ч · {fmt.framesCount} кадров
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-3xl font-medium text-[#FBF3EA]">
                    {fmt.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#FBF3EA]/70">
                    {fmt.subtitle}
                  </p>

                  <ul className="mt-6 space-y-2.5 border-t border-white/[0.08] pt-5">
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

                <div className="mt-8 flex items-center justify-between border-t border-white/[0.08] pt-5">
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
              </motion.button>
            );
          })}
        </div>

        {/* Add-ons + Live Summary Split */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#14100E] p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-[#FBF3EA]">
              Дополнительные опции к съёмке
            </h3>
            <div className="mt-5 divide-y divide-white/[0.08]">
              {SHOOT_ADDONS.map((addon) => {
                const checked = selectedAddons.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => onToggleAddon(addon.id)}
                    className="flex w-full items-start justify-between gap-4 py-4 first:pt-0 last:pb-0 text-left cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#FFB27C]"
                  >
                    <div className="flex items-start gap-3.5">
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                          checked
                            ? 'border-[#FFB27C] bg-[#FFB27C] text-[#110D0B]'
                            : 'border-white/25 bg-transparent group-hover:border-white/50'
                        }`}
                      >
                        {checked && <Check size={13} strokeWidth={2.5} />}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-[#FBF3EA]">{addon.label}</p>
                        <p className="mt-1 text-xs leading-relaxed text-[#FBF3EA]/60">
                          {addon.note}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono-tech text-sm text-[#FFB27C] whitespace-nowrap shrink-0">
                      +{formatRubles(addon.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Summary Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-[#FFB27C]/30 bg-[#18120F] p-6 sm:p-8">
            <div>
              <p className="text-xs font-medium text-[#FFB27C]">Итог вашей конфигурации</p>
              <h3 className="mt-2 font-display text-3xl font-medium text-[#FBF3EA]">
                {activeFormat.title}
              </h3>

              <dl className="mt-6 space-y-3 border-y border-white/10 py-5 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#FBF3EA]/65">Время съёмки</dt>
                  <dd className="font-mono-tech text-[#FBF3EA]">{activeFormat.durationHours} ч</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#FBF3EA]/65">Готовых фотографий</dt>
                  <dd className="font-mono-tech text-[#FBF3EA]">{totalFrames} кадров</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#FBF3EA]/65">Срок готовности</dt>
                  <dd className="font-mono-tech text-[#FBF3EA]">до {fastestDelivery} дней</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#FBF3EA]/65">Опции</dt>
                  <dd className="font-mono-tech text-[#FBF3EA]">
                    {activeAddonItems.length ? `${activeAddonItems.length} добавлено` : 'Базовый пакет'}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex items-baseline justify-between gap-4">
                <span className="text-sm text-[#FBF3EA]/70">Итоговая стоимость</span>
                <span className="font-mono-tech text-3xl font-medium text-[#FBF3EA]">
                  {formatRubles(totalPrice)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedToBooking}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FBF3EA] px-6 py-3.5 text-sm font-semibold text-[#110D0B] whitespace-nowrap cursor-pointer transition-colors duration-200 hover:bg-[#FFB27C] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#FFB27C]"
            >
              Зафиксировать и выбрать дату
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
