import { api } from "@/src/services/api";

export type Resource = {
  _id: string;
  title: string;
  description?: string;
  url?: string;
  type?: string;
};

export async function listResources() {
  const res = await api.get<Resource[]>("/learning");
  return res.data;
}

export async function getResource(id: string) {
  const res = await api.get<Resource>(`/learning/${id}`);
  return res.data;
}

export async function createResource(params: {
  title: string;
  description?: string;
  url?: string;
  type?: string;
}) {
  const res = await api.post<Resource>("/learning", params);
  return res.data;
}
