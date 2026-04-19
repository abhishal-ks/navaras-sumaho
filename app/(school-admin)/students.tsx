import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as StudentsApi from "@/src/api/students";
import { ErrorBox, Field, Info, PrimaryButton, Screen } from "@/src/ui/basic";
import { OptionSelector } from "@/src/ui/erp-widgets";

export default function SchoolAdminStudents() {
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

      {studentsQuery.data && (
        <>
          <Info>Students in class ({studentsQuery.data.length})</Info>
          {studentsQuery.data.map((s) => (
            <Info key={s._id}>
              {s.name} - {s.admissionNumber} - {s.gender}
            </Info>
          ))}
        </>
      )}

      <Info>Create new student</Info>
      <Field label="Name" value={createName} onChangeText={setCreateName} placeholder="Student name" />
      <Field label="Admission Number" value={createAdmission} onChangeText={setCreateAdmission} placeholder="ADM001" />
      <OptionSelector
        label="Gender"
        value={createGender}
        onChange={setCreateGender}
        options={[
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "Other", value: "other" },
        ]}
      />
      <PrimaryButton title="Create student" onPress={createStudent} loading={submitting} disabled={!classId} />
    </Screen>
  );
}