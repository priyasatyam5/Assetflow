import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './pages/auth/LoginPage.jsx';
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import AssetAllocationPage from './pages/allocation/AssetAllocationPage.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import MaintenancePage from "./pages/maintenance/MaintenancePage";
function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/allocation"
          element={
            <ProtectedRoute>
              <AssetAllocationPage />
            </ProtectedRoute>
          }
        />
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
