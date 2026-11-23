import React from 'react';
import { MessageSquarePlus, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { SHOOT_FORMATS } from '../data/studioData';

export interface UserReview {
  id: string;
  author: string;
  format: string;
  text: string;
  createdAt: string;
}

const STORAGE_KEY = 'exposure_user_reviews_v1';

export function ReviewsSection() {
  const [reviews, setReviews] = React.useState<UserReview[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [author, setAuthor] = React.useState('');
  const [format, setFormat] = React.useState(SHOOT_FORMATS[0].title);
  const [text, setText] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch {
      // Ignore storage quota errors
    }
  }, [reviews]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAuthor = author.trim();
    const cleanText = text.trim();

    if (cleanAuthor.length < 2) {
      setError('Укажите, пожалуйста, ваше имя.');
      return;
    }
    if (cleanText.length < 8) {
      setError('Напишите хотя бы пару слов о впечатлении от съёмки.');
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const newReview: UserReview = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      author: cleanAuthor,
      format,
      text: cleanText,
      createdAt: formattedDate,
    };

    setReviews((prev) => [newReview, ...prev]);
    setAuthor('');
    setText('');
    setError(null);
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section
      id="reviews"
      className="mx-auto max-w-[1320px] border-t border-white/[0.07] px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-[#FFB27C]">Отзывы</p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#FBF3EA]">
            Впечатления после съёмки
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            setError(null);
            setIsFormOpen((prev) => !prev);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-[#161311] px-5 py-2.5 text-sm font-medium text-[#FBF3EA] whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-200 hover:border-[#FFB27C] hover:text-[#FFB27C] focus-visible:outline-2 focus-visible:outline-[#FFB27C]"
        >
          {isFormOpen ? <X size={16} /> : <MessageSquarePlus size={16} />}
          <span>{isFormOpen ? 'Скрыть форму' : 'Добавить отзыв'}</span>
        </button>
      </div>

      {/* Add Review Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.form
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            noValidate
            className="mt-8 rounded-2xl border border-[#FFB27C]/30 bg-[#14100E] p-6 sm:p-8"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="review-author"
                  className="block text-xs font-medium text-[#FBF3EA]/75"
                >
                  Ваше имя
                </label>
                <input
                  id="review-author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Например, Анна"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-[#0B0A09] px-4 py-3 text-sm text-[#FBF3EA] placeholder:text-[#FBF3EA]/35 focus:border-[#FFB27C] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="review-format"
                  className="block text-xs font-medium text-[#FBF3EA]/75"
                >
                  Формат съёмки
                </label>
                <select
                  id="review-format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-[#0B0A09] px-4 py-3 text-sm text-[#FBF3EA] focus:border-[#FFB27C] focus:outline-none"
                >
                  {SHOOT_FORMATS.map((fmt) => (
                    <option key={fmt.id} value={fmt.title}>
                      {fmt.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="review-text"
                className="block text-xs font-medium text-[#FBF3EA]/75"
              >
                Ваш отзыв
              </label>
              <textarea
                id="review-text"
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Как прошла съёмка и какие кадры понравились больше всего?"
                className="mt-2 w-full rounded-xl border border-white/15 bg-[#0B0A09] px-4 py-3 text-sm text-[#FBF3EA] placeholder:text-[#FBF3EA]/35 focus:border-[#FFB27C] focus:outline-none"
              />
            </div>

            {error && (
              <p role="alert" className="mt-3 text-sm text-[#FF9C7A]">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-full px-5 py-2.5 text-sm font-medium text-[#FBF3EA]/70 cursor-pointer hover:text-[#FBF3EA]"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#FBF3EA] px-6 py-2.5 text-sm font-semibold text-[#110D0B] whitespace-nowrap cursor-pointer transition-colors hover:bg-[#FFB27C]"
              >
                Опубликовать отзыв
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reviews List or Empty State */}
      {reviews.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/15 bg-[#120F0D] p-8 sm:p-10 text-center">
          <p className="font-display text-2xl text-[#FBF3EA]/85">
            Пока здесь нет ни одного отзыва
          </p>
          <p className="mt-2 text-sm text-[#FBF3EA]/60">
            Если вы уже были у меня на съёмке, поделитесь впечатлениями через кнопку выше.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#14100E] p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-[#FBF3EA]/55">
                  <span className="text-[#FFB27C]">{item.format}</span>
                  <span>{item.createdAt}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#FBF3EA]/90">«{item.text}»</p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4">
                <p className="text-sm font-semibold text-[#FBF3EA]">{item.author}</p>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  aria-label="Удалить отзыв"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#FBF3EA]/45 cursor-pointer transition-colors hover:bg-white/5 hover:text-[#FF9C7A]"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
