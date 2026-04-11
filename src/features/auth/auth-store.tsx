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
  register: (params: { name: string; email: string; password: string; role?: string }) => Promise<void>;
  loginStudent: (params: { admissionNumber: string; password: string }) => Promise<void>;
  parentActivate: (params: { email: string; password: string }) => Promise<void>;
  refreshMe: () => Promise<AuthApi.AuthMe>;
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
    return nextMe;
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
      try {
        const { accessToken } = await AuthApi.login(params);
        await saveToken(accessToken);
        setToken(accessToken);
        const userMe = await refreshMe();

        setStatus("authenticated");

        // Redirect based on role
        const role = userMe.role;
        if (role === "TEACHER") {
          router.replace("/(teacher)");
        } else if (role === "SUPER_ADMIN" || role === "SCHOOL_ADMIN") {
          router.replace("/(admin)");
        } else if (role === "STUDENT") {
          router.replace("/(student)");
        } else if (role === "PARENT") {
          router.replace("/(parent)");
        } else {
          router.replace("/(auth)/login");
        }
      } catch (error) {
        setStatus("unauthenticated");
        throw error;
      }
    },
    [refreshMe]
  );

  const register = useCallback(
    async (params: { name: string; email: string; password: string; role?: string }) => {
      setStatus("loading");
      try {
        const { accessToken, user } = await AuthApi.register(params);
        await saveToken(accessToken);
        setToken(accessToken);
        const userMe = await refreshMe();

        setStatus("authenticated");

        // Redirect based on role
        const role = userMe.role;
        if (role === "TEACHER") {
          router.replace("/(teacher)");
        } else if (role === "SUPER_ADMIN" || role === "SCHOOL_ADMIN") {
          router.replace("/(admin)");
        } else if (role === "STUDENT") {
          router.replace("/(student)");
        } else if (role === "PARENT") {
          router.replace("/(parent)");
        } else {
          router.replace("/(auth)/login");
        }
      } catch (error) {
        setStatus("unauthenticated");
        throw error;
      }
    },
    [refreshMe]
  );

  const parentActivate = useCallback(
    async (params: { email: string; password: string }) => {
      setStatus("loading");
      try {
        const { accessToken } = await AuthApi.parentActivate(params);
        await saveToken(accessToken);
        setToken(accessToken);
        const userMe = await refreshMe();

        setStatus("authenticated");

        // Redirect based on role
        const role = userMe.role;
        if (role === "TEACHER") {
          router.replace("/(teacher)");
        } else if (role === "SUPER_ADMIN" || role === "SCHOOL_ADMIN") {
          router.replace("/(admin)");
        } else if (role === "STUDENT") {
          router.replace("/(student)");
        } else if (role === "PARENT") {
          router.replace("/(parent)");
        } else {
          router.replace("/(auth)/login");
        }
      } catch (error) {
        setStatus("unauthenticated");
        throw error;
      }
    },
    [refreshMe]
  );

  const loginStudent = useCallback(
    async (params: { admissionNumber: string; password: string }) => {
      setStatus("loading");
      try {
        const { access_token } = await AuthApi.studentLogin(params);
        await saveToken(access_token);
        setToken(access_token);
        const meData = await AuthApi.me();
        setMe(meData);
        await AsyncStorage.setItem(ROLE_KEY, meData.role);
        setStatus("authenticated");
        router.replace("/(student)");
      } catch (error) {
        setStatus("unauthenticated");
        throw error;
      }
    },
    []
  );

  const value = useMemo<AuthState>(
    () => ({ status, token, me, login, register, loginStudent, parentActivate, refreshMe, logout }),
    [status, token, me, login, register, loginStudent, parentActivate, refreshMe, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

