import { useState } from "react";
import * as AcademicsApi from "@/src/api/academics";
import { ErrorBox, Field, Info, PrimaryButton } from "@/src/ui/basic";
import { AppScreen } from "@/src/ui/app-screen";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { erp } from "@/src/theme/erp";

export default function AcademicSubjects() {
  const [subjectClassId, setSubjectClassId] = useState("");
  const [subjectName, setSubjectName] = useState("");

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
    <AppScreen title="Academic Subjects">
      <View style={styles.container}>
        {error ? <ErrorBox message={error} /> : null}

        <Info>
          Last response: {last ? JSON.stringify(last) : "(none)"}
        </Info>

        <Info>Subject</Info>
        <Field label="Class ID" value={subjectClassId} onChangeText={setSubjectClassId} placeholder="paste class _id" />
        <Field label="Subject name" value={subjectName} onChangeText={setSubjectName} placeholder="Mathematics" />
        <PrimaryButton
          title="Create subject"
          onPress={() => void run(() => AcademicsApi.createSubject(subjectClassId, { name: subjectName }))}
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