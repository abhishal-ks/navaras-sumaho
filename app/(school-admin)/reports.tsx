import { View, Text } from "react-native";
import { AppScreen } from "@/src/ui/app-screen";

export default function SchoolAdminReports() {
  return (
    <AppScreen title="School Reports">
      <View style={{ padding: 20 }}>
        <Text>School-specific Reports</Text>
        <Text style={{ marginTop: 20, color: 'gray' }}>
          This screen will show reports for your school including student performance, attendance, and teacher statistics.
        </Text>
      </View>
    </AppScreen>
  );
}