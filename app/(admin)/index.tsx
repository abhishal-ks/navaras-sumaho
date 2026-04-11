import { Href, router } from "expo-router";
import { useAuth } from "@/src/features/auth/auth-store";
import { PrimaryButton, Info } from "@/src/ui/basic";
import { AppScreen } from "@/src/ui/app-screen";
import { LogoutButton } from "@/src/ui/logout-button";

export default function Admin() {
  const { me } = useAuth();

  const displayRole = me?.role === "SUPER_ADMIN" ? "Super Admin" : "School Admin";
  const schoolInfo = me && me.role !== "SUPER_ADMIN" && "schoolId" in me ? `School: ${me.schoolId}` : "";

  return (
    <AppScreen title="Admin Dashboard">
      <Info>
        {`Role: ${displayRole}\n`}
        {schoolInfo}
      </Info>

      <PrimaryButton title="School Setup" onPress={() => router.push("/(admin)/schools" as Href)} />
      <PrimaryButton title="Academics Setup" onPress={() => router.push("/(admin)/academics" as Href)} />
      <PrimaryButton title="Students" onPress={() => router.push("/(admin)/students")} />
      <PrimaryButton title="Teachers" onPress={() => router.push("/(admin)/teachers")} />
      <PrimaryButton title="Parents" onPress={() => router.push("/(admin)/parents")} />
      <PrimaryButton title="Reports" onPress={() => router.push("/(admin)/reports" as Href)} />
      <LogoutButton />
    </AppScreen>
  );
}