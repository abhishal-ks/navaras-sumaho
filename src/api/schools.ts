import { api } from "@/src/services/api";

export type School = {
  _id: string;
  name: string;
  board: string;
  address: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  admin?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export type PaginatedSchools = {
  schools: School[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function listSchools(options: { page?: number; limit?: number; search?: string } = {}) {
  const params = new URLSearchParams();
  if (options.page) params.append('page', options.page.toString());
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.search) params.append('search', options.search);

  const res = await api.get<PaginatedSchools>(`/schools?${params.toString()}`);
  return res.data;
}

export async function countSchools() {
  const res = await api.get<number>("/schools/count");
  return res.data;
}

export async function getSchool(schoolId: string) {
  const res = await api.get<School>(`/schools/${schoolId}`);
  return res.data;
}

export async function createSchool(params: { name: string; board: string; address: string }) {
  const res = await api.post<School>("/schools", params);
  return res.data;
}

export async function assignSchoolAdmin(schoolId: string, adminUserId: string) {
  const res = await api.post(`/schools/${schoolId}/admins`, { adminUserId });
  return res.data;
}

export async function addTeacher(
  schoolId: string,
  params: { name: string; email: string; phone?: string; password?: string }
) {
  const res = await api.post(`/schools/${schoolId}/teachers`, params);
  return res.data;
}

export async function addParent(
  schoolId: string,
  params: { name: string; email: string; password: string }
) {
  const res = await api.post(`/schools/${schoolId}/parents`, params);
  return res.data;
}

export async function createParentLink(
  schoolId: string,
  params: { studentId: string; parentUserId?: string; parentEmail?: string }
) {
  const res = await api.post(`/schools/${schoolId}/parent-links`, params);
  return res.data;
}

