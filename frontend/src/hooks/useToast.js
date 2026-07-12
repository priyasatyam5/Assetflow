import { useCallback, useState } from 'react';

let idCounter = 0;

/**
 * useToast
 * Lightweight local toast queue. Pair with <ToastContainer /> from
 * components/common/Toast.jsx. For a global toast accessible anywhere,
 * lift this into its own Context in a future pass.
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
}
