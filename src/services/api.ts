import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.trim() ||
  "http://192.168.31.161:3000";

const API_TIMEOUT_MS = (() => {
  const raw = process.env.EXPO_PUBLIC_API_TIMEOUT_MS;
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) ? parsed : 20000;
})();

export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, opts?: { status?: number; data?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = opts?.status;
    this.data = opts?.data;
  }
}

export const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT_MS,
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status as number | undefined;
    const data = err?.response?.data as unknown;
    const message =
      (typeof data === "object" && data && "message" in (data as any) && (data as any).message) ||
      err?.message ||
      "Request failed";

    return Promise.reject(new ApiError(String(message), { status, data }));
  }
);