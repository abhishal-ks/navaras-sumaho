import { api } from "@/src/services/api";

export type Teacher = {
  _id: string;
  name: string;
  email: string;
  schoolId?: string;
};

export async function list() {
  const res = await api.get<Teacher[]>("/teachers");
  return res.data;
}

export async function getById(id: string) {
  const res = await api.get<Teacher>(`/teachers/${id}`);
  return res.data;
}
