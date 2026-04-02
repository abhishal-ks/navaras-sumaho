import React from "react";
import { useAuth } from "@/src/features/auth/auth-store";
import { Info, PrimaryButton, Screen } from "@/src/ui/basic";
import { Href, router } from "expo-router";

export default function Student() {
  const { me, logout } = useAuth();

  return (
    <Screen title="Student">
      <Info>
        {"role" in (me ?? {}) ? `Role: ${(me as any).role}` : "Role: -"}
        {"\n"}
        {me?.role === "STUDENT" ? `Class: ${me.classId}` : "Class: -"}
      </Info>

      <PrimaryButton title="Report card" onPress={() => router.push("/(student)/report" as Href)} />
      <PrimaryButton title="Logout" onPress={logout} />
    </Screen>
  );
}