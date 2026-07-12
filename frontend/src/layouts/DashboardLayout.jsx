import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar.jsx';
import Navbar from '../components/layout/Navbar.jsx';

/**
 * DashboardLayout
 * Shared shell for all authenticated pages: collapsible Sidebar (drawer
 * on mobile) + sticky Navbar + animated page content area.
 */
export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark transition-colors duration-300">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={`flex min-h-screen flex-col transition-[padding] duration-300 ease-in-out ${
          collapsed ? 'lg:pl-[84px]' : 'lg:pl-[264px]'
        }`}
      >
        <Navbar onOpenMobileSidebar={() => setMobileOpen(true)} />

        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="px-4 py-6 lg:px-8 lg:py-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
