import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/features/auth/auth-store";
import * as AcademicsApi from "@/src/api/academics";
import * as SchoolsApi from "@/src/api/schools";
import { ErrorBox, Field, Info, PrimaryButton } from "@/src/ui/basic";
import { AppScreen } from "@/src/ui/app-screen";
import { OptionSelector } from "@/src/ui/erp-widgets";

export default function SchoolAdminAcademics() {
  const { me } = useAuth();
  const schoolId = (me && "schoolId" in me ? me.schoolId : null) as string | null;

  const schoolQuery = useQuery({
    queryKey: ["school", schoolId],
    queryFn: () => SchoolsApi.getSchool(schoolId!),
    enabled: Boolean(schoolId),
  });

  const [yearName, setYearName] = useState("");
  const [yearMode, setYearMode] = useState<"2024-25" | "2025-26" | "2026-27" | "other">("2026-27");
  const [activateYearId, setActivateYearId] = useState("");

  const [className, setClassName] = useState("");
  const [classSection, setClassSection] = useState("");

  const [subjectClassId, setSubjectClassId] = useState("");
  const [subjectName, setSubjectName] = useState("");

  const [assignClassId, setAssignClassId] = useState("");
  const [assignSubjectId, setAssignSubjectId] = useState("");
  const [assignTeacherId, setAssignTeacherId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [last, setLast] = useState<any | null>(null);

  const run = async (fn: () => Promise<any>) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fn();
      setLast(res);
      return res;
    } catch (e: any) {
      setError(e?.message ?? "Request failed");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen title="Academics Management">
      {error ? <ErrorBox message={error} /> : null}

      <Info>
        School: {schoolQuery.data?.name ?? schoolId ?? "(none)"}{"\n"}
        Last result: {last ? JSON.stringify(last, null, 2) : "(none)"}
      </Info>

      <Info>Academic Years</Info>
      <Field label="Year name" value={yearName} onChangeText={setYearName} placeholder="2026-27" />
      <OptionSelector
        label="Year mode"
        value={yearMode}
        onChange={setYearMode}
        options={[
          { label: "2024-25", value: "2024-25" },
          { label: "2025-26", value: "2025-26" },
          { label: "2026-27", value: "2026-27" },
          { label: "Other", value: "other" },
        ]}
      />
      <PrimaryButton
        title="Create academic year"
        onPress={() => run(() => AcademicsApi.createAcademicYear(schoolId!, { name: yearName, mode: yearMode }))}
        loading={loading}
        disabled={!schoolId}
      />

      <Field label="Year ID to activate" value={activateYearId} onChangeText={setActivateYearId} placeholder="paste year _id" />
      <PrimaryButton
        title="Activate year"
        onPress={() => run(() => AcademicsApi.activateAcademicYear(schoolId!, activateYearId))}
        loading={loading}
        disabled={!schoolId}
      />

      <Info>Classes</Info>
      <Field label="Class name" value={className} onChangeText={setClassName} placeholder="Class 10" />
      <Field label="Section" value={classSection} onChangeText={setClassSection} placeholder="A" />
      <PrimaryButton
        title="Create class"
        onPress={() => run(() => AcademicsApi.createClass(schoolId!, { name: className, section: classSection }))}
        loading={loading}
        disabled={!schoolId}
      />

      <Info>Subjects</Info>
      <Field label="Class ID for subject" value={subjectClassId} onChangeText={setSubjectClassId} placeholder="paste class _id" />
      <Field label="Subject name" value={subjectName} onChangeText={setSubjectName} placeholder="Mathematics" />
      <PrimaryButton
        title="Create subject"
        onPress={() => run(() => AcademicsApi.createSubject(subjectClassId, { name: subjectName }))}
        loading={loading}
      />

      <Info>Teacher Assignments</Info>
      <Field label="Class ID" value={assignClassId} onChangeText={setAssignClassId} placeholder="paste class _id" />
      <Field label="Subject ID" value={assignSubjectId} onChangeText={setAssignSubjectId} placeholder="paste subject _id" />
      <Field label="Teacher ID" value={assignTeacherId} onChangeText={setAssignTeacherId} placeholder="paste teacher user _id" />
      <PrimaryButton
        title="Assign teacher to subject"
        onPress={() => run(() => AcademicsApi.assignTeacher(assignClassId, assignSubjectId, assignTeacherId))}
        loading={loading}
      />
    </AppScreen>
  );
}