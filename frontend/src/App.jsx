import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './pages/auth/LoginPage.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import AssetAllocationPage from './pages/allocation/AssetAllocationPage.jsx';
import AuditPage from './pages/audit/AuditPage.jsx';
import ReportsPage from './pages/reports/ReportsPage.jsx';
import NotificationsPage from './pages/notifications/NotificationsPage.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import MaintenancePage from './pages/maintenance/MaintenancePage';

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* All dashboard routes are nested inside ProtectedRoute + DashboardLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="allocation" element={<AssetAllocationPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          {/* Catch-all: redirect unknown sidebar paths back to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route
          path="/maintenance"
          element={<MaintenancePage />}
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
