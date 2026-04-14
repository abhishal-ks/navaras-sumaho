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

export async function listSchools() {
  const res = await api.get<School[]>("/schools");
  return res.data;
}

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

