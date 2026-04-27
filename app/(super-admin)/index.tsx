import { Text, ScrollView } from "react-native";
import { AppScreen } from "@/src/ui/app-screen";
import { StatCard } from "@/components/ui/stat-card";
import { LogoutButton } from "@/src/ui/logout-button";
import { useQuery } from "@tanstack/react-query";
import * as SchoolsApi from "@/src/api/schools";
import * as UsersApi from "@/src/api/users";

export default function SuperAdminDashboard() {
  const schoolsCountQuery = useQuery({
    queryKey: ["schools-count"],
    queryFn: SchoolsApi.countSchools,
  });

  const adminsCountQuery = useQuery({
    queryKey: ["admins-count"],
    queryFn: () => UsersApi.countUsers("SCHOOL_ADMIN"),
  });

  return (
    <AppScreen title="Super Admin Dashboard">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
          Welcome, Super Admin
        </Text>

        <StatCard
          title="Total Schools"
          value={schoolsCountQuery.data?.toString() || "0"}
          subtitle="Active schools in system"
          icon="business-outline"
        />

        <StatCard
          title="Total Admins"
          value={adminsCountQuery.data?.toString() || "0"}
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