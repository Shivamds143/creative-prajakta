"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CustomerUser {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

interface AuthContextType {
  user: CustomerUser | null;
  login: (userData: CustomerUser) => void;
  logout: () => void;
  updateUser: (userData: Partial<CustomerUser>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("giftaura_customer");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load customer profile", e);
    }
  }, []);

  const login = (userData: CustomerUser) => {
    setUser(userData);
    localStorage.setItem("giftaura_customer", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("giftaura_customer");
  };

  const updateUser = (userData: Partial<CustomerUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      localStorage.setItem("giftaura_customer", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
