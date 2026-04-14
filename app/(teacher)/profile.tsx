import { Text } from "react-native";
import { useAuth } from "@/src/features/auth/auth-store";
import { AppScreen } from "@/src/ui/app-screen";
import { LogoutButton } from "@/src/ui/logout-button";
import { ErpCard } from "@/src/ui/erp-widgets";
import { erp } from "@/src/theme/erp";

export default function TeacherProfile() {
  const { me } = useAuth();

  return (
    <AppScreen title="Profile" subtitle="Teacher account">
      <ErpCard>
        <Text style={{ color: erp.colors.textSecondary }}>School</Text>
        <Text style={{ color: erp.colors.textPrimary, fontWeight: "700" }}>
          {"schoolId" in (me ?? {}) ? (me as { schoolId: string }).schoolId : "—"}
        </Text>
      </ErpCard>
      <LogoutButton />
    </AppScreen>
  );
}
