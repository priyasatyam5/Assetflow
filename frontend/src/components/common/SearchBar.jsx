import { FiSearch } from 'react-icons/fi';
import clsx from 'clsx';

/**
 * SearchBar
 * Global search input used in the navbar. Glassmorphism style
 * to match the rest of the UI.
 */
export default function SearchBar({ placeholder = 'Search…', className = '' }) {
  return (
    <div className={clsx('relative', className)}>
      <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200/70 dark:border-slate-700 bg-white/60 dark:bg-slate-800/40 py-2.5 pl-10 pr-4 text-sm text-ink dark:text-ink-dark placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200"
      />
    </div>
  );
}
