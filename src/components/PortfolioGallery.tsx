import React from 'react';
import { ArrowUpRight, Camera, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PORTFOLIO_ITEMS, type PhotoCategory, type PortfolioItem } from '../data/studioData';

interface PortfolioGalleryProps {
  onRequestSimilar: (item: PortfolioItem) => void;
}

const CATEGORIES: { id: PhotoCategory; label: string }[] = [
  { id: 'all', label: 'Все серии' },
  { id: 'portrait', label: 'Портрет' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'lovestory', label: 'Для двоих' },
  { id: 'film', label: 'Плёнка и студия' },
];

function TiltPhotoCard({
  item,
  onSelect,
}: {
  item: PortfolioItem;
  onSelect: (item: PortfolioItem) => void;
}) {
  const cardRef = React.useRef<HTMLButtonElement | null>(null);
  const [tilt, setTilt] = React.useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
  const [imgError, setImgError] = React.useState(false);

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
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
        className={`group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-[#161311] text-left cursor-pointer transition-transform duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFB27C] ${item.aspectClass} max-h-[540px]`}
      >
        {!imgError ? (
          <img
            src={item.image}
            alt={`${item.title} — ${item.categoryLabel}`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#1C1613] to-[#110D0B] p-6 text-center">
            <Camera size={28} className="text-[#FFB27C]/70" />
            <span className="font-display text-2xl text-[#FBF3EA]">{item.title}</span>
          </div>
        )}

        {/* Interactive pointer specular sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(420px circle at ${tilt.gx}% ${tilt.gy}%, rgba(255, 178, 124, 0.14), transparent 60%)`,
          }}
        />

        {/* Measured contrast scrim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Top-right expand cue */}
        <span
          aria-hidden="true"
          className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/45 text-[#FBF3EA] backdrop-blur-md transition-transform duration-200 group-hover:scale-110 group-hover:border-[#FFB27C]/60 group-hover:text-[#FFB27C]"
        >
          <ArrowUpRight size={16} />
        </span>

        {/* Unboxed editorial metadata & title */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#FBF3EA]/75">
            <span className="font-medium text-[#FFB27C]">{item.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{item.year}</span>
            <span aria-hidden="true">·</span>
            <span>{item.location}</span>
          </div>
          <h3 className="mt-1.5 font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#FBF3EA]">
            {item.title}
          </h3>
          <p className="mt-1.5 font-mono-tech text-xs text-[#FBF3EA]/65">
            {item.camera} · {item.exif}
          </p>
        </div>
      </button>
    </motion.div>
  );
}

export function PortfolioGallery({ onRequestSimilar }: PortfolioGalleryProps) {
  const [filter, setFilter] = React.useState<PhotoCategory>('all');
  const [selected, setSelected] = React.useState<PortfolioItem | null>(null);

  const visibleItems = React.useMemo(() => {
    if (filter === 'all') return PORTFOLIO_ITEMS;
    return PORTFOLIO_ITEMS.filter((item) => item.category === filter);
  }, [filter]);

  const selectedIndex = selected
    ? visibleItems.findIndex((item) => item.id === selected.id)
    : -1;

  const stepLightbox = React.useCallback(
    (dir: -1 | 1) => {
      if (!visibleItems.length || selectedIndex < 0) return;
      const nextIndex = (selectedIndex + dir + visibleItems.length) % visibleItems.length;
      setSelected(visibleItems[nextIndex]);
    },
    [selectedIndex, visibleItems]
  );

  React.useEffect(() => {
    if (!selected) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
      if (e.key === 'ArrowRight') stepLightbox(1);
      if (e.key === 'ArrowLeft') stepLightbox(-1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected, stepLightbox]);

  return (
    <section id="portfolio" className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-[#FFB27C]">Избранные серии</p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#FBF3EA] max-w-xl">
            Кадры, где свет работает на характер
          </h2>
        </div>

        {/* Interactive filter tabs */}
        <div
          role="tablist"
          aria-label="Фильтр серий фотографий"
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
                className={`relative rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#FFB27C] ${
                  active ? 'text-[#110D0B]' : 'text-[#FBF3EA]/70 hover:text-[#FBF3EA]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="portfolio-filter-pill"
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

      {/* Bento / Masonry Grid */}
      <motion.div layout className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-12">
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item) => (
            <TiltPhotoCard key={item.id} item={item} onSelect={setSelected} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 sm:p-8 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border border-white/12 bg-[#14100E] lg:grid-cols-12"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Закрыть просмотр"
                className="absolute top-4 right-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/65 text-[#FBF3EA] cursor-pointer transition-colors hover:border-[#FFB27C] hover:text-[#FFB27C] focus-visible:outline-2 focus-visible:outline-[#FFB27C]"
              >
                <X size={18} />
              </button>

              <div className="relative flex items-center justify-center bg-black lg:col-span-7">
                <img
                  src={selected.image}
                  alt={selected.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[70vh] w-full object-contain"
                />
                {visibleItems.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => stepLightbox(-1)}
                      aria-label="Предыдущий кадр"
                      className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-[#FBF3EA] cursor-pointer hover:border-[#FFB27C] hover:text-[#FFB27C]"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => stepLightbox(1)}
                      aria-label="Следующий кадр"
                      className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-[#FBF3EA] cursor-pointer hover:border-[#FFB27C] hover:text-[#FFB27C]"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#FBF3EA]/65">
                    <span className="text-[#FFB27C] font-medium">{selected.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selected.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selected.location}</span>
                  </div>
                  <h3 className="mt-2 font-display text-3xl font-medium text-[#FBF3EA]">
                    {selected.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#FBF3EA]/80">{selected.story}</p>

                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="text-xs font-medium text-[#FBF3EA]/55">Параметры кадра</p>
                    <p className="mt-1.5 font-mono-tech text-xs text-[#FBF3EA]/85">
                      {selected.camera}
                    </p>
                    <p className="mt-1 font-mono-tech text-xs text-[#FFB27C]">{selected.exif}</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const chosen = selected;
                      setSelected(null);
                      onRequestSimilar(chosen);
                    }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FBF3EA] px-5 py-3 text-sm font-semibold text-[#110D0B] whitespace-nowrap cursor-pointer transition-colors hover:bg-[#FFB27C]"
                  >
                    Хочу похожую съёмку
                    <ArrowUpRight size={16} />
                  </button>
                  <p className="text-center text-xs text-[#FBF3EA]/50">
                    Формат и стиль сразу подставятся в заявку
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
