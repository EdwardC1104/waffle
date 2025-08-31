"use client";

import { User } from "@/types";
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/utils/api";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (
    name: string,
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Fetch current user from the API
  const fetchUser = async () => {
    try {
      const userData = await fetchCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (username: string, password: string) => {
    const result = await loginUser(username, password);

    if (result.success && result.user) {
      setUser(result.user);
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  };

  // Logout function
  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  // Register function
  const register = async (
    name: string,
    username: string,
    email: string,
    password: string
  ) => {
    const result = await registerUser(name, username, email, password);

    if (result.success && result.user) {
      setUser(result.user);
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  };

  // Refetch user function
  const refetchUser = async () => {
    setIsLoading(true);
    await fetchUser();
  };

  // Check authentication status on mount
  useEffect(() => {
    fetchUser();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
