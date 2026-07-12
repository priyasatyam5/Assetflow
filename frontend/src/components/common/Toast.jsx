import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';
import clsx from 'clsx';

const iconMap = {
  success: FiCheckCircle,
  error: FiXCircle,
  info: FiInfo,
};

const colorMap = {
  success: 'text-success border-success/20 bg-success/5',
  error: 'text-danger border-danger/20 bg-danger/5',
  info: 'text-primary border-primary/20 bg-primary/5',
};

/**
 * Toast
 * Single toast notification. Render inside a fixed-position container
 * (top-right recommended) and pass `onClose` to dismiss.
 */
export default function Toast({ id, type = 'info', message, onClose }) {
  const Icon = iconMap[type];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
      className={clsx(
        'glass-panel flex items-start gap-3 rounded-xl border px-4 py-3 shadow-glass-lg min-w-[280px] max-w-sm',
        colorMap[type]
      )}
    >
      <Icon className="mt-0.5 shrink-0 text-lg" />
      <p className="text-sm font-medium text-ink dark:text-ink-dark flex-1">{message}</p>
      <button
        onClick={() => onClose?.(id)}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        aria-label="Dismiss notification"
      >
        <FiX />
      </button>
    </motion.div>
  );
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}
