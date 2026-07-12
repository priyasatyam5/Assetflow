import { createContext, useContext, useState, useCallback } from 'react';
import { loginRequest, registerRequest } from '../services/authService.js';

const AuthContext = createContext(null);

function readStoredUser() {
  if (typeof window === 'undefined') return null;

  const storedUser = window.localStorage.getItem('assetflow-user');
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);

  const persistUser = useCallback((nextUser) => {
    if (nextUser) {
      window.localStorage.setItem('assetflow-user', JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem('assetflow-user');
    }
  }, []);

  const login = useCallback(async ({ email, password, remember }) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const response = await loginRequest({ email, password, remember });
      const nextUser = response?.user || { name: response?.name || 'User', role: response?.role || 'employee' };
      setUser(nextUser);
      persistUser(nextUser);
      return response;
    } catch (err) {
      setAuthError(err?.response?.data?.message || err?.message || 'Unable to sign in. Please try again.');
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  }, [persistUser]);

  const register = useCallback(async (payload) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const response = await registerRequest(payload);
      const nextUser = response?.user || { name: payload?.name || 'User', role: payload?.role || 'employee' };
      setUser(nextUser);
      persistUser(nextUser);
      return response;
    } catch (err) {
      setAuthError(err?.response?.data?.message || err?.message || 'Unable to register. Please try again.');
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  }, [persistUser]);

  const logout = useCallback(() => {
    window.localStorage.removeItem('assetflow-token');
    window.localStorage.removeItem('assetflow-remember');
    persistUser(null);
    setUser(null);
  }, [persistUser]);

  const isAuthenticated = !!user || !!window.localStorage.getItem('assetflow-token');

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticating, authError, login, register, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
