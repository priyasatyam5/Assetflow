import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMenu, FiBell, FiMoon, FiSun, FiChevronDown, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import SearchBar from '../common/SearchBar.jsx';
import Badge from '../common/Badge.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { NOTIFICATIONS } from '../../utils/mockData.js';

/**
 * Navbar
 * Top bar with global search, notification bell (dropdown preview),
 * dark mode toggle, and user profile menu.
 */
export default function Navbar({ onOpenMobileSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = (user?.name || 'Admin User')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl px-4 lg:px-6">
      <button
        onClick={onOpenMobileSidebar}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        aria-label="Open menu"
      >
        <FiMenu className="text-lg" />
      </button>

      <SearchBar placeholder="Search assets, employees, requests…" className="max-w-md flex-1" />

      <div className="ml-auto flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </motion.span>
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <FiBell className="text-lg" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-white dark:ring-slate-900" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="glass-panel absolute right-0 mt-2 w-80 rounded-xl2 p-2 shadow-glass-lg"
              >
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Notifications
                </p>
                <div className="space-y-1">
                  {NOTIFICATIONS.map((n) => (
                    <div key={n.id} className="flex gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
                      <n.icon className="mt-0.5 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink dark:text-ink-dark">{n.title}</p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{n.message}</p>
                      </div>
                      <span className="ml-auto shrink-0 text-[11px] text-slate-400">{n.time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-white">
              {initials}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium text-ink dark:text-ink-dark leading-tight">
                {user?.name || 'Admin User'}
              </span>
              <Badge tone="primary" className="mt-0.5 !py-0.5 !px-1.5 border-0">
                {user?.role || 'admin'}
              </Badge>
            </span>
            <FiChevronDown className="hidden text-slate-400 sm:block" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="glass-panel absolute right-0 mt-2 w-52 rounded-xl2 p-1.5 shadow-glass-lg"
              >
                <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <FiUser /> My Profile
                </button>
                <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <FiSettings /> Settings
                </button>
                <div className="my-1 h-px bg-slate-200 dark:bg-slate-700" />
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger/10 transition-colors"
                >
                  <FiLogOut /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
