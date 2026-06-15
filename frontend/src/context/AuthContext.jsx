import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      // The backend returns the JWT token as a string right now
      const token = response.data;
      if (token && token !== "Failed") {
        localStorage.setItem('token', token);
        // We will mock the user role for now until backend profile API is done
        const mockedUser = { username: credentials.username, role: credentials.username.includes('mentor') ? 'MENTOR' : 'STUDENT' };
        localStorage.setItem('user', JSON.stringify(mockedUser));
        setUser(mockedUser);
        
        if (mockedUser.role === 'MENTOR') {
          navigate('/mentor/dashboard');
        } else {
          navigate('/student/dashboard');
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      await authService.register(userData);
      // Automatically login after successful registration
      return await login({ username: userData.username, password: userData.password });
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
