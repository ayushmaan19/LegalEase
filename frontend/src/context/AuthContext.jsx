import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const res = await axios.post(
        'http://localhost:5001/api/auth/refresh',
        {},
        { withCredentials: true }
      );
      
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      if (res.data.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      }
      
      return res.data.token;
    } catch (err) {
      console.error('Token refresh failed', err);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await axios.get('http://localhost:5001/api/users/me');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Failed to load user', err);
          
          // Try to refresh if token expired
          if (err.response?.status === 401) {
            const newToken = await refreshToken();
            if (newToken) {
              try {
                const res = await axios.get('http://localhost:5001/api/users/me');
                setUser(res.data);
                setIsAuthenticated(true);
              } catch (retryErr) {
                localStorage.removeItem('token');
              }
            }
          } else {
            localStorage.removeItem('token');
          }
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [refreshToken]);

  // Set up token refresh interval (every 14 minutes to refresh before 15min expiry)
  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshInterval = setInterval(() => {
      refreshToken();
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated, refreshToken]);

  const loginAction = (data) => {
    setUser(data.user);
    setIsAuthenticated(true);
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  const logoutAction = async () => {
    try {
      // Call logout endpoint to clear refresh token cookie
      await axios.post('http://localhost:5001/api/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout error', err);
    }
    
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    
    // Replace history with landing page, then navigate to login
    // This way: pressing back from login goes to landing page
    window.history.replaceState(null, '', '/');
    window.location.href = '/login';
  };

  // --- THIS IS THE NEW FUNCTION ---
  // This function will be called from the Settings page
  const updateUser = (newUserData) => {
    setUser(newUserData);
  };
  // --- END OF NEW FUNCTION ---

  const value = {
    user,
    isAuthenticated,
    loading,
    loginAction,
    logoutAction,
    updateUser,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};