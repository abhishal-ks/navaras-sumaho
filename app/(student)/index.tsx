import React from "react";
import { useAuth } from "@/src/features/auth/auth-store";
import { Info, PrimaryButton } from "@/src/ui/basic";
import { Href, router } from "expo-router";
import { AppScreen } from "@/src/ui/app-screen";
import { LogoutButton } from "@/src/ui/logout-button";

export default function Student() {
  const { me } = useAuth();

  return (
    <AppScreen title="Student Dashboard">
      <Info>
        {me?.role === "STUDENT" ? `Student ID: ${me.studentId}\n` : ""}
        {me?.role === "STUDENT" ? `Class: ${me.classId}\n` : ""}
        {`Role: ${me?.role ?? "Unknown"}`}
      </Info>

      <PrimaryButton title="Report Card" onPress={() => router.push("/(student)/report" as Href)} />
      <PrimaryButton title="Announcements" onPress={() => router.push("/(student)/announcements" as Href)} />
      <PrimaryButton title="Resources" onPress={() => router.push("/(student)/resources" as Href)} />
      <LogoutButton />
    </AppScreen>
  );
}