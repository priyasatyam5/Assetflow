import { motion } from 'framer-motion';
import clsx from 'clsx';
import { NOTIFICATIONS } from '../../utils/mockData.js';

const toneStyles = {
  danger: 'bg-danger/10 text-danger',
  warning: 'bg-warning/10 text-amber-600',
  primary: 'bg-primary/10 text-primary',
};

/**
 * NotificationsPanel
 * Card list surfacing maintenance reminders, pending approvals, and
 * assets due today — a condensed view of the full Notifications page.
 */
export default function NotificationsPanel() {
  return (
    <div className="glass-panel rounded-xl2 p-5 h-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-ink dark:text-ink-dark">
          Notifications
        </h3>
        <button className="text-xs font-medium text-primary hover:underline">View all</button>
      </div>
      <div className="space-y-3">
        {NOTIFICATIONS.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="flex items-start gap-3 rounded-xl border border-slate-200/70 dark:border-slate-700 p-3 hover:shadow-card transition-shadow"
          >
            <span className={clsx('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', toneStyles[n.tone])}>
              <n.icon className="text-base" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink dark:text-ink-dark">{n.title}</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{n.message}</p>
              <p className="mt-1 text-[11px] text-slate-400">{n.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
