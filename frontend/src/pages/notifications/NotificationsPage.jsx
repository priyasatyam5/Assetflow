import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBell,
  FiAlertTriangle,
  FiCheckCircle,
  FiCalendar,
  FiRefreshCw,
} from 'react-icons/fi';
import clsx from 'clsx';
import { fetchNotifications } from '../../services/notificationsService.js';

const FILTERS = [
  { key: '', label: 'All' },
  { key: 'alert', label: 'Alerts' },
  { key: 'approval', label: 'Approvals' },
  { key: 'booking', label: 'Bookings' },
];

const typeIcons = {
  alert: FiAlertTriangle,
  approval: FiCheckCircle,
  booking: FiCalendar,
};

const typeColors = {
  alert: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10',
  approval: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
  booking: 'text-primary bg-primary/10',
};

function relativeTime(dateStr) {
  if (!dateStr) return '';
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return '1d ago';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchNotifications(activeFilter || undefined)
      .then((data) => { if (!cancelled) setNotifications(data || []); })
      .catch(() => { if (!cancelled) setNotifications([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [activeFilter]);

  const filtered = activeFilter
    ? notifications.filter((n) => n.type === activeFilter)
    : notifications;

  return (
    <div className="max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink dark:text-ink-dark flex items-center gap-2">
          <FiBell className="text-primary" /> Notifications
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Stay updated on asset events, approvals, and alerts.
        </p>
      </motion.div>

      {/* Filter tabs */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}
        className="glass-panel rounded-xl2 p-1.5 mb-6 inline-flex"
      >
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setActiveFilter(f.key)}
            className={clsx('rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200',
              activeFilter === f.key
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-500 hover:text-ink dark:hover:text-ink-dark hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >{f.label}</button>
        ))}
      </motion.div>

      {/* Notification list */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400 py-16">
          <FiRefreshCw className="animate-spin" /> Loading notifications...
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel rounded-xl2 p-8 text-center">
          <FiBell className="mx-auto text-3xl text-slate-300 mb-3" />
          <p className="text-slate-500">No notifications{activeFilter ? ` of type "${activeFilter}"` : ''}.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((n, i) => {
              const Icon = typeIcons[n.type] || FiBell;
              const colorClass = typeColors[n.type] || 'text-slate-500 bg-slate-100';
              return (
                <motion.div key={n.id || i} layout
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25, delay: i * 0.025 }}
                  className={clsx('glass-panel rounded-xl2 p-4 flex items-start gap-3 transition-shadow hover:shadow-glass-lg',
                    !n.read && 'border-l-4 border-l-primary'
                  )}
                >
                  <span className={clsx('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', colorClass)}>
                    <Icon className="text-lg" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={clsx('text-sm', !n.read ? 'font-semibold text-ink dark:text-ink-dark' : 'text-ink dark:text-ink-dark')}>
                      {n.title}
                    </p>
                    {n.message && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{n.message}</p>}
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">{relativeTime(n.createdAt)}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
