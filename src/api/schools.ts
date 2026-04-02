import { api } from "@/src/services/api";

export type School = {
  _id: string;
  name: string;
  board: string;
  address: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
};

export async function createSchool(params: { name: string; board: string; address: string }) {
  const res = await api.post<School>("/schools", params);
  return res.data;
}

export async function addTeacher(
  schoolId: string,
  params: { name: string; email: string; phone?: string; password?: string }
) {
  const res = await api.post(`/schools/${schoolId}/teachers`, params);
  return res.data;
}

