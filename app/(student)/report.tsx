import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import * as AcademicsApi from "@/src/api/academics";
import { ErrorBox, Field, Info, PrimaryButton } from "@/src/ui/basic";
import { AppScreen } from "@/src/ui/app-screen";
import { erp } from "@/src/theme/erp";

export default function StudentReport() {
  const [studentId, setStudentId] = useState("");

  const reportQuery = useQuery({
    queryKey: ["reports", "student", studentId],
    queryFn: () => AcademicsApi.getStudentReport(studentId),
    enabled: Boolean(studentId),
  });

  return (
    <AppScreen title="Report Card">
      {!studentId ? (
        <>
          <Info>
            Paste your Student ID to view your report card. Enter the ID below and tap "Fetch Report".
          </Info>
          <Field label="Student ID" value={studentId} onChangeText={setStudentId} placeholder="paste student _id" />
          <PrimaryButton
            title="Fetch Report"
            onPress={() => void reportQuery.refetch()}
            loading={reportQuery.isFetching}
            disabled={!studentId}
          />
        </>
      ) : (
        <>
          <View style={styles.idDisplay}>
            <Text style={styles.idLabel}>Student ID</Text>
            <Text style={styles.idValue}>{studentId}</Text>
          </View>
          <PrimaryButton
            title="Refresh Report"
            onPress={() => void reportQuery.refetch()}
            loading={reportQuery.isFetching}
          />

          {reportQuery.isLoading ? <Info loading>Loading report…</Info> : null}
          {reportQuery.isError ? <ErrorBox message={(reportQuery.error as any)?.message ?? "Failed to load"} /> : null}
          {reportQuery.data ? <View style={styles.reportBox}>
            <Text style={styles.reportText}>{JSON.stringify(reportQuery.data, null, 2)}</Text>
          </View> : null}
        </>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  idDisplay: {
    backgroundColor: erp.colors.surface,
    borderWidth: 1,
    borderColor: erp.colors.border,
    borderRadius: erp.radii.md,
    padding: erp.space.md,
    marginBottom: erp.space.md,
  },
  idLabel: {
    color: erp.colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  idValue: {
    color: erp.colors.accent,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "monospace",
  },
  reportBox: {
    backgroundColor: erp.colors.surface,
    borderWidth: 1,
    borderColor: erp.colors.border,
    borderRadius: erp.radii.md,
    padding: erp.space.md,
    marginTop: erp.space.md,
  },
  reportText: {
    color: erp.colors.textPrimary,
    fontSize: 12,
    fontFamily: "monospace",
    lineHeight: 18,
  },
});

