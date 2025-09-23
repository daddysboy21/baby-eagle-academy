// src/contexts/AuthContext.tsx
import React, { useState, useEffect, ReactNode } from "react";
import { authAPI } from "../services/api";
import { AuthContext } from "./AuthContextContext";

// User roles
export type UserRole = "admin" | "co-admin" | "media-person";

// User shape
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

// Context type
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}


// Props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthToken();
  }, []);

  // Check token in localStorage
  const checkAuthToken = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const userData = await authAPI.verifyToken(token);
        setUser(userData);
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
      localStorage.removeItem("authToken");
    } finally {
      setIsLoading(false);
    }
  };

  // Login method
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const data = await authAPI.login(email, password);

      // ✅ Make sure backend returns { token, user }
      if (data && data.token && data.user) {
        localStorage.setItem("authToken", data.token);
        setUser(data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout method
  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
