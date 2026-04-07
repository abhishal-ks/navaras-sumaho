import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "@/src/ui/app-screen";
import { PrimaryButton } from "@/src/ui/basic";
import { erp } from "@/src/theme/erp";
import { api } from "@/src/services/api";

type Student = {
  _id: string;
  name: string;
  rollNumber?: string;
};

export default function Attendance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  const CLASS_ID = "69b95e0c2dd1f3a101c384a6";

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await api.get(`/students/classes/${CLASS_ID}/students`);
      setStudents(res.data);

      // Initialize attendance as absent for all students
      const initialAttendance: Record<string, boolean> = {};
      res.data.forEach((student: Student) => {
        initialAttendance[student._id] = false;
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to load students");
    }
  };

  const toggleAttendance = (id: string) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const submitAttendance = () => {
    const presentCount = Object.values(attendance).filter(Boolean).length;
    const totalCount = students.length;

    Alert.alert(
      "Submit Attendance",
      `Present: ${presentCount}/${totalCount}\nAbsent: ${totalCount - presentCount}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: () => {
            console.log("Attendance submitted:", attendance);
            Alert.alert("Success", "Attendance submitted successfully!");
          }
        }
      ]
    );
  };

  const getAttendanceStats = () => {
    const present = Object.values(attendance).filter(Boolean).length;
    const total = students.length;
    return { present, total, absent: total - present };
  };

  const stats = getAttendanceStats();

  return (
    <AppScreen title="Take Attendance" subtitle={`Class • ${students.length} students`}>
      {/* Stats Header */}
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

      {/* Student List */}
      <View style={styles.studentList}>
        {students.map((student) => (
          <TouchableOpacity
            key={student._id}
            onPress={() => toggleAttendance(student._id)}
            style={[
              styles.studentCard,
              attendance[student._id] ? styles.presentCard : styles.absentCard
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student.name}</Text>
              {student.rollNumber && (
                <Text style={styles.rollNumber}>Roll: {student.rollNumber}</Text>
              )}
            </View>

            <View style={[
              styles.statusIndicator,
              attendance[student._id] ? styles.presentIndicator : styles.absentIndicator
            ]}>
              <Ionicons
                name={attendance[student._id] ? "checkmark" : "close"}
                size={16}
                color="white"
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <PrimaryButton
        title="Submit Attendance"
        onPress={submitAttendance}
        disabled={students.length === 0}
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
  studentList: {
    marginBottom: erp.space.lg,
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
  rollNumber: {
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