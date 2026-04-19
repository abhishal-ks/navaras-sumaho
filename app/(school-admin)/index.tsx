import { Text, ScrollView } from "react-native";
import { AppScreen } from "@/src/ui/app-screen";
import { StatCard } from "@/components/ui/stat-card";
import { LogoutButton } from "@/src/ui/logout-button";

export default function SchoolAdminDashboard() {
  return (
    <AppScreen title="School Dashboard">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
          Welcome, School Administrator
        </Text>

        <StatCard
          title="Total Students"
          value="247"
          subtitle="Enrolled in your school"
          icon="school-outline"
        />

        <StatCard
          title="Total Teachers"
          value="15"
          subtitle="Teaching staff"
          icon="people-outline"
        />

        <StatCard
          title="Classes"
          value="12"
          subtitle="Active classes"
          icon="book-outline"
        />

        <StatCard
          title="Attendance Today"
          value="89%"
          subtitle="Average attendance"
          icon="checkmark-circle-outline"
        />
        <LogoutButton />
      </ScrollView>
    </AppScreen>
  );
}