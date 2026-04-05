import { router } from "expo-router";
import { AppScreen } from "@/src/ui/app-screen";
import { Info, PrimaryButton } from "@/src/ui/basic";
import { ErpCard, SectionHeader } from "@/src/ui/erp-widgets";
import { Text } from "react-native";
import { erp } from "@/src/theme/erp";

export default function TeacherClasses() {
  return (
    <AppScreen title="Classes" subtitle="Today">
      <ErpCard style={{ marginBottom: erp.space.md }}>
        <Text style={{ color: erp.colors.textSecondary, marginBottom: 8 }}>9:00</Text>
        <Text style={{ color: erp.colors.textPrimary, fontWeight: "700" }}>Physics · 11-A</Text>
        <Text style={{ color: erp.colors.textMuted, marginTop: 4 }}>Placeholder timetable</Text>
      </ErpCard>
      <SectionHeader title="Actions" />
      <PrimaryButton title="Mark attendance" onPress={() => router.push("/(teacher)/attendance")} />
      <Info>Connect this screen to a timetable API when available.</Info>
    </AppScreen>
  );
}
