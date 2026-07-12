import { motion } from 'framer-motion';
import clsx from 'clsx';

const variants = {
  primary: 'btn-gradient',
  outline:
    'border border-slate-300 dark:border-slate-600 text-ink dark:text-ink-dark bg-white/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800',
  ghost: 'text-primary hover:bg-primary/5 dark:hover:bg-primary/10',
};

const sizes = {
  md: 'px-5 py-3 text-sm',
  lg: 'px-6 py-3.5 text-base',
  sm: 'px-3.5 py-2 text-xs',
};

/**
 * Button
 * Reusable action button with ripple + hover-glow micro-interactions.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  className = '',
  onClick,
  ...rest
}) {
  return (
    <motion.button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        'relative overflow-hidden rounded-xl font-semibold inline-flex items-center justify-center gap-2',
        'disabled:opacity-60 disabled:cursor-not-allowed select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          Please wait…
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
