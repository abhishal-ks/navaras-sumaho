import { View, Text } from "react-native";
import { AppScreen } from "@/src/ui/app-screen";

export default function SuperAdminAdmins() {
  return (
    <AppScreen title="Admin Management">
      <View style={{ padding: 20 }}>
        <Text>Manage School Administrators</Text>
        <Text style={{ marginTop: 20, color: 'gray' }}>
          This screen will allow super admin to view, create, and manage school administrators across all schools.
        </Text>
      </View>
    </AppScreen>
  );
}