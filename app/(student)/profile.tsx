import { Text } from "react-native";
import { useAuth } from "@/src/features/auth/auth-store";
import { AppScreen } from "@/src/ui/app-screen";
import { PrimaryButton } from "@/src/ui/basic";
import { ErpCard } from "@/src/ui/erp-widgets";
import { erp } from "@/src/theme/erp";

export default function StudentProfile() {
  const { me, logout } = useAuth();

  return (
    <AppScreen title="Profile" subtitle="Student">
      <ErpCard>
        <Text style={{ color: erp.colors.textSecondary }}>Class</Text>
        <Text style={{ color: erp.colors.textPrimary, fontWeight: "700" }}>
          {me?.role === "STUDENT" ? me.classId : "—"}
        </Text>
      </ErpCard>
      <PrimaryButton title="Log out" onPress={logout} />
    </AppScreen>
  );
}
