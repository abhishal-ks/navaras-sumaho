import { api } from "@/src/services/api";

export type ParentChild = {
  studentId: string;
  name: string;
  admissionNumber: string;
  classId: string;
  schoolId: string;
};

export async function getMyChildren() {
  const res = await api.get<ParentChild[]>("/parents/me/children");
  return res.data;
}
