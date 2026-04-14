import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('codient_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // In a full prod app we should verify the token with the backend here.
      // For this MVP, we parse basic user info out of storage or token.
      const storedUser = localStorage.getItem('codient_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token]);

  const login = (jwtData, userData) => {
    localStorage.setItem('codient_token', jwtData);
    localStorage.setItem('codient_user', JSON.stringify(userData));
    setToken(jwtData);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('codient_token');
    localStorage.removeItem('codient_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
