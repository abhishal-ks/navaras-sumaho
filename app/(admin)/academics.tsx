import { useState } from "react";
import { useAuth } from "@/src/features/auth/auth-store";
import * as AcademicsApi from "@/src/api/academics";
import { ErrorBox, Field, Info, PrimaryButton } from "@/src/ui/basic";
import { AppScreen } from "@/src/ui/app-screen";
import { OptionSelector } from "@/src/ui/erp-widgets";

export default function AdminAcademics() {
  const { me } = useAuth();
  const schoolId = (me && "schoolId" in me ? me.schoolId : null) as string | null;

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
    <AppScreen title="Academics setup">
      {error ? <ErrorBox message={error} /> : null}

      <Info>
        schoolId: {schoolId ?? "(none)"}{"\n"}
        Last response: {last ? JSON.stringify(last) : "(none)"}
      </Info>

      <Info>Academic Year</Info>
      <OptionSelector
        label="Year name"
        options={[
          { label: "2024-25", value: "2024-25" },
          { label: "2025-26", value: "2025-26" },
          { label: "2026-27", value: "2026-27" },
          { label: "Other", value: "other" },
        ]}
        value={yearMode}
        onSelect={setYearMode}
      />
      {yearMode === "other" ? (
        <Field label="Custom year name" value={yearName} onChangeText={setYearName} placeholder="2026-27" />
      ) : null}
      <PrimaryButton
        title="Create academic year"
        onPress={() => {
          if (!schoolId) {
            setError("No schoolId yet. Create a school first.");
            return;
          }
          void run(() =>
            AcademicsApi.createAcademicYear(schoolId, {
              name: yearMode === "other" ? yearName : yearMode,
            })
          );
        }}
        loading={loading}
      />

      <Field label="Academic year ID to activate" value={activateYearId} onChangeText={setActivateYearId} placeholder="paste year _id" />
      <PrimaryButton
        title="Activate academic year"
        onPress={() => void run(() => AcademicsApi.activateAcademicYear(activateYearId))}
        loading={loading}
      />

      <Info>Class (requires an active year)</Info>
      <Field label="Class name" value={className} onChangeText={setClassName} placeholder="Grade 6" />
      <Field label="Section" value={classSection} onChangeText={setClassSection} placeholder="A" />
      <PrimaryButton
        title="Create class"
        onPress={() => {
          if (!schoolId) {
            setError("No schoolId yet. Create a school first.");
            return;
          }
          void run(() => AcademicsApi.createClass(schoolId, { name: className, section: classSection }));
        }}
        loading={loading}
      />

      <Info>Subject</Info>
      <Field label="Class ID" value={subjectClassId} onChangeText={setSubjectClassId} placeholder="paste class _id" />
      <Field label="Subject name" value={subjectName} onChangeText={setSubjectName} placeholder="Mathematics" />
      <PrimaryButton
        title="Create subject"
        onPress={() => void run(() => AcademicsApi.createSubject(subjectClassId, { name: subjectName }))}
        loading={loading}
      />

      <Info>Assign teacher to subject</Info>
      <Field label="Class ID" value={assignClassId} onChangeText={setAssignClassId} placeholder="paste class _id" />
      <Field label="Subject ID" value={assignSubjectId} onChangeText={setAssignSubjectId} placeholder="paste subject _id" />
      <Field label="Teacher userId" value={assignTeacherId} onChangeText={setAssignTeacherId} placeholder="paste teacher userId" />
      <PrimaryButton
        title="Assign teacher"
        onPress={() => void run(() => AcademicsApi.assignTeacher(assignClassId, assignSubjectId, { teacherId: assignTeacherId }))}
        loading={loading}
      />
    </AppScreen>
  );
}

