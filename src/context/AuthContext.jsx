import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserProfile } from '../api/users';

// Global auth context for managing user authentication state
const AuthContext = createContext();

// Auth provider - wraps app and manages user state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-login default user on app startup
  useEffect(() => {
    async function autoLogin() {
      try {
        const defaultUserId = Number(process.env.REACT_APP_DEFAULT_USER_ID) || 1;
        const profile = await getUserProfile(defaultUserId);
        setUser({ ...profile, userId: defaultUserId });
      } catch (e) {
        console.error('Failed to auto-login:', e);
      } finally {
        setLoading(false);
      }
    }
    autoLogin();
  }, []);

  const login = (token) => {
    localStorage.setItem('auth_token', token);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
