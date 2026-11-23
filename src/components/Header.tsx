import React from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface HeaderProps {
  onBookClick: () => void;
}

const NAV_LINKS = [
  { href: '#portfolio', label: 'Портфолио' },
  { href: '#formats', label: 'Цены' },
  { href: '#process', label: 'Процесс' },
  { href: '#reviews', label: 'Отзывы' },
];

export function Header({ onBookClick }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0A09]/85 backdrop-blur-md border-b border-white/[0.07]">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line brand wordmark */}
        <a
          href="#top"
          className="font-display text-2xl font-medium tracking-tight text-[#FBF3EA] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFB27C]"
        >
          exposure
        </a>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav
          aria-label="Основная навигация"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#FBF3EA]/70"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-[#FBF3EA] after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-[#FFB27C] after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFB27C]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary CTA (plus compact mobile toggle only on < md) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onBookClick}
            className="inline-flex items-center justify-center rounded-full bg-[#FBF3EA] px-5 py-2 text-sm font-semibold text-[#110D0B] whitespace-nowrap shrink-0 cursor-pointer transition-all duration-200 hover:bg-[#FFB27C] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFB27C]"
          >
            Записаться
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
            className="inline-flex md:hidden items-center justify-center h-10 w-10 rounded-full border border-white/15 text-[#FBF3EA] hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-[#FFB27C]"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Мобильное меню"
            className="md:hidden border-t border-white/[0.07] bg-[#0B0A09] px-4 py-4"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-base font-medium text-[#FBF3EA]/85 hover:bg-white/[0.05] hover:text-[#FBF3EA]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
