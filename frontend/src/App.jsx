import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './pages/auth/LoginPage.jsx';

// NOTE: Additional routes (Dashboard, Organization Setup, Assets, etc.)
// will be added page-by-page in subsequent steps, per project brief.
// ProtectedRoute wrapper will guard authenticated routes once Dashboard lands.

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
