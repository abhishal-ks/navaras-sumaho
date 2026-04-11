import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as StudentsApi from "@/src/api/students";
import { ErrorBox, Field, Info, PrimaryButton, Screen } from "@/src/ui/basic";
import { OptionSelector } from "@/src/ui/erp-widgets";

export default function AdminStudents() {
  const [classId, setClassId] = useState("");
  const [createName, setCreateName] = useState("");
  const [createAdmission, setCreateAdmission] = useState("");
  const [createGender, setCreateGender] = useState("");

  const studentsQuery = useQuery({
    queryKey: ["students", "class", classId],
    queryFn: () => StudentsApi.listByClass(classId),
    enabled: Boolean(classId),
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStudent = async () => {
    if (!classId) return;
    setError(null);
    setSubmitting(true);
    try {
      // Backend fills schoolId/academicYearId from class + active year, but DTO requires only these fields:
      // CreateStudentDto requires name, admissionNumber, gender (see backend). We'll send only those fields.
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

  return (
    <Screen title="Students">
      {error ? <ErrorBox message={error} /> : null}

      <Field label="Class ID" value={classId} onChangeText={setClassId} placeholder="paste class _id" />
      <PrimaryButton title="Refresh list" onPress={() => void studentsQuery.refetch()} loading={studentsQuery.isFetching} disabled={!classId} />

      {studentsQuery.isLoading ? <Info>Loading students…</Info> : null}
      {studentsQuery.isError ? <ErrorBox message={(studentsQuery.error as any)?.message ?? "Failed to load"} /> : null}
      {studentsQuery.data ? (
        <Info>
          {studentsQuery.data.length ? studentsQuery.data.map((s) => `${s._id}: ${s.name}`).join("\n") : "No students found"}
        </Info>
      ) : null}

      <Info>Create student</Info>
      <Field label="Name" value={createName} onChangeText={setCreateName} placeholder="Student name" />
      <Field label="Admission number" value={createAdmission} onChangeText={setCreateAdmission} placeholder="A-0001" />
      <OptionSelector
        label="Gender"
        options={[
          { label: "Male", value: "M" },
          { label: "Female", value: "F" },
          { label: "Other", value: "O" },
        ]}
        value={createGender as any}
        onSelect={setCreateGender as any}
      />
      <PrimaryButton title="Create student" onPress={() => void createStudent()} loading={submitting} disabled={!classId} />
    </Screen>
  );
}