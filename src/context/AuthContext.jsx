import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserProfile } from '../api/users';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function loadUser() {
      try {
        // Use a valid user ID from backend (1-5 exist in mock data)
        const userId = Number(process.env.REACT_APP_DEFAULT_USER_ID) || 1;
        console.log('Loading user profile for userId:', userId);
        const profile = await getUserProfile(userId);
        console.log('User profile loaded:', profile);
        setUser({ ...profile, userId: profile.userId });
      } catch(e) {
        console.error('Failed to load user profile:', e);
        // Fallback to basic user object
        const userId = Number(process.env.REACT_APP_DEFAULT_USER_ID) || 1;
        setUser({ userId, username: 'Guest', isPremium: false });
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  },[])

  const login = (token) => {
    localStorage.setItem('auth_token', token);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const refreshUser = async () => {
    if (user?.userId) {
      try {
        const profile = await getUserProfile(user.userId);
        setUser({ ...profile, userId: profile.userId });
      } catch(e) {
        console.error('Failed to refresh user:', e);
      }
    }
  };

  if (loading) {
    return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
