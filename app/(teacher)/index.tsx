import React from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/src/features/auth/auth-store";
import { AppScreen } from "@/src/ui/app-screen";
import { PrimaryButton } from "@/src/ui/basic";
import { ActionCard } from "@/components/ui/action-card";
import { StatCard } from "@/components/ui/stat-card";
import { erp } from "@/src/theme/erp";

export default function TeacherDashboard() {
  const { logout } = useAuth();

  const teacherName = 'Teacher';

  return (
    <AppScreen title={`Hello ${teacherName}!`} subtitle="Manage your classes and students">
      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <StatCard
          title="Today's Classes"
          value="5"
          icon="school-outline"
          style={styles.statCard}
        />
        <StatCard
          title="Students"
          value="120"
          icon="people-outline"
          style={styles.statCard}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <ActionCard
          title="Take Attendance"
          subtitle="Mark student attendance"
          icon="checkmark-circle-outline"
          onPress={() => router.push("/(teacher)/attendance")}
        />

        <ActionCard
          title="Manage Announcements"
          subtitle="Post updates and notices"
          icon="megaphone-outline"
          onPress={() => router.push("/(teacher)/announcements")}
        />

        <ActionCard
          title="Assignments"
          subtitle="Create and grade assignments"
          icon="document-text-outline"
          onPress={() => router.push("/(teacher)/assignments")}
        />

        <ActionCard
          title="Student Profiles"
          subtitle="View student information"
          icon="person-outline"
          onPress={() => router.push("/(teacher)/students")}
        />

        <ActionCard
          title="Class Schedule"
          subtitle="View your timetable"
          icon="time-outline"
          onPress={() => router.push("/(teacher)/classes")}
        />
      </View>

      <PrimaryButton title="Logout" onPress={logout} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: erp.space.md,
    marginBottom: erp.space.lg,
  },
  statCard: {
    flex: 1,
  },
  actionsSection: {
    marginBottom: erp.space.xl,
  },
});