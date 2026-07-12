import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronsLeft, FiChevronsRight, FiBox, FiLogOut } from 'react-icons/fi';
import clsx from 'clsx';
import { NAV_ITEMS } from '../../utils/mockData.js';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * Sidebar
 * Collapsible left navigation. Active route is highlighted via NavLink.
 * Collapse state is lifted to DashboardLayout so Navbar/main content
 * can adjust alongside it.
 */
export default function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile scrim */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <motion.aside
        animate={{ width: collapsed ? 84 : 264 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200/70 dark:border-slate-800',
          'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl',
          'lg:translate-x-0 transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-200/70 dark:border-slate-800 px-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-glow">
            <FiBox className="text-lg" />
          </div>
          {!collapsed && (
            <span className="truncate font-display text-lg font-bold text-ink dark:text-ink-dark">
              AssetFlow
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary dark:text-primary-300'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-ink dark:hover:text-ink-dark'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-pill"
                      className="absolute left-0 h-6 w-1 rounded-r-full bg-primary"
                    />
                  )}
                  <item.icon className="shrink-0 text-lg" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout + collapse toggle */}
        <div className="border-t border-slate-200/70 dark:border-slate-800 p-3 space-y-1">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-danger/10 hover:text-danger transition-colors duration-200"
          >
            <FiLogOut className="shrink-0 text-lg" />
            {!collapsed && <span>Logout</span>}
          </button>
          <button
            onClick={onToggle}
            className="hidden w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 lg:flex"
          >
            {collapsed ? <FiChevronsRight /> : <FiChevronsLeft />}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
