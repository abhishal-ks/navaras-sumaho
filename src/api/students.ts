import { api } from "@/src/services/api";

export type Student = {
  _id: string;
  schoolId: string;
  academicYearId: string;
  classId: string;
  name: string;
  admissionNumber: string;
  gender?: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
};

export async function listByClass(classId: string) {
  const res = await api.get<Student[]>(`/students/classes/${classId}/students`);
  return res.data;
}

export async function createForClass(
  classId: string,
  params: {
    name: string;
    admissionNumber: string;
    gender?: string;
  }
) {
  const res = await api.post<Student>(`/students/classes/${classId}/students`, params);
  return res.data;
}

