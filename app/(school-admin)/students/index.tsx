import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Href, router } from "expo-router";
import * as StudentsApi from "@/src/api/students";
import * as AcademicsApi from "@/src/api/academics";
import * as SchoolsApi from "@/src/api/schools";
import { ErrorBox, Field, Info, PrimaryButton } from "@/src/ui/basic";
import { OptionSelector } from "@/src/ui/erp-widgets";
import { useAuth } from "@/src/features/auth/auth-store";
import { AppScreen } from "@/src/ui/app-screen";

export default function StudentsIndex() {
  const { me } = useAuth();
  const schoolId = (me as any)?.schoolId;

  const [classId, setClassId] = useState("");
  const [createName, setCreateName] = useState("");
  const [createAdmission, setCreateAdmission] = useState("");
  const [createGender, setCreateGender] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schoolQuery = useQuery({
    queryKey: ["school", schoolId],
    queryFn: () => SchoolsApi.getSchool(schoolId!),
    enabled: Boolean(schoolId),
  });

  const classesQuery = useQuery({
    queryKey: ["classes", schoolId],
    queryFn: () => AcademicsApi.listClasses(schoolId!),
    enabled: Boolean(schoolId),
  });

  const studentsQuery = useQuery({
    queryKey: ["students", "class", classId],
    queryFn: () => StudentsApi.listByClass(classId),
    enabled: Boolean(classId),
  });

  const createStudent = async () => {
    if (!classId) return;
    setError(null);
    setSubmitting(true);
    try {
      await StudentsApi.createForClass(classId, {
        name: createName,
        admissionNumber: createAdmission,
        gender: createGender || undefined,
      });
      setCreateName("");
      setCreateAdmission("");
      setCreateGender("");
      await studentsQuery.refetch();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create student");
    } finally {
      setSubmitting(false);
    }
  };

  const classOptions = (classesQuery.data as Array<{ _id: string; name: string; section: string }>)?.map((cls) => ({
    label: `${cls.name}-${cls.section}`,
    value: cls._id,
  })) || [];

  return (
    <AppScreen title="Students">
      {error ? <ErrorBox message={error} /> : null}

      <PrimaryButton
        title="View Student List"
        onPress={() => router.push("/(school-admin)/students/list" as Href)}
      />

      {schoolQuery.data && (
        <Info>School: {schoolQuery.data.name}</Info>
      )}

      <OptionSelector
        label="Class"
        value={classId}
        onSelect={setClassId}
        options={classOptions}
      />

      <Info>Create new student</Info>
      <Field label="Name" value={createName} onChangeText={setCreateName} placeholder="Student name" />
      <Field label="Admission Number" value={createAdmission} onChangeText={setCreateAdmission} placeholder="ADM001" />
      <OptionSelector
        label="Gender"
        value={createGender}
        onSelect={setCreateGender}
        options={[
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "Other", value: "other" },
        ]}
      />
      <PrimaryButton title="Create student" onPress={createStudent} loading={submitting} disabled={!classId} />
    </AppScreen>
  );
}
