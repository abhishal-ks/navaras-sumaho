import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/features/auth/auth-store";
import * as StudentsApi from "@/src/api/students";
import * as AcademicsApi from "@/src/api/academics";
import { AppScreen } from "@/src/ui/app-screen";
import { ErrorBox, Field, Info, PrimaryButton } from "@/src/ui/basic";
import { erp } from "@/src/theme/erp";

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
      Alert.alert("Success", "Attendance submitted successfully!");
    } catch (e: any) {
      setError(e?.message ?? "Failed to submit attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const getAttendanceStats = () => {
    const students = studentsQuery.data ?? [];
    const present = students.filter(s => presentMap[s._id]).length;
    const total = students.length;
    return { present, total, absent: total - present };
  };

  const stats = getAttendanceStats();

  return (
    <AppScreen title="Mark Attendance" subtitle="Select class and mark student attendance">
      {error ? <ErrorBox message={error} /> : null}

      <Info>
        Backend marks attendance for today. Provide class ID, then tap students to toggle present/absent.
      </Info>

      <Field
        label="Class ID"
        value={classId}
        onChangeText={setClassId}
        placeholder="paste class _id"
      />

      <PrimaryButton
        title="Load Students"
        onPress={() => void studentsQuery.refetch()}
        loading={studentsQuery.isFetching}
        disabled={!classId}
      />

      {studentsQuery.isLoading ? <Info loading>Loading students…</Info> : null}
      {studentsQuery.isError ? (
        <ErrorBox message={(studentsQuery.error as any)?.message ?? "Failed to load"} />
      ) : null}

      {/* Attendance Stats */}
      {studentsQuery.data && studentsQuery.data.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.present}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.absent}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      )}

      {/* Student List */}
      {studentsQuery.data?.map((student) => {
        const present = Boolean(presentMap[student._id]);
        return (
          <TouchableOpacity
            key={student._id}
            onPress={() => toggle(student._id)}
            style={[
              styles.studentCard,
              present ? styles.presentCard : styles.absentCard
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.studentId}>{student._id}</Text>
            </View>

            <View style={[
              styles.statusIndicator,
              present ? styles.presentIndicator : styles.absentIndicator
            ]}>
              <Ionicons
                name={present ? "checkmark" : "close"}
                size={16}
                color="white"
              />
            </View>
          </TouchableOpacity>
        );
      })}

      {studentsQuery.data?.length === 0 && !studentsQuery.isLoading && (
        <Info>No students found</Info>
      )}

      <PrimaryButton
        title="Submit Attendance"
        onPress={() => void submit()}
        loading={submitting}
        disabled={!classId}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: erp.colors.surface,
    borderRadius: erp.radii.lg,
    padding: erp.space.lg,
    marginBottom: erp.space.lg,
    borderWidth: 1,
    borderColor: erp.colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: erp.colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: erp.colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: erp.colors.border,
    marginHorizontal: erp.space.md,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: erp.space.lg,
    borderRadius: erp.radii.lg,
    marginBottom: erp.space.sm,
    borderWidth: 1,
    borderColor: erp.colors.border,
  },
  presentCard: {
    backgroundColor: erp.colors.successBg,
    borderColor: erp.colors.success,
  },
  absentCard: {
    backgroundColor: erp.colors.dangerBg,
    borderColor: erp.colors.danger,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: erp.colors.textPrimary,
  },
  studentId: {
    fontSize: 12,
    color: erp.colors.textMuted,
    marginTop: 2,
  },
  statusIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presentIndicator: {
    backgroundColor: erp.colors.success,
  },
  absentIndicator: {
    backgroundColor: erp.colors.danger,
  },
});