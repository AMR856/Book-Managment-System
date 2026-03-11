import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchProfile, login as apiLogin, logout as apiLogout, register as apiRegister } from "./api";

export type User = {
  id: number;
  email: string;
  role: "admin" | "user";
  avatar?: string;
  provider?: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "books_token";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
};

const setToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (!token) {
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    window.localStorage.setItem(STORAGE_KEY, token);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const res = await fetchProfile();
      setUser(res.data.user);
    } catch {
      setUser(null);
      setTokenState(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    setToken(res.data.token);
    setTokenState(res.data.token);
    setUser(res.data.user);
  };

  const register = async (email: string, password: string) => {
    const res = await apiRegister(email, password);
    setToken(res.data.token);
    setTokenState(res.data.token);
    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // ignore
    }
    setToken(null);
    setTokenState(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login,
      register,
      logout,
      refresh,
    }),
    [user, token, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
