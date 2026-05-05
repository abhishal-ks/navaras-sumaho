import { View } from "react-native";
import { router } from "expo-router";
import { Info, PrimaryButton } from "@/src/ui/basic";
import { AppScreen } from "@/src/ui/app-screen";

export default function AssignmentsList() {
  return (
    <AppScreen title="My Assignments">
      <View style={{ paddingBottom: 20 }}>
        <PrimaryButton
          title="← Back"
          onPress={() => router.back()}
        />
      </View>

      <Info>Assignment listing and management coming soon</Info>
    </AppScreen>
  );
}
