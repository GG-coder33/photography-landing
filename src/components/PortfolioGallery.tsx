import React from 'react';
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PORTFOLIO_ITEMS, type PhotoCategory, type PortfolioItem } from '../data/studioData';

interface PortfolioGalleryProps {
  onRequestSimilar: (item: PortfolioItem) => void;
}

const CATEGORIES: { id: PhotoCategory; label: string }[] = [
  { id: 'all', label: 'Все услуги' },
  { id: 'wedding', label: 'Свадьба' },
  { id: 'portrait', label: 'Портретная съёмка' },
  { id: 'family', label: 'Семейная фотосессия' },
  { id: 'reportage', label: 'Репортаж' },
  { id: 'lovestory', label: 'Love story для двоих' },
];

function AnimatedOpticalArt({
  category,
  compact = false,
}: {
  category: Exclude<PhotoCategory, 'all'>;
  compact?: boolean;
}) {
  const [prefersReduced, setPrefersReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const sizeClass = compact ? 'h-44 w-44 sm:h-52 sm:w-52' : 'h-60 w-60 sm:h-72 sm:w-72';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative flex items-center justify-center"
    >
      {/* Ambient moving radial bloom */}
      <motion.div
        animate={
          prefersReduced
            ? undefined
            : {
                scale: [1, 1.12, 1],
                opacity: [0.32, 0.55, 0.32],
              }
        }
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute h-56 w-56 rounded-full bg-[#FFB27C]/18 blur-3xl"
      />

      {/* Category-specific animated optical geometry */}
      <div className={`relative flex items-center justify-center ${sizeClass}`}>
        <motion.svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full text-[#FFB27C]/30"
          animate={prefersReduced ? undefined : { rotate: 360 }}
          transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
        >
          <circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="6 10"
          />
          <circle
            cx="100"
            cy="100"
            r="74"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeOpacity="0.45"
          />
        </motion.svg>

        {category === 'wedding' || category === 'lovestory' ? (
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={
                prefersReduced
                  ? undefined
                  : { x: [-12, -6, -12], scale: [1, 1.05, 1] }
              }
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border border-[#FFB27C]/60 bg-[#FFB27C]/[0.04]"
            />
            <motion.div
              animate={
                prefersReduced
                  ? undefined
                  : { x: [12, 6, 12], scale: [1.04, 0.98, 1.04] }
              }
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="-ml-10 h-24 w-24 sm:h-28 sm:w-28 rounded-full border border-[#FBF3EA]/45 bg-[#FBF3EA]/[0.03]"
            />
          </div>
        ) : category === 'portrait' ? (
          <motion.div
            animate={
              prefersReduced
                ? undefined
                : { scale: [1, 1.04, 1], rotate: [0, 3, 0, -3, 0] }
            }
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex h-32 w-24 sm:h-36 sm:w-28 items-center justify-center rounded-xl border border-[#FFB27C]/55 bg-[#FFB27C]/[0.04]"
          >
            <div className="h-16 w-12 rounded-full border border-[#FBF3EA]/40" />
            <span className="absolute -inset-2 rounded-2xl border border-white/10" />
          </motion.div>
        ) : category === 'family' ? (
          <div className="relative flex items-center justify-center">
            {[0, 1, 2].map((idx) => (
              <motion.div
                key={idx}
                animate={
                  prefersReduced
                    ? undefined
                    : {
                        y: idx === 1 ? [-4, 4, -4] : [4, -4, 4],
                        scale: [1, 1.05, 1],
                      }
                }
                transition={{
                  duration: 4.5 + idx * 0.7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  width: idx === 1 ? 82 : 62,
                  height: idx === 1 ? 82 : 62,
                  marginLeft: idx === 0 ? 0 : -14,
                }}
                className="rounded-full border border-[#FFB27C]/50 bg-[#FFB27C]/[0.04]"
              />
            ))}
          </div>
        ) : (
          <div className="relative flex flex-col items-center justify-center gap-2.5">
            {[0, 1, 2, 3].map((row) => (
              <motion.div
                key={row}
                animate={
                  prefersReduced
                    ? undefined
                    : {
                        scaleX: [0.65, 1, 0.65],
                        opacity: [0.4, 0.9, 0.4],
                      }
                }
                transition={{
                  duration: 2.8,
                  delay: row * 0.28,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="h-1.5 w-28 sm:w-32 origin-center rounded-full bg-gradient-to-r from-transparent via-[#FFB27C]/70 to-transparent"
              />
            ))}
          </div>
        )}

        {/* Corner viewfinder brackets */}
        <span className="absolute top-3 left-3 h-3.5 w-3.5 border-t border-l border-[#FBF3EA]/45" />
        <span className="absolute top-3 right-3 h-3.5 w-3.5 border-t border-r border-[#FBF3EA]/45" />
        <span className="absolute bottom-3 left-3 h-3.5 w-3.5 border-b border-l border-[#FBF3EA]/45" />
        <span className="absolute bottom-3 right-3 h-3.5 w-3.5 border-b border-r border-[#FBF3EA]/45" />
      </div>
    </div>
  );
}

function AnimatedServiceCard({
  item,
  onSelect,
}: {
  item: PortfolioItem;
  onSelect: (item: PortfolioItem) => void;
}) {
  const cardRef = React.useRef<HTMLButtonElement | null>(null);
  const [tilt, setTilt] = React.useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  const handleMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = cardRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 6;
    const rx = (0.5 - py) * 6;
    setTilt({ rx, ry, gx: px * 100, gy: py * 100, active: true });
  };

  const handleLeave = () => {
    setTilt((prev) => ({ ...prev, rx: 0, ry: 0, active: false }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={item.gridSpanClass}
    >
      <button
        ref={cardRef}
        type="button"
        onClick={() => onSelect(item)}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={{
          transform: tilt.active
            ? `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(1.01,1.01,1.01)`
            : 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
        }}
        className="group relative flex min-h-[300px] sm:min-h-[330px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/12 bg-[#14100E]/90 p-6 sm:p-7 text-left cursor-pointer transition-all duration-200 ease-out hover:border-[#FFB27C]/45 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFB27C]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(460px circle at ${tilt.gx}% ${tilt.gy}%, rgba(255, 178, 124, 0.16), transparent 60%)`,
          }}
        />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <span className="font-mono-tech text-sm text-[#FFB27C]">{item.index}</span>
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/35 text-[#FBF3EA] transition-transform duration-200 group-hover:scale-110 group-hover:border-[#FFB27C]/60 group-hover:text-[#FFB27C]"
          >
            <ArrowUpRight size={16} />
          </span>
        </div>

        <div className="relative z-10 my-3 flex items-center justify-center">
          <AnimatedOpticalArt category={item.category} compact />
        </div>

        <div className="relative z-10">
          <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#FBF3EA] transition-colors group-hover:text-[#FFB27C]">
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-[#FBF3EA]/75">{item.subtitle}</p>
        </div>
      </button>
    </motion.div>
  );
}

export function PortfolioGallery({ onRequestSimilar }: PortfolioGalleryProps) {
  const [filter, setFilter] = React.useState<PhotoCategory>('all');

  const activeItem = React.useMemo(
    () =>
      filter === 'all' ? null : PORTFOLIO_ITEMS.find((item) => item.category === filter) || null,
    [filter]
  );

  const activeIndex = activeItem
    ? PORTFOLIO_ITEMS.findIndex((item) => item.id === activeItem.id)
    : -1;

  const stepCategory = (dir: -1 | 1) => {
    if (activeIndex < 0) return;
    const nextIdx = (activeIndex + dir + PORTFOLIO_ITEMS.length) % PORTFOLIO_ITEMS.length;
    setFilter(PORTFOLIO_ITEMS[nextIdx].category);
  };

  return (
    <section id="portfolio" className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#FFB27C]">Портфолио и услуги</p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#FBF3EA] max-w-xl">
            Какие съёмки я провожу
          </h2>
        </div>

        {/* Interactive Animated Tab Bar */}
        <div
          role="tablist"
          aria-label="Услуги и форматы съёмок"
          className="flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-[#161311] p-1"
        >
          {CATEGORIES.map((cat) => {
            const active = filter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(cat.id)}
                className={`relative rounded-lg px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#FFB27C] ${
                  active ? 'text-[#110D0B]' : 'text-[#FBF3EA]/70 hover:text-[#FBF3EA]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="portfolio-tab-highlight"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-[#FBF3EA]"
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Animated Content Switcher */}
      <div className="mt-10">
        <AnimatePresence mode="wait">
          {!activeItem ? (
            <motion.div
              key="all-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 gap-6 md:grid-cols-12"
            >
              {PORTFOLIO_ITEMS.map((item) => (
                <AnimatedServiceCard
                  key={item.id}
                  item={item}
                  onSelect={(chosen) => setFilter(chosen.category)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-2xl border border-[#FFB27C]/30 bg-[#14100E]/92 backdrop-blur-md"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Left: Interactive Animated Visual Stage */}
                <div className="relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden border-b border-white/10 bg-[#0D0B0A] p-8 lg:col-span-6 lg:border-b-0 lg:border-r">
                  <div className="absolute top-5 left-6 flex items-center gap-2 text-xs font-mono-tech text-[#FFB27C]">
                    <span>{activeItem.index}</span>
                    <span>{activeItem.title}</span>
                  </div>

                  <AnimatedOpticalArt category={activeItem.category} />

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => stepCategory(-1)}
                      aria-label="Предыдущая услуга"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-[#FBF3EA] cursor-pointer transition-colors hover:border-[#FFB27C] hover:text-[#FFB27C]"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="font-mono-tech text-xs text-[#FBF3EA]/60">
                      {activeIndex + 1} / {PORTFOLIO_ITEMS.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => stepCategory(1)}
                      aria-label="Следующая услуга"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-[#FBF3EA] cursor-pointer transition-colors hover:border-[#FFB27C] hover:text-[#FFB27C]"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Right: Service Description & Actions */}
                <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-6">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-medium text-[#FFB27C]">
                        Направление съёмки
                      </span>
                      <button
                        type="button"
                        onClick={() => setFilter('all')}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FBF3EA]/70 cursor-pointer transition-colors hover:text-[#FFB27C]"
                      >
                        <ArrowLeft size={14} />
                        <span>Все услуги</span>
                      </button>
                    </div>

                    <h3 className="mt-3 font-display text-3xl sm:text-4xl font-medium text-[#FBF3EA]">
                      {activeItem.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-[#FBF3EA]/65">{activeItem.subtitle}</p>
                    <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#FBF3EA]/85">
                      {activeItem.story}
                    </p>

                    <div className="mt-6 border-t border-white/10 pt-5">
                      <p className="text-xs font-medium text-[#FBF3EA]/55">
                        Что можно снять в этом формате
                      </p>
                      <ul className="mt-3 space-y-2.5">
                        {activeItem.scenarios.map((line) => (
                          <li
                            key={line}
                            className="flex items-start gap-2.5 text-sm text-[#FBF3EA]/85"
                          >
                            <span aria-hidden="true" className="text-[#FFB27C] shrink-0">
                              —
                            </span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onRequestSimilar(activeItem)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#FBF3EA] px-6 py-3.5 text-sm font-semibold text-[#110D0B] whitespace-nowrap cursor-pointer transition-colors hover:bg-[#FFB27C]"
                    >
                      <span>Записаться на эту съёмку</span>
                      <ArrowUpRight size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilter('all')}
                      className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3.5 text-sm font-medium text-[#FBF3EA]/80 whitespace-nowrap cursor-pointer transition-colors hover:border-white/35 hover:text-[#FBF3EA]"
                    >
                      Показать все
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
