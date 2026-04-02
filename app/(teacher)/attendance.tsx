import { useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/features/auth/auth-store";
import * as StudentsApi from "@/src/api/students";
import * as AcademicsApi from "@/src/api/academics";
import { ErrorBox, Field, Info, PrimaryButton, Screen } from "@/src/ui/basic";

export default function Attendance() {
  const { me } = useAuth();
  const classIdFromMe = me?.role === "STUDENT" ? me.classId : null;
  const [classId, setClassId] = useState(classIdFromMe ?? "");

  const studentsQuery = useQuery({
    queryKey: ["students", "class", classId],
    queryFn: () => StudentsApi.listByClass(classId),
    enabled: Boolean(classId),
  });

  const [presentMap, setPresentMap] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (id: string) => {
    setPresentMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const records = useMemo(
    () =>
      (studentsQuery.data ?? []).map((s) => ({
        studentId: s._id,
        status: presentMap[s._id] ? ("present" as const) : ("absent" as const),
      })),
    [presentMap, studentsQuery.data]
  );

  const submit = async () => {
    if (!classId) return;
    setError(null);
    setSubmitting(true);
    try {
      await AcademicsApi.markAttendance(classId, { records });
    } catch (e: any) {
      setError(e?.message ?? "Failed to submit attendance");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen title="Attendance">
      {error ? <ErrorBox message={error} /> : null}

      <Info>
        Backend marks attendance for today (date is server-chosen).{"\n"}
        Provide classId, then tap students to toggle present/absent.
      </Info>

      <Field label="Class ID" value={classId} onChangeText={setClassId} placeholder="paste class _id" />
      <PrimaryButton
        title="Load students"
        onPress={() => void studentsQuery.refetch()}
        loading={studentsQuery.isFetching}
        disabled={!classId}
      />

      {studentsQuery.isLoading ? <Info>Loading students…</Info> : null}
      {studentsQuery.isError ? <ErrorBox message={(studentsQuery.error as any)?.message ?? "Failed to load"} /> : null}

      <FlatList
        data={studentsQuery.data ?? []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const present = Boolean(presentMap[item._id]);
          return (
            <TouchableOpacity
              onPress={() => toggle(item._id)}
              style={{
                padding: 12,
                borderRadius: 12,
                marginBottom: 10,
                backgroundColor: present ? "#14532d" : "#7f1d1d",
                borderWidth: 1,
                borderColor: present ? "#16a34a" : "#ef4444",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>{item.name}</Text>
              <Text style={{ color: "#fff", opacity: 0.9 }}>
                {present ? "Present" : "Absent"} • {item._id}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={studentsQuery.data ? <Info>No students found</Info> : null}
      />

      <PrimaryButton title="Submit attendance" onPress={() => void submit()} loading={submitting} disabled={!classId} />
    </Screen>
  );
}