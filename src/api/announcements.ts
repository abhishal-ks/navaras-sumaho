import { api } from "@/src/services/api";

export type Announcement = {
  _id: string;
  schoolId: string;
  academicYearId: string;
  title: string;
  message: string;
  audienceType: "school" | "class" | string;
  classId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export async function my() {
  const res = await api.get<Announcement[]>("/announcements/my");
  return res.data;
}

export async function create(params: {
  title: string;
  message: string;
  audienceType: "school" | "class";
  classId?: string;
}) {
  const res = await api.post<Announcement>("/announcements", params);
  return res.data;
}

export async function deleteAnnouncement(id: string) {
  await api.delete(`/announcements/${id}`);
}

