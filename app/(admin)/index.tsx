import { Href, router } from "expo-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/src/features/auth/auth-store";
import { PrimaryButton, Info } from "@/src/ui/basic";
import { AppScreen } from "@/src/ui/app-screen";
import { LogoutButton } from "@/src/ui/logout-button";
import * as SchoolsApi from "@/src/api/schools";

export default function Admin() {
  const { me, switchSchool } = useAuth();
  const [schools, setSchools] = useState<SchoolsApi.School[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (me?.role === "SUPER_ADMIN") {
      SchoolsApi.listSchools().then(setSchools).catch(console.error);
    }
  }, [me]);

  const displayRole = me?.role === "SUPER_ADMIN" ? "Super Admin" : "School Admin";
  const schoolInfo = me && me.role !== "SUPER_ADMIN" && "schoolId" in me ? `School: ${me.schoolId}` : "";
  const currentSchoolId = me && "schoolId" in me ? me.schoolId : null;

  const handleSwitchSchool = async (schoolId: string) => {
    setLoading(true);
    try {
      await switchSchool(schoolId);
    } catch (error) {
      console.error("Failed to switch school:", error);
    } finally {
      setLoading(false);
    }
  };

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

      {me?.role === "SUPER_ADMIN" && schools.length > 0 && (
        <Info>
          Available Schools:
          {schools.map((school) => (
            <PrimaryButton
              key={school._id}
              title={`${school.name} (${school.board}) ${school._id === currentSchoolId ? "← Current" : ""}`}
              onPress={() => handleSwitchSchool(school._id)}
              loading={loading}
            />
          ))}
        </Info>
      )}

    </AppScreen>
  );
}