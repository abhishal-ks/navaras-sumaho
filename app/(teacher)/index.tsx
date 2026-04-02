import React from "react";
import { Href, router } from "expo-router";
import { useAuth } from "@/src/features/auth/auth-store";
import { Info, PrimaryButton, Screen } from "@/src/ui/basic";

export default function Teacher() {
  const { me, logout } = useAuth();

  return (
    <Screen title="Teacher">
      <Info>
        {"role" in (me ?? {}) ? `Role: ${(me as any).role}` : "Role: -"}
        {"\n"}
        {"schoolId" in (me ?? {}) ? `School: ${(me as any).schoolId}` : "School: -"}
      </Info>

      <PrimaryButton title="Attendance" onPress={() => router.push("/(teacher)/attendance")} />
      <PrimaryButton title="Announcements" onPress={() => router.push("/(teacher)/announcements")} />
      <PrimaryButton title="Assignments" onPress={() => router.push("/(teacher)/assignments" as Href)} />
      <PrimaryButton title="Logout" onPress={logout} />
    </Screen>
  );
}