import { motion } from 'framer-motion';
import clsx from 'clsx';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { useCountUp } from '../../hooks/useCountUp.js';

/**
 * StatCard
 * Animated metric card with a gradient icon, animated number,
 * and trend badge. Used on the dashboard to display KPIs.
 */
export default function StatCard({
  label,
  value = 0,
  change = 0,
  trend = 'up',
  icon: Icon,
  gradient = 'from-primary-500 to-primary-700',
  delay = 0,
}) {
  const animatedValue = useCountUp(value);

  const trendColors = {
    up: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
    down: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10',
  };

  const TrendIcon = trend === 'up' ? FiTrendingUp : FiTrendingDown;

  // Format large numbers with abbreviations
  const formatValue = (num) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-panel relative overflow-hidden rounded-2xl p-5 transition-shadow duration-300 hover:shadow-glass-lg group"
    >
      {/* Gradient accent bar at top */}
      <div
        className={clsx(
          'absolute inset-x-0 top-0 h-1 bg-gradient-to-r',
          gradient
        )}
      />

      <div className="flex items-start justify-between">
        {/* Icon */}
        <div
          className={clsx(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm',
            gradient
          )}
        >
          {Icon && <Icon className="text-lg" />}
        </div>

        {/* Trend badge */}
        <span
          className={clsx(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold leading-tight',
            trendColors[trend]
          )}
        >
          <TrendIcon className="text-xs" />
          {change > 0 ? '+' : ''}{change}%
        </span>
      </div>

      {/* Value */}
      <p className="mt-4 font-display text-2xl font-bold text-ink dark:text-ink-dark tabular-nums tracking-tight">
        {formatValue(animatedValue)}
      </p>

      {/* Label */}
      <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </motion.div>
  );
}
