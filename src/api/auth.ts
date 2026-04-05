import { api } from "@/src/services/api";

export type AuthMe =
  | { role: "SCHOOL_ADMIN" | "TEACHER" | "PARENT"; schoolId: string }
  | { role: "STUDENT"; classId: string; studentId?: string }
  | { role: "UNKNOWN" };

export async function login(params: { email: string; password: string }) {
  const res = await api.post<{ accessToken: string }>("/auth/login", params);
  return res.data;
}

export async function me() {
  const res = await api.get<AuthMe>("/auth/me");
  return res.data;
}

