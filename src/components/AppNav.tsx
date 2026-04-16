import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sparkles, MessageSquare, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  onFeedbackOpen?: () => void;
}

const NAV_LINKS = [
  { to: '/carousel-ai-content', label: 'Carousel AI' },
  { to: '/carousel-custom-content', label: 'Custom Content' },
  { to: '/fnb-short-script', label: 'Fnb Short Script' },
];

export default function AppNav({ onFeedbackOpen }: Props) {
  const { isDark, toggle } = useTheme();

  return (
    <nav className="flex items-center justify-between py-4 border-b border-neutral-100 dark:border-neutral-800 gap-4">
      <Link to="/" className="flex items-center gap-2 cursor-pointer group shrink-0">
        <div className={`w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white ${onFeedbackOpen ? 'group-hover:rotate-12 transition-transform' : ''}`}>
          <Sparkles size={18} />
        </div>
        <span className="font-bold text-lg tracking-tight font-serif dark:text-white">CarouselAI</span>
      </Link>

      <div className="hidden md:flex items-center gap-1 text-sm font-semibold">
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <button
          onClick={toggle}
          aria-label={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          className="p-2 rounded-lg text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <a
          href="https://www.facebook.com/iamNCD"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 md:px-4 md:py-2 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-all text-xs md:text-sm font-semibold"
        >
          Liên hệ
        </a>
        {onFeedbackOpen && (
          <button
            onClick={onFeedbackOpen}
            className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 transition-all font-bold group text-xs md:text-sm"
          >
            <MessageSquare size={16} className="group-hover:scale-110 transition-transform" />
            <span>Góp ý</span>
          </button>
        )}
      </div>
    </nav>
  );
}
