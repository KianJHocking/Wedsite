import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Guest } from '../types';

interface AuthContextType {
  guest: Guest | null;
  token: string | null;
  login: (token: string, guest: Guest) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('wedding_token');
    const storedGuest = localStorage.getItem('wedding_guest');
    if (storedToken && storedGuest) {
      setToken(storedToken);
      setGuest(JSON.parse(storedGuest));
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newGuest: Guest) => {
    localStorage.setItem('wedding_token', newToken);
    localStorage.setItem('wedding_guest', JSON.stringify(newGuest));
    setToken(newToken);
    setGuest(newGuest);
  };

  const logout = () => {
    localStorage.removeItem('wedding_token');
    localStorage.removeItem('wedding_guest');
    setToken(null);
    setGuest(null);
  };

  return (
    <AuthContext.Provider value={{ guest, token, login, logout, loading }}>
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

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        fontFamily: 'var(--font-sans)', 
        color: 'var(--color-primary)',
        backgroundColor: 'var(--color-bg)'
      }}>
        Loading romantic details...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
