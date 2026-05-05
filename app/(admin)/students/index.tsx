import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as StudentsApi from "@/src/api/students";
import { ErrorBox, Field, Info, PrimaryButton } from "@/src/ui/basic";
import { OptionSelector } from "@/src/ui/erp-widgets";
import { AppScreen } from "@/src/ui/app-screen";
import { Href, router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { erp } from "@/src/theme/erp";

export default function CreateStudent() {
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
    <AppScreen title="Create Student">
      <View style={styles.container}>
        {error ? <ErrorBox message={error} /> : null}

        <Field label="Class ID" value={classId} onChangeText={setClassId} placeholder="paste class _id" />

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

        <PrimaryButton
          title="View Students List"
          onPress={() => router.push("list" as Href)}
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