import { api } from "@/src/services/api";

export async function createAcademicYear(
  schoolId: string,
  params: { name: string }
) {
  const res = await api.post(`/academics/schools/${schoolId}/academic-years`, params);
  return res.data;
}

export async function activateAcademicYear(academicYearId: string) {
  const res = await api.patch(`/academics/academic-years/${academicYearId}/activate`);
  return res.data;
}

export async function createClass(
  schoolId: string,
  params: { name: string; section: string }
) {
  const res = await api.post(`/academics/schools/${schoolId}/classes`, params);
  return res.data;
}

export async function createSubject(
  classId: string,
  params: { name: string; code?: string }
) {
  const res = await api.post(`/academics/classes/${classId}/subjects`, params);
  return res.data;
}

export async function assignTeacher(
  classId: string,
  subjectId: string,
  params: { teacherId: string }
) {
  const res = await api.post(
    `/academics/classes/${classId}/subjects/${subjectId}/assign-teacher`,
    params
  );
  return res.data;
}

export type AttendanceStatus = "present" | "absent";

export async function markAttendance(
  classId: string,
  params: { records: { studentId: string; status: AttendanceStatus }[] }
) {
  const res = await api.post(`/academics/classes/${classId}/attendance`, params);
  return res.data;
}

export async function createAssignment(
  subjectId: string,
  params: { title: string; description?: string; dueDate?: string }
) {
  const res = await api.post(`/academics/subjects/${subjectId}/assignments`, params);
  return res.data;
}

export async function createExam(classId: string, params: { name: string; date: string }) {
  const res = await api.post(`/academics/classes/${classId}/exams`, params);
  return res.data;
}

export async function addExamSubject(
  examId: string,
  params: { subjectId: string; maxMarks: number }
) {
  const res = await api.post(`/academics/exams/${examId}/subjects`, params);
  return res.data;
}

export async function addMark(
  examId: string,
  params: { studentId: string; subjectId: string; marks: number }
) {
  const res = await api.post(`/academics/exams/${examId}/marks`, params);
  return res.data;
}

export async function getStudentReport(studentId: string) {
  const res = await api.get(`/academics/students/${studentId}/report`);
  return res.data;
}
export async function getAttendance(classId: string, date?: string) {
  const res = await api.get<any>(`/academics/classes/${classId}/attendance`, {
    params: { date },
  });
  return res.data;
}

export async function getExams(classId: string) {
  const res = await api.get<any>(`/academics/classes/${classId}/exams`);
  return res.data;
}

export async function getExamMarks(studentId: string) {
  const res = await api.get<any>(`/academics/students/${studentId}/marks`);
  return res.data;
}

export async function listSubjects(classId: string) {
  const res = await api.get<any>(`/academics/classes/${classId}/subjects`);
  return res.data;
}
