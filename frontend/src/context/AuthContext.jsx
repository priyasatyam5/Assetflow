import { createContext, useContext, useState, useCallback } from 'react';
import { loginRequest } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);

  const login = useCallback(async ({ email, password, remember }) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      // Placeholder API call — backend team will wire the real endpoint.
      const response = await loginRequest({ email, password, remember });
      setUser(response.user);
      return response;
    } catch (err) {
      setAuthError(err?.message || 'Unable to sign in. Please try again.');
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticating, authError, login, logout, isAuthenticated: !!user }}
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
