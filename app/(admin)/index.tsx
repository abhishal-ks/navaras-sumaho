import { Href, router } from "expo-router";
import { useAuth } from "@/src/features/auth/auth-store";
import { PrimaryButton, Info } from "@/src/ui/basic";
import { AppScreen } from "@/src/ui/app-screen";

export default function Admin() {
  const { me, logout } = useAuth();

  return (
    <AppScreen title="Admin">
      <Info>
        {"role" in (me ?? {}) ? `Role: ${(me as any).role}` : "Role: -"}
        {"\n"}
        {"schoolId" in (me ?? {}) ? `School: ${(me as any).schoolId}` : "School: -"}
      </Info>

      <PrimaryButton title="School setup" onPress={() => router.push("/(admin)/schools" as Href)} />
      <PrimaryButton title="Academics setup" onPress={() => router.push("/(admin)/academics" as Href)} />
      <PrimaryButton title="Students" onPress={() => router.push("/(admin)/students")} />
      <PrimaryButton title="Reports" onPress={() => router.push("/(admin)/reports" as Href)} />
      <PrimaryButton title="Logout" onPress={logout} />
    </AppScreen>
  );
}