/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import HalftoneFlowHero, {
  type HalftonePaletteName,
} from '@/components/ui/halftone-flow-hero';
import { Header } from './components/Header';
import { GlobalHalftoneBackdrop } from './components/GlobalHalftoneBackdrop';
import { PortfolioGallery } from './components/PortfolioGallery';
import { FormatConfigurator } from './components/FormatConfigurator';
import { ProcessSection } from './components/ProcessSection';
import { ReviewsSection } from './components/ReviewsSection';
import { BookingSection } from './components/BookingSection';
import { type PortfolioItem } from './data/studioData';

const HERO_PROMPTS = [
  'Портрет в студии с тёплым боковым светом…',
  'Камерная love-story на закате у воды…',
  'Editorial-серия для бренда или журнала…',
  'Чёрно-белая плёночная съёмка в мастерской…',
];

const SHADER_PALETTES: { id: HalftonePaletteName; label: string; dot: string }[] = [
  { id: 'ember', label: 'Янтарь', dot: '#d9521d' },
  { id: 'cobalt', label: 'Кобальт', dot: '#3360f2' },
  { id: 'jade', label: 'Изумруд', dot: '#1f9a6b' },
];

export default function App() {
  const [palette, setPalette] = React.useState<HalftonePaletteName>('ember');
  const [dotSize, setDotSize] = React.useState<number>(7);
  const [selectedFormatId, setSelectedFormatId] = React.useState<string>('portrait');
  const [selectedAddons, setSelectedAddons] = React.useState<string[]>(['film-roll']);
  const [briefText, setBriefText] = React.useState<string>('');

  const scrollToBooking = React.useCallback(() => {
    const el = document.getElementById('booking');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleHeroSubmit = (promptValue: string) => {
    setBriefText(promptValue);
    const lower = promptValue.toLowerCase();
    if (lower.includes('love') || lower.includes('дво') || lower.includes('закат')) {
      setSelectedFormatId('lovestory');
    } else if (lower.includes('editorial') || lower.includes('бренд') || lower.includes('журнал')) {
      setSelectedFormatId('editorial');
    } else {
      setSelectedFormatId('portrait');
    }
    scrollToBooking();
  };

  const handleRequestSimilar = (item: PortfolioItem) => {
    setSelectedFormatId(item.suggestedFormatId);
    setBriefText(`${item.suggestedPrompt} (ориентир: «${item.title}»)`);
    if (item.category === 'film' && !selectedAddons.includes('film-roll')) {
      setSelectedAddons((prev) => [...prev, 'film-roll']);
    }
    scrollToBooking();
  };

  const handleToggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div id="top" className="relative min-h-screen bg-[#0B0A09] text-[#FBF3EA]">
      {/* Full-landing interactive WebGL halftone shader */}
      <GlobalHalftoneBackdrop palette={palette} dotSize={dotSize} />

      <div className="relative z-10">
        <Header onBookClick={scrollToBooking} />

        <main>
          {/* Interactive WebGL Halftone Flow Hero sharing the full-landing shader */}
          <HalftoneFlowHero
            transparentStage
            badge="Портреты · Editorial · 35mm плёнка"
            title={'Свет, характер\nи *живой кадр*'}
            description="Авторские фотосессии в Москве и на выезде. Подвигайте курсором по растровой волне и напишите в строку ниже, какую съёмку вы задумали."
            prompts={HERO_PROMPTS}
            ctaLabel="Обсудить съёмку"
            onSubmit={handleHeroSubmit}
            proof="Москва и выезд · Цифра, средний формат и 35mm плёнка"
            avatars={[]}
            palette={palette}
            dotSize={dotSize}
            height="max(640px, calc(100svh - 64px))"
          footerSlot={
            <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/15 bg-[#0B0A09]/75 px-4 py-2 text-xs text-[#FBF3EA]/80 backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <span className="text-[#FBF3EA]/55 mr-1">Тон света:</span>
                {SHADER_PALETTES.map((p) => {
                  const active = palette === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPalette(p.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                        active
                          ? 'bg-[#FBF3EA] text-[#110D0B]'
                          : 'text-[#FBF3EA]/75 hover:bg-white/10 hover:text-[#FBF3EA]'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: p.dot }}
                      />
                      {p.label}
                    </button>
                  );
                })}
              </div>

              <span className="hidden sm:inline text-white/15" aria-hidden="true">
                |
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-[#FBF3EA]/55 mr-1">Растр:</span>
                {[5, 7, 10].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setDotSize(size)}
                    className={`rounded-lg px-2 py-1 font-mono-tech whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                      dotSize === size
                        ? 'bg-white/15 text-[#FFB27C]'
                        : 'text-[#FBF3EA]/65 hover:text-[#FBF3EA]'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>
          }
        />

          {/* Animated Marquee Ribbon Divider */}
          <div
            aria-hidden="true"
            className="overflow-hidden border-y border-white/[0.08] bg-[#0B0A09]/70 backdrop-blur-[2px] py-3.5"
          >
            <div className="animate-marquee font-display text-lg italic tracking-wide text-[#FBF3EA]/65">
              {Array.from({ length: 6 }).map((_, idx) => (
                <span key={idx} className="mx-6 whitespace-nowrap">
                  избранные серии · портрет · editorial · 35mm плёнка · живой свет · студия и выезд
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio Bento Grid + 3D Tilt Cards + Lightbox */}
          <div className="bg-[#0B0A09]/58 backdrop-blur-[1px]">
            <PortfolioGallery onRequestSimilar={handleRequestSimilar} />
          </div>

          {/* Interactive Shoot Format & Add-ons Configurator */}
          <FormatConfigurator
            selectedFormatId={selectedFormatId}
            onSelectFormat={setSelectedFormatId}
            selectedAddons={selectedAddons}
            onToggleAddon={handleToggleAddon}
            onProceedToBooking={scrollToBooking}
          />

          {/* Editorial 4-Step Process & Studio Split */}
          <div className="bg-[#0B0A09]/58 backdrop-blur-[1px]">
            <ProcessSection />
          </div>

          {/* Empty-by-default Reviews Tab with "Добавить отзыв" */}
          <div className="bg-[#0B0A09]/65 backdrop-blur-[2px]">
            <ReviewsSection />
          </div>

          {/* Interactive Session Booking */}
          <BookingSection
            selectedFormatId={selectedFormatId}
            onSelectFormat={setSelectedFormatId}
            selectedAddons={selectedAddons}
            briefText={briefText}
            onChangeBrief={setBriefText}
          />
        </main>

        {/* Quiet Editorial Footer */}
        <footer className="border-t border-white/[0.08] bg-[#0B0A09]/85 backdrop-blur-md py-10">
          <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <span className="font-display text-2xl font-medium text-[#FBF3EA]">exposure</span>
              <p className="mt-1 text-xs text-[#FBF3EA]/55">
                Москва · Санкт-Петербург · Выезд по всему миру
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-[#FBF3EA]/70">
              <a href="#portfolio" className="hover:text-[#FBF3EA] whitespace-nowrap">
                Портфолио
              </a>
              <a href="#formats" className="hover:text-[#FBF3EA] whitespace-nowrap">
                Форматы
              </a>
              <a href="#process" className="hover:text-[#FBF3EA] whitespace-nowrap">
                Процесс
              </a>
              <a href="#reviews" className="hover:text-[#FBF3EA] whitespace-nowrap">
                Отзывы
              </a>
              <a href="mailto:hello@exposure.photo" className="hover:text-[#FFB27C] whitespace-nowrap">
                hello@exposure.photo
              </a>
            </div>

            <p className="text-xs text-[#FBF3EA]/45">© 2026 exposure</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
