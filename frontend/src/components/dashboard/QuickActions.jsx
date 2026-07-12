import { motion } from 'framer-motion';
import { QUICK_ACTIONS } from '../../utils/mockData.js';

/**
 * QuickActions
 * Grid of shortcut cards for the most common tasks. Pages they link to
 * (Register Asset, Allocation & Transfer, etc.) are built in later steps,
 * so `onAction` currently just surfaces a toast via the parent page.
 */
export default function QuickActions({ onAction }) {
  return (
    <div className="glass-panel rounded-xl2 p-5">
      <h3 className="mb-4 font-display text-sm font-semibold text-ink dark:text-ink-dark">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {QUICK_ACTIONS.map((action, i) => (
          <motion.button
            key={action.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onAction?.(action)}
            className="flex flex-col items-center gap-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700 bg-white/60 dark:bg-slate-800/40 px-3 py-4 text-center transition-shadow hover:shadow-glow"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700/60">
              <action.icon className={`text-lg ${action.color}`} />
            </span>
            <span className="text-xs font-medium leading-tight text-slate-600 dark:text-slate-300">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
