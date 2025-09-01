import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      const { access, refresh } = response.data;
      
      // Decode JWT to get user info
      const payload = JSON.parse(atob(access.split('.')[1]));
      const userData = {
        id: payload.user_id,
        username: credentials.username,
        isStaff: payload.is_staff || false,
        isSuperuser: payload.is_superuser || false,
      };
      
      // Store tokens and user data
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      setUser(userData);
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.detail || 'Login failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Enhanced logout with proper history management
  const logout = () => {
    // Clear all auth data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    sessionStorage.clear();
    
    // Clear user state
    setUser(null);
    
    // Clear browser history and prevent back navigation
    window.history.replaceState(null, null, '/login');
    
    // Force navigation to login page
    navigate('/login', { replace: true });
    
    toast.success('Logged out successfully');
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('access_token');
  };

  const isAdmin = () => {
    return user && (user.isStaff || user.isSuperuser);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};