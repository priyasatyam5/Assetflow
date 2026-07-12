import { createContext, useContext, useState, useCallback } from 'react';
import { loginRequest, registerRequest } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);

  const login = useCallback(async ({ email, password, remember }) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const response = await loginRequest({ email, password, remember });
      setUser(response.user);
      return response;
    } catch (err) {
      setAuthError(err?.response?.data?.message || err?.message || 'Unable to sign in. Please try again.');
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const response = await registerRequest(payload);
      setUser(response.user);
      return response;
    } catch (err) {
      setAuthError(err?.response?.data?.message || err?.message || 'Unable to register. Please try again.');
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem('assetflow-token');
    window.localStorage.removeItem('assetflow-remember');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticating, authError, login, register, logout, isAuthenticated: !!user }}
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
