import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

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
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const loginAction = (data) => {
    setUser(data.user);
    setIsAuthenticated(true);
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  const logoutAction = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
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
    updateUser, // <-- Add it to the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};