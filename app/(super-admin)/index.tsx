import { Text, ScrollView } from "react-native";
import { AppScreen } from "@/src/ui/app-screen";
import { StatCard } from "@/components/ui/stat-card";
import { LogoutButton } from "@/src/ui/logout-button";

export default function SuperAdminDashboard() {
  return (
    <AppScreen title="Super Admin Dashboard">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
          Welcome, Super Admin
        </Text>

        <StatCard
          title="Total Schools"
          value="12"
          subtitle="Active schools in system"
          icon="business-outline"
        />

        <StatCard
          title="Total Admins"
          value="8"
          subtitle="School administrators"
          icon="people-outline"
        />

        <StatCard
          title="Total Students"
          value="1,247"
          subtitle="Enrolled students"
          icon="school-outline"
        />

        <StatCard
          title="Total Teachers"
          value="156"
          subtitle="Teaching staff"
          icon="person-outline"
        />
        <LogoutButton />
      </ScrollView>
    </AppScreen>
  );
}