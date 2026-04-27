import { api } from "@/src/services/api";

export type User = {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  school?: {
    id: string;
    name: string;
  } | null;
};

export type PaginatedUsers = {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function listUsersByRole(role: string, options: { page?: number; limit?: number; search?: string } = {}) {
  const params = new URLSearchParams();
  params.append('role', role);
  if (options.page) params.append('page', options.page.toString());
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.search) params.append('search', options.search);

  const res = await api.get<PaginatedUsers>(`/users/by-role?${params.toString()}`);
  return res.data;
}

export async function countUsers(role?: string) {
  const params = role ? `?role=${role}` : '';
  const res = await api.get<number>(`/users/count${params}`);
  return res.data;
}