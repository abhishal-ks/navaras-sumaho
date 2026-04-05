import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import * as ParentsApi from "@/src/api/parents";
import * as AcademicsApi from "@/src/api/academics";
import { AppScreen } from "@/src/ui/app-screen";
import { ErrorBox, Info, PrimaryButton } from "@/src/ui/basic";
import { ErpCard, ListRow, SectionHeader } from "@/src/ui/erp-widgets";
import { erp } from "@/src/theme/erp";

type ReportPayload =
  | { message: string }
  | {
      studentName?: string;
      reports: {
        exam: string;
        subjects: { subject: string; marks: number; maxMarks: number }[];
        totalMarks: number;
        totalMaxMarks: number;
        percentage: string;
      }[];
    };

export default function ParentResults() {
  const childrenQuery = useQuery({
    queryKey: ["parents", "children"],
    queryFn: () => ParentsApi.getMyChildren(),
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const firstId = childrenQuery.data?.[0]?.studentId;
  const activeStudentId = selectedId ?? firstId ?? "";

  const reportQuery = useQuery({
    queryKey: ["report", "parent", activeStudentId],
    queryFn: () => AcademicsApi.getStudentReport(activeStudentId),
    enabled: Boolean(activeStudentId),
  });

  const rows = useMemo(() => {
    const data = reportQuery.data as ReportPayload | undefined;
    if (!data || "message" in data) return [];
    const out: { key: string; line: string; sub?: string }[] = [];
    let i = 0;
    for (const r of data.reports ?? []) {
      out.push({
        key: `exam-${i++}`,
        line: r.exam,
        sub: `${r.totalMarks}/${r.totalMaxMarks} · ${r.percentage}%`,
      });
      for (const s of r.subjects ?? []) {
        out.push({
          key: `sub-${i++}`,
          line: s.subject,
          sub: `${s.marks}/${s.maxMarks}`,
        });
      }
    }
    return out;
  }, [reportQuery.data]);

  const report = reportQuery.data as ReportPayload | undefined;

  return (
    <AppScreen title="Results" subtitle="Marks & report card">
      {childrenQuery.isError ? (
        <ErrorBox message={(childrenQuery.error as Error)?.message ?? "Failed to load children"} />
      ) : null}

      {childrenQuery.data && childrenQuery.data.length > 1 ? (
        <>
          <SectionHeader title="Child" />
          <View style={styles.chipRow}>
            {childrenQuery.data.map((c) => {
              const active = c.studentId === activeStudentId;
              return (
                <Pressable
                  key={c.studentId}
                  onPress={() => setSelectedId(c.studentId)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{c.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : null}

      {childrenQuery.data?.length === 0 ? (
        <Info>No linked children yet. Ask your school admin to link your account.</Info>
      ) : null}

      <PrimaryButton
        title="Refresh report"
        onPress={() => void reportQuery.refetch()}
        loading={reportQuery.isFetching}
        disabled={!activeStudentId}
      />

      {reportQuery.isLoading ? <Info loading>Loading report…</Info> : null}
      {reportQuery.isError ? (
        <ErrorBox message={(reportQuery.error as Error)?.message ?? "Failed to load report"} />
      ) : null}

      {report && "message" in report ? <Info>{report.message}</Info> : null}

      {report && "studentName" in report && report.studentName ? (
        <ErpCard style={{ marginVertical: erp.space.md }}>
          <Text style={styles.studentName}>{report.studentName}</Text>
        </ErpCard>
      ) : null}

      <SectionHeader title="Breakdown" />
      {rows.map((item) => (
        <ListRow key={item.key} title={item.line} subtitle={item.sub} />
      ))}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: erp.space.md },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: erp.radii.full,
    backgroundColor: erp.colors.surface,
    borderWidth: 1,
    borderColor: erp.colors.border,
  },
  chipActive: {
    backgroundColor: erp.colors.accentMuted,
    borderColor: erp.colors.accent,
  },
  chipText: { color: erp.colors.textSecondary, fontWeight: "600" },
  chipTextActive: { color: erp.colors.accent },
  studentName: { color: erp.colors.textPrimary, fontSize: 18, fontWeight: "700" },
});
