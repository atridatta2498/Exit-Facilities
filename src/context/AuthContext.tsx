import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  adminType: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminType, setAdminType] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage for existing auth state
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedType = localStorage.getItem('adminType');
    
    if (storedAuth === 'true' && storedType) {
      setIsAuthenticated(true);
      setAdminType(storedType);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Replace this with your actual API call
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setAdminType(data.adminType);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('adminType', data.adminType);
        navigate('/admin/dashboard');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminType(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminType');
    navigate('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};