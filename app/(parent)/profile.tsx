import { AppScreen } from "@/src/ui/app-screen";
import { PrimaryButton } from "@/src/ui/basic";
import { ErpCard } from "@/src/ui/erp-widgets";
import { useAuth } from "@/src/features/auth/auth-store";
import { Text } from "react-native";
import { erp } from "@/src/theme/erp";

export default function ParentProfile() {
  const { me, logout } = useAuth();

  return (
    <AppScreen title="Profile" subtitle="Account">
      <ErpCard>
        <Text style={{ color: erp.colors.textSecondary }}>Role</Text>
        <Text style={{ color: erp.colors.textPrimary, fontWeight: "700", marginBottom: 12 }}>
          {(me as { role?: string })?.role ?? "—"}
        </Text>
        {"schoolId" in (me ?? {}) ? (
          <>
            <Text style={{ color: erp.colors.textSecondary }}>School</Text>
            <Text style={{ color: erp.colors.textPrimary, fontWeight: "600" }}>
              {(me as { schoolId: string }).schoolId}
            </Text>
          </>
        ) : null}
      </ErpCard>
      <PrimaryButton title="Log out" onPress={logout} />
    </AppScreen>
  );
}
