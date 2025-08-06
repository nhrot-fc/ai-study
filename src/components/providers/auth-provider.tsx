"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export interface User {
  id: string;
  nickname: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  email_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

interface RegisterData {
  nickname: string;
  email: string;
  password: string;
  full_name?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated on mount
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        // Try to get user profile with a short timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch("/api/user/profile", {
          signal: controller.signal,
          // Setting credentials ensures cookies are sent with the request
          credentials: "include",
          // Don't follow redirects - we want to know if we're redirected
          redirect: "manual"
        });
        clearTimeout(timeoutId);
        
        console.log("Auth check response:", response.status, response.statusText);

        if (response.ok) {
          const userData = await response.json();
          console.log("User authenticated:", userData);
          setUser(userData);
        } else if (response.status === 401 || response.type === "opaqueredirect") {
          // 401 or redirect means unauthenticated
          console.log("User not authenticated - received 401 or redirect");
          setUser(null);
        } else {
          console.log("User not authenticated, response not OK:", response.status);
          setUser(null);
        }
      } catch (error) {
        // AbortError means the request timed out
        if (error.name === "AbortError") {
          console.log("Auth check timed out - assuming not authenticated");
        } else {
          console.error("Error checking auth:", error);
        }
        setUser(null);
      } finally {
        console.log("Setting isLoading to false");
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setUser(data.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(responseData.error || "Registration failed");
    }

    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);

    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setUser(null);
    setIsLoading(false);
    router.push(ROUTES.LOGIN);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
