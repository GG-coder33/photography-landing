import React from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PROCESS_STEPS } from '../data/studioData';

export function ProcessSection() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [imgError, setImgError] = React.useState(false);

  return (
    <section
      id="process"
      className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-stretch">
        {/* Left: Balanced visual studio frame */}
        <div className="lg:col-span-5">
          <div className="relative h-full min-h-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#14100E]">
            {!imgError ? (
              <img
                src="/src/assets/images/photo_studio_backstage_1795454912322.jpg"
                alt="Атмосфера фотостудии Артёма Воронцова со средним форматом и тёплым светом"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#18120F] p-8 text-center">
                <p className="font-display text-2xl text-[#FBF3EA]/70">
                  Студийное пространство · Москва
                </p>
              </div>
            )}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-xs text-[#FFB27C]">Процесс съёмки</p>
              <p className="mt-1 font-display text-2xl text-[#FBF3EA]">
                «Вам не нужно уметь позировать — достаточно прийти, остальное настроим вместе»
              </p>
            </div>
          </div>
        </div>

        {/* Right: 4 Editorial Steps */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <p className="text-sm font-medium text-[#FFB27C]">Как всё проходит</p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#FBF3EA]">
            Четыре спокойных шага до готовой серии
          </h2>

          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {PROCESS_STEPS.map((step, idx) => {
              const isOpen = activeIndex === idx;
              return (
                <div key={step.number} className="py-5">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setActiveIndex(idx)}
                    className="flex w-full items-start justify-between gap-4 text-left cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#FFB27C]"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono-tech text-sm text-[#FFB27C] shrink-0">
                        {step.number}
                      </span>
                      <div>
                        <h3 className="text-lg font-medium text-[#FBF3EA] transition-colors group-hover:text-[#FFB27C]">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm text-[#FBF3EA]/65">{step.summary}</p>
                      </div>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`mt-1 shrink-0 text-[#FBF3EA]/55 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#FFB27C]' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="pl-10 pt-3 pr-6"
                      >
                        <p className="text-sm leading-relaxed text-[#FBF3EA]/80">{step.detail}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
