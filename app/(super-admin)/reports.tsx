import { View, Text } from "react-native";
import { AppScreen } from "@/src/ui/app-screen";

export default function SuperAdminReports() {
  return (
    <AppScreen title="System Reports">
      <View style={{ padding: 20 }}>
        <Text>System-wide Reports</Text>
        <Text style={{ marginTop: 20, color: 'gray' }}>
          This screen will show comprehensive reports across all schools in the system.
        </Text>
      </View>
    </AppScreen>
  );
}