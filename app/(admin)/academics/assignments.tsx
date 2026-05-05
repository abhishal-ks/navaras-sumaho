import { useState } from "react";
import * as AcademicsApi from "@/src/api/academics";
import { ErrorBox, Field, Info, PrimaryButton } from "@/src/ui/basic";
import { AppScreen } from "@/src/ui/app-screen";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { erp } from "@/src/theme/erp";

export default function AcademicAssignments() {
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
    <AppScreen title="Teacher Assignments">
      <View style={styles.container}>
        {error ? <ErrorBox message={error} /> : null}

        <Info>
          Last response: {last ? JSON.stringify(last) : "(none)"}
        </Info>

        <Info>Assign teacher to subject</Info>
        <Field label="Class ID" value={assignClassId} onChangeText={setAssignClassId} placeholder="paste class _id" />
        <Field label="Subject ID" value={assignSubjectId} onChangeText={setAssignSubjectId} placeholder="paste subject _id" />
        <Field label="Teacher userId" value={assignTeacherId} onChangeText={setAssignTeacherId} placeholder="paste teacher userId" />
        <PrimaryButton
          title="Assign teacher"
          onPress={() => void run(() => AcademicsApi.assignTeacher(assignClassId, assignSubjectId, { teacherId: assignTeacherId }))}
          loading={loading}
        />

        <PrimaryButton
          title="Back to Academics"
          onPress={() => router.back()}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: erp.space.lg,
    gap: erp.space.md,
  },
});