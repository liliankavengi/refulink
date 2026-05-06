import React, { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authservice";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  verifyRIN: (identifier: string) => Promise<any>;
  registerIdentity: (stellarPublicKey?: string | null) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const loggedIn = await authService.isLoggedIn();
      setIsAuthenticated(loggedIn);
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyRIN = async (identifier: string) => {
    try {
      const data = await authService.verifyRIN(identifier);
      setUser(data.user || data);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const registerIdentity = async (stellarPublicKey?: string | null) => {
    try {
      const data = await authService.registerIdentity(stellarPublicKey);
      setUser(data.user || data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.clearTokens();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        verifyRIN,
        registerIdentity,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}