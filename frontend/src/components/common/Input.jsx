import { forwardRef, useState } from 'react';
import { FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import clsx from 'clsx';

/**
 * Input
 * Reusable text field with label, left icon, error state, and
 * built-in show/hide toggle when type="password".
 */
const Input = forwardRef(
  ({ label, icon: Icon, error, type = 'text', className = '', ...rest }, ref) => {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';
    const resolvedType = isPassword ? (show ? 'text' : 'password') : type;

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          )}
          <input
            ref={ref}
            type={resolvedType}
            className={clsx(
              'input-field',
              Icon && 'pl-10',
              isPassword && 'pr-10',
              error && 'border-danger focus:border-danger focus:ring-danger/10',
              className
            )}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShow((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <FiEyeOff /> : <FiEye />}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger">
            <FiAlertCircle /> {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
