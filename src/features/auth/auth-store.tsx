import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as AuthApi from "@/src/api/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthState = {
  status: AuthStatus;
  token: string | null;
  me: AuthApi.AuthMe | null;
  login: (params: { email: string; password: string }) => Promise<void>;
  refreshMe: () => Promise<void>;
  logout: () => Promise<void>;
};

const TOKEN_KEY = "token";
const ROLE_KEY = "role"; // legacy (used by existing redirect code); keep in sync for now

const AuthContext = createContext<AuthState | null>(null);

async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

async function loadToken() {
  const secure = await SecureStore.getItemAsync(TOKEN_KEY);
  if (secure) return secure;
  return AsyncStorage.getItem(TOKEN_KEY);
}

async function clearToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [token, setToken] = useState<string | null>(null);
  const [me, setMe] = useState<AuthApi.AuthMe | null>(null);

  const refreshMe = useCallback(async () => {
    const nextMe = await AuthApi.me();
    setMe(nextMe);
    await AsyncStorage.setItem(ROLE_KEY, nextMe.role);
  }, []);

  const logout = useCallback(async () => {
    setStatus("unauthenticated");
    setToken(null);
    setMe(null);
    await clearToken();
    await AsyncStorage.removeItem(ROLE_KEY);
    router.replace("/(auth)/login");
  }, []);

  const hydrate = useCallback(async () => {
    setStatus("loading");
    const stored = await loadToken();
    if (!stored) {
      setStatus("unauthenticated");
      setToken(null);
      setMe(null);
      return;
    }

    setToken(stored);
    try {
      await refreshMe();
      setStatus("authenticated");
    } catch {
      await logout();
    }
  }, [logout, refreshMe]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const login = useCallback(
    async (params: { email: string; password: string }) => {
      setStatus("loading");
      const { accessToken } = await AuthApi.login(params);
      await saveToken(accessToken);
      setToken(accessToken);
      await refreshMe();
      setStatus("authenticated");
      router.replace("/");
    },
    [refreshMe]
  );

  const value = useMemo<AuthState>(
    () => ({ status, token, me, login, refreshMe, logout }),
    [status, token, me, login, refreshMe, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

