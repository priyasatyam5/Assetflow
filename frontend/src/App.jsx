import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './pages/auth/LoginPage.jsx';
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import AssetAllocationPage from "./pages/allocation/AssetAllocationPage";

// Protect routes that require authentication
function ProtectedRoute({ children }) {
  const token = window.localStorage.getItem('assetflow-token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Redirect logged-in users away from auth pages
function PublicRoute({ children }) {
  const token = window.localStorage.getItem('assetflow-token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
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
      
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
