import React from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PORTFOLIO_ITEMS, type PhotoCategory, type PortfolioItem } from '../data/studioData';
import {
  deleteUserPhoto,
  loadUserPhotos,
  readAndOptimizeImageFile,
  saveUserPhoto,
  type UserPortfolioPhoto,
} from '../utils/portfolioStorage';

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

const SERVICE_OPTIONS = PORTFOLIO_ITEMS.map((item) => ({
  id: item.category,
  label: item.title,
}));

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
  photoCount,
  onSelect,
}: {
  item: PortfolioItem;
  photoCount: number;
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
          <div className="flex items-center gap-2 text-sm">
            <span className="font-mono-tech text-[#FFB27C]">{item.index}</span>
            {photoCount > 0 && (
              <>
                <span aria-hidden="true" className="text-[#FBF3EA]/35">
                  ·
                </span>
                <span className="font-mono-tech text-xs text-[#FBF3EA]/65">
                  {photoCount} фото
                </span>
              </>
            )}
          </div>
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

function UserPhotoCard({
  photo,
  onOpen,
  onDelete,
}: {
  photo: UserPortfolioPhoto;
  onOpen: (photo: UserPortfolioPhoto) => void;
  onDelete: (id: string) => void;
}) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/12 bg-[#14100E] aspect-[4/3]"
    >
      <button
        type="button"
        onClick={() => onOpen(photo)}
        className="block h-full w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FFB27C]"
      >
        {!imgError ? (
          <img
            src={photo.src}
            alt={photo.title || photo.categoryLabel}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#1A1411] p-6 text-center">
            <Camera size={24} className="text-[#FFB27C]/70" />
            <span className="text-sm text-[#FBF3EA]/75">
              {photo.title || photo.categoryLabel}
            </span>
          </div>
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <p className="text-xs font-medium text-[#FFB27C]">{photo.categoryLabel}</p>
          {photo.title && (
            <p className="mt-0.5 font-display text-xl font-medium text-[#FBF3EA]">
              {photo.title}
            </p>
          )}
        </div>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(photo.id);
        }}
        aria-label="Удалить фото"
        className="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-[#FBF3EA]/80 backdrop-blur-md cursor-pointer transition-colors hover:border-[#FF9C7A] hover:text-[#FF9C7A]"
      >
        <Trash2 size={15} />
      </button>
    </motion.div>
  );
}

export function PortfolioGallery({ onRequestSimilar }: PortfolioGalleryProps) {
  const [filter, setFilter] = React.useState<PhotoCategory>('all');
  const [userPhotos, setUserPhotos] = React.useState<UserPortfolioPhoto[]>([]);

  // Add photo panel state
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [uploadCategory, setUploadCategory] =
    React.useState<Exclude<PhotoCategory, 'all'>>('wedding');
  const [photoTitle, setPhotoTitle] = React.useState('');
  const [photoUrlInput, setPhotoUrlInput] = React.useState('');
  const [pendingFiles, setPendingFiles] = React.useState<{ name: string; src: string }[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Lightbox for user-added photos
  const [lightboxPhoto, setLightboxPhoto] = React.useState<UserPortfolioPhoto | null>(null);

  React.useEffect(() => {
    loadUserPhotos().then(setUserPhotos);
  }, []);

  React.useEffect(() => {
    if (filter !== 'all') {
      setUploadCategory(filter);
    }
  }, [filter]);

  const activeItem = React.useMemo(
    () =>
      filter === 'all' ? null : PORTFOLIO_ITEMS.find((item) => item.category === filter) || null,
    [filter]
  );

  const visibleUserPhotos = React.useMemo(() => {
    if (filter === 'all') return userPhotos;
    return userPhotos.filter((p) => p.category === filter);
  }, [filter, userPhotos]);

  const activeIndex = activeItem
    ? PORTFOLIO_ITEMS.findIndex((item) => item.id === activeItem.id)
    : -1;

  const stepCategory = (dir: -1 | 1) => {
    if (activeIndex < 0) return;
    const nextIdx = (activeIndex + dir + PORTFOLIO_ITEMS.length) % PORTFOLIO_ITEMS.length;
    setFilter(PORTFOLIO_ITEMS[nextIdx].category);
  };

  const lightboxIndex = lightboxPhoto
    ? visibleUserPhotos.findIndex((p) => p.id === lightboxPhoto.id)
    : -1;

  const stepLightbox = React.useCallback(
    (dir: -1 | 1) => {
      if (!visibleUserPhotos.length || lightboxIndex < 0) return;
      const next = (lightboxIndex + dir + visibleUserPhotos.length) % visibleUserPhotos.length;
      setLightboxPhoto(visibleUserPhotos[next]);
    },
    [lightboxIndex, visibleUserPhotos]
  );

  React.useEffect(() => {
    if (!lightboxPhoto) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxPhoto(null);
      if (e.key === 'ArrowRight') stepLightbox(1);
      if (e.key === 'ArrowLeft') stepLightbox(-1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxPhoto, stepLightbox]);

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadError(null);
    setIsProcessing(true);
    try {
      const processed = await Promise.all(
        files
          .filter((f) => f.type.startsWith('image/'))
          .slice(0, 12)
          .map(async (file) => ({
            name: file.name,
            src: await readAndOptimizeImageFile(file),
          }))
      );
      if (!processed.length) {
        setUploadError('Выберите файлы изображений (JPG, PNG, WebP).');
      } else {
        setPendingFiles((prev) => [...prev, ...processed]);
      }
    } catch {
      setUploadError('Не удалось обработать выбранное изображение.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSavePhotos = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = photoUrlInput.trim();
    const sources: string[] = [...pendingFiles.map((f) => f.src)];
    if (trimmedUrl) {
      if (!/^https?:\/\/.+/i.test(trimmedUrl) && !trimmedUrl.startsWith('/')) {
        setUploadError('Укажите корректную ссылку на изображение (начинается с https://).');
        return;
      }
      sources.push(trimmedUrl);
    }

    if (!sources.length) {
      setUploadError('Выберите фото с устройства или вставьте ссылку.');
      return;
    }

    const catMeta =
      SERVICE_OPTIONS.find((s) => s.id === uploadCategory) || SERVICE_OPTIONS[0];
    const now = Date.now();
    const created: UserPortfolioPhoto[] = sources.map((src, idx) => ({
      id: `${now}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
      category: uploadCategory,
      categoryLabel: catMeta.label,
      title: photoTitle.trim(),
      src,
      createdAt: now + idx,
    }));

    for (const item of created) {
      await saveUserPhoto(item);
    }

    setUserPhotos((prev) => [...created.reverse(), ...prev]);
    setPendingFiles([]);
    setPhotoUrlInput('');
    setPhotoTitle('');
    setUploadError(null);
    setIsAddOpen(false);
  };

  const handleDeletePhoto = async (id: string) => {
    await deleteUserPhoto(id);
    setUserPhotos((prev) => prev.filter((p) => p.id !== id));
    if (lightboxPhoto?.id === id) setLightboxPhoto(null);
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

        <div className="flex flex-wrap items-center gap-3">
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

          <button
            type="button"
            onClick={() => {
              setUploadError(null);
              setIsAddOpen((prev) => !prev);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-[#161311] px-4 py-2.5 text-xs sm:text-sm font-medium text-[#FBF3EA] whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-200 hover:border-[#FFB27C] hover:text-[#FFB27C] focus-visible:outline-2 focus-visible:outline-[#FFB27C]"
          >
            {isAddOpen ? <X size={15} /> : <ImagePlus size={15} />}
            <span>{isAddOpen ? 'Закрыть' : 'Добавить фото'}</span>
          </button>
        </div>
      </div>

      {/* Add Photo Form */}
      <AnimatePresence>
        {isAddOpen && (
          <motion.form
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSavePhotos}
            noValidate
            className="mt-8 rounded-2xl border border-[#FFB27C]/30 bg-[#14100E]/95 p-6 sm:p-8"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="portfolio-upload-category"
                  className="block text-xs font-medium text-[#FBF3EA]/75"
                >
                  Раздел (услуга)
                </label>
                <select
                  id="portfolio-upload-category"
                  value={uploadCategory}
                  onChange={(e) =>
                    setUploadCategory(e.target.value as Exclude<PhotoCategory, 'all'>)
                  }
                  className="mt-2 w-full rounded-xl border border-white/15 bg-[#0B0A09] px-4 py-3 text-sm text-[#FBF3EA] focus:border-[#FFB27C] focus:outline-none"
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="portfolio-upload-title"
                  className="block text-xs font-medium text-[#FBF3EA]/75"
                >
                  Подпись к фото (необязательно)
                </label>
                <input
                  id="portfolio-upload-title"
                  type="text"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="Например, Летняя прогулка"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-[#0B0A09] px-4 py-3 text-sm text-[#FBF3EA] placeholder:text-[#FBF3EA]/35 focus:border-[#FFB27C] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 items-start">
              <div>
                <span className="block text-xs font-medium text-[#FBF3EA]/75">
                  Загрузить файлы с устройства
                </span>
                <input
                  ref={fileInputRef}
                  id="portfolio-upload-files"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesSelected}
                  className="sr-only"
                />
                <label
                  htmlFor="portfolio-upload-files"
                  className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-xl border border-dashed border-white/25 bg-[#0B0A09]/80 px-4 py-3.5 text-sm font-medium text-[#FBF3EA]/85 cursor-pointer transition-colors hover:border-[#FFB27C] hover:text-[#FFB27C]"
                >
                  <Upload size={16} />
                  <span>
                    {isProcessing ? 'Обрабатываю...' : 'Выбрать фото (можно несколько)'}
                  </span>
                </label>
              </div>

              <div>
                <label
                  htmlFor="portfolio-upload-url"
                  className="block text-xs font-medium text-[#FBF3EA]/75"
                >
                  Или вставить прямую ссылку на фото
                </label>
                <input
                  id="portfolio-upload-url"
                  type="url"
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-[#0B0A09] px-4 py-3 text-sm text-[#FBF3EA] placeholder:text-[#FBF3EA]/35 focus:border-[#FFB27C] focus:outline-none"
                />
              </div>
            </div>

            {pendingFiles.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3">
                {pendingFiles.map((file, idx) => (
                  <div
                    key={`${file.name}-${idx}`}
                    className="relative h-20 w-24 overflow-hidden rounded-xl border border-white/15 bg-[#0B0A09]"
                  >
                    <img
                      src={file.src}
                      alt={file.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPendingFiles((prev) => prev.filter((_, i) => i !== idx))
                      }
                      aria-label="Убрать выбранный файл"
                      className="absolute top-1 right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/75 text-[#FBF3EA] hover:text-[#FF9C7A]"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploadError && (
              <p role="alert" className="mt-4 text-sm text-[#FF9C7A]">
                {uploadError}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setPendingFiles([]);
                  setPhotoUrlInput('');
                  setIsAddOpen(false);
                }}
                className="rounded-full px-5 py-2.5 text-sm font-medium text-[#FBF3EA]/70 cursor-pointer hover:text-[#FBF3EA]"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="inline-flex items-center justify-center rounded-full bg-[#FBF3EA] px-6 py-2.5 text-sm font-semibold text-[#110D0B] whitespace-nowrap cursor-pointer transition-colors hover:bg-[#FFB27C] disabled:opacity-50"
              >
                Сохранить в портфолио
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Animated Content Switcher: Bento Grid of Animated Tabs OR Active Interactive Service Tab */}
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
                  photoCount={userPhotos.filter((p) => p.category === item.category).length}
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

      {/* User-Uploaded Real Photos Grid (shown whenever the photographer adds photos) */}
      {visibleUserPhotos.length > 0 && (
        <div className="mt-12 border-t border-white/10 pt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#FBF3EA]">
              {activeItem ? `Добавленные фото — ${activeItem.title}` : 'Добавленные фотографии'}
            </h3>
            <span className="font-mono-tech text-xs text-[#FBF3EA]/55">
              {visibleUserPhotos.length} шт.
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleUserPhotos.map((photo) => (
              <UserPhotoCard
                key={photo.id}
                photo={photo}
                onOpen={setLightboxPhoto}
                onDelete={handleDeletePhoto}
              />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox for User-Added Photos */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={lightboxPhoto.title || lightboxPhoto.categoryLabel}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 sm:p-8 backdrop-blur-md"
            onClick={() => setLightboxPhoto(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxPhoto(null)}
              aria-label="Закрыть просмотр"
              className="fixed top-4 right-4 z-[60] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-[#14100E]/90 text-[#FBF3EA] shadow-lg cursor-pointer transition-colors hover:border-[#FFB27C] hover:text-[#FFB27C]"
            >
              <X size={20} />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[86vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#14100E]"
            >
              <div className="relative flex flex-1 items-center justify-center bg-black">
                <img
                  src={lightboxPhoto.src}
                  alt={lightboxPhoto.title || lightboxPhoto.categoryLabel}
                  referrerPolicy="no-referrer"
                  className="max-h-[72vh] w-full object-contain"
                />
                {visibleUserPhotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => stepLightbox(-1)}
                      aria-label="Предыдущее фото"
                      className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/65 text-[#FBF3EA] cursor-pointer hover:border-[#FFB27C] hover:text-[#FFB27C]"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => stepLightbox(1)}
                      aria-label="Следующее фото"
                      className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/65 text-[#FBF3EA] cursor-pointer hover:border-[#FFB27C] hover:text-[#FFB27C]"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-4">
                <div>
                  <p className="text-xs font-medium text-[#FFB27C]">
                    {lightboxPhoto.categoryLabel}
                  </p>
                  {lightboxPhoto.title && (
                    <p className="mt-0.5 font-display text-2xl text-[#FBF3EA]">
                      {lightboxPhoto.title}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setLightboxPhoto(null)}
                  className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-[#FBF3EA]/80 cursor-pointer hover:border-white/35 hover:text-[#FBF3EA]"
                >
                  Вернуться в портфолио
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
