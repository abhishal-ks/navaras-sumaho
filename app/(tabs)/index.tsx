import { View, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { AppScreen } from "@/src/ui/app-screen";
import { LogoutButton } from "@/src/ui/logout-button";
import { StatCard } from "@/components/ui/stat-card";
import { ActionCard } from "@/components/ui/action-card";
import { erp } from "@/src/theme/erp";

export default function Dashboard() {
  const userName = 'User';

  return (
    <AppScreen title={`Welcome back ${userName} 👋`} subtitle="Here's your overview">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard
            title="Tasks"
            value="12"
            icon="checkmark-circle-outline"
            style={styles.statCard}
          />
          <StatCard
            title="Messages"
            value="5"
            icon="chatbubble-outline"
            style={styles.statCard}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <ActionCard
            title="Mark Attendance"
            subtitle="Update today's attendance"
            icon="calendar-outline"
            onPress={() => router.push("/(tabs)/attendance")}
          />
          <ActionCard
            title="View Announcements"
            subtitle="Latest school updates"
            icon="notifications-outline"
            onPress={() => router.push("/(tabs)/announcements")}
          />
        </View>

        {/* System Status */}
        <View style={styles.statusCard}>
          <StatCard
            title="System Status"
            value="All systems running"
            icon="shield-checkmark-outline"
            iconColor={erp.colors.success}
          />
        </View>

        <LogoutButton />
      </ScrollView>
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
  section: {
    marginBottom: erp.space.lg,
  },
  statusCard: {
    marginBottom: erp.space.xl,
  },
});