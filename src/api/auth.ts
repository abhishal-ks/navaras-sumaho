import { api } from "@/src/services/api";

export type AuthMe =
  | { role: "SUPER_ADMIN"; schoolId?: string }
  | { role: "SCHOOL_ADMIN"; schoolId?: string }
  | { role: "TEACHER"; schoolId: string }
  | { role: "PARENT" }
  | { role: "STUDENT"; classId: string; studentId: string }
  | { role: "UNKNOWN" };

export async function login(params: { email: string; password: string }) {
  const res = await api.post<{ accessToken: string }>("/auth/login", params);
  return res.data;
}

export async function register(params: { name: string; email: string; password: string; role?: string }) {
  const res = await api.post<{ message: string; user: any; accessToken: string }>("/auth/register", params);
  return res.data;
}

export async function parentActivate(params: { email: string; password: string }) {
  const res = await api.post<{ accessToken: string; message: string }>("/auth/parent/activate", params);
  return res.data;
}

export async function studentLogin(params: { admissionNumber: string; password: string }) {
  const res = await api.post<{ access_token: string }>('/auth/student-login', params);
  return res.data;
}

export async function me() {
  const res = await api.get<AuthMe>("/auth/me");
  return res.data;
}

export async function switchSchool(schoolId: string) {
  const res = await api.post<{ accessToken: string; message: string }>("/auth/switch-school", { schoolId });
  return res.data;
}

