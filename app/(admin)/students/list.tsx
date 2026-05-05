import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as StudentsApi from "@/src/api/students";
import { ErrorBox, Field, Info, PrimaryButton } from "@/src/ui/basic";
import { AppScreen } from "@/src/ui/app-screen";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { erp } from "@/src/theme/erp";

export default function StudentsList() {
  const [classId, setClassId] = useState("");

  const studentsQuery = useQuery({
    queryKey: ["students", "class", classId],
    queryFn: () => StudentsApi.listByClass(classId),
    enabled: Boolean(classId),
  });

  return (
    <AppScreen title="Students List">
      <View style={styles.container}>
        <Field label="Class ID" value={classId} onChangeText={setClassId} placeholder="paste class _id" />
        <PrimaryButton title="Refresh list" onPress={() => void studentsQuery.refetch()} loading={studentsQuery.isFetching} disabled={!classId} />

        {studentsQuery.isLoading ? <Info loading>Loading students…</Info> : null}
        {studentsQuery.isError ? <ErrorBox message={(studentsQuery.error as any)?.message ?? "Failed to load"} /> : null}
        {studentsQuery.data ? (
          <Info>
            {studentsQuery.data.length ? studentsQuery.data.map((s) => `${s._id}: ${s.name}`).join("\n") : "No students found"}
          </Info>
        ) : null}

        <PrimaryButton
          title="Create New Student"
          onPress={() => router.push("/(admin)/students")}
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