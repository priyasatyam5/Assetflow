import clsx from 'clsx';

const statusStyles = {
  'On Track': 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  'Due Today': 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  Overdue: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
};

const toneStyles = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  success: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  warning: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
};

/**
 * Badge
 * Small status or tone label used in tables, cards, and the navbar profile dropdown.
 * Use `status` for semantic status badges (On Track / Due Today / Overdue),
 * or `tone` for colored context badges (primary / danger / success / warning).
 */
export default function Badge({ status, tone, children, className = '' }) {
  let style;

  if (status && statusStyles[status]) {
    style = statusStyles[status];
  } else if (tone && toneStyles[tone]) {
    style = toneStyles[tone];
  } else {
    style = 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600';
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold leading-tight',
        style,
        className
      )}
    >
      {children || status}
    </span>
  );
}
