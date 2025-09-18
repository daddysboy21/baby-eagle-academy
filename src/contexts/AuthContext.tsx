import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'co-admin' | 'media-person';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token on app load
    checkAuthToken();
  }, []);

  const checkAuthToken = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // TODO: Replace with your backend API call
        // const response = await fetch('/api/auth/verify', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const userData = await response.json();
        // setUser(userData);
        
        // Mock user data for now - replace with actual API call
        const mockUser: User = {
          id: '1',
          email: 'admin@befa.com',
          role: 'admin',
          name: 'Admin User'
        };
        setUser(mockUser);
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with your backend API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      
      // Mock authentication - replace with actual API call
      if (email === 'admin@befa.com' && password === 'admin123') {
        const mockUser: User = {
          id: '1',
          email: email,
          role: 'admin',
          name: 'Admin User'
        };
        
        // Store auth token
        localStorage.setItem('authToken', 'mock-jwt-token');
        setUser(mockUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};