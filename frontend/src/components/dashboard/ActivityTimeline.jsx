import { motion } from 'framer-motion';
import clsx from 'clsx';
import { RECENT_ACTIVITY } from '../../utils/mockData.js';

const toneStyles = {
  primary: 'bg-primary/10 text-primary',
  violet: 'bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400',
  amber: 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

/**
 * ActivityTimeline
 * A vertical timeline of recent asset events — allocations, transfers,
 * maintenance resolutions, and returns.
 */
export default function ActivityTimeline() {
  return (
    <div className="glass-panel rounded-xl2 p-5 h-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-ink dark:text-ink-dark">
          Recent Activity
        </h3>
        <button className="text-xs font-medium text-primary hover:underline">
          View all
        </button>
      </div>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[17px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700" />

        <div className="space-y-4">
          {RECENT_ACTIVITY.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="relative flex items-start gap-4 pl-0"
            >
              {/* Timeline dot */}
              <span
                className={clsx(
                  'relative z-10 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full',
                  toneStyles[item.tone]
                )}
              >
                <item.icon className="text-sm" />
              </span>

              {/* Content */}
              <div className="min-w-0 flex-1 pt-1">
                <p className="text-sm font-medium text-ink dark:text-ink-dark leading-snug">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {item.meta}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
