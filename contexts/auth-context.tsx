'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLoading } from './loading-context';

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    group: string;
    player: string;
    id?: string;
    nickname?: string;
    avatar?: string;
  } | null;
  login: (group: string, player: string, playerData?: { id: string; nickname: string; avatar: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ group: string; player: string; id?: string; nickname?: string; avatar?: string } | null>(null);
  const { hideLoading } = useLoading();

  // Cargar datos de autenticación del localStorage al iniciar
  useEffect(() => {
    const savedAuth = localStorage.getItem('teamBalancerAuth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setUser(authData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved auth data:', error);
        localStorage.removeItem('teamBalancerAuth');
      }
    }
  }, []);

  const login = (group: string, player: string, playerData?: { id: string; nickname: string; avatar: string }) => {
    const userData = { 
      group, 
      player,
      id: playerData?.id,
      nickname: playerData?.nickname,
      avatar: playerData?.avatar
    };
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('teamBalancerAuth', JSON.stringify(userData));
    
    // Ocultar loading cuando la autenticación sea exitosa
    hideLoading();
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('teamBalancerAuth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
