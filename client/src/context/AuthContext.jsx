import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('todo_theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.remove('light-mode');
      localStorage.setItem('todo_theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.add('light-mode');
      localStorage.setItem('todo_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const token = localStorage.getItem('todo_jwt_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.getProfile()
      .then(res => {
        setUser(res.user);
      })
      .catch(() => {
        localStorage.removeItem('todo_jwt_token');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    localStorage.setItem('todo_jwt_token', res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (name, email, password) => {
    const res = await api.register(name, email, password);
    localStorage.setItem('todo_jwt_token', res.token);
    setUser(res.user);
    return res.user;
  };

  const googleLogin = async (email, name, googleId) => {
    const res = await api.googleLogin(email, name, googleId);
    localStorage.setItem('todo_jwt_token', res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('todo_jwt_token');
    setUser(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
