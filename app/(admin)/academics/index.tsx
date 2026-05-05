import { Href, router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppScreen } from "@/src/ui/app-screen";
import { PrimaryButton } from "@/src/ui/basic";
import { erp } from "@/src/theme/erp";

export default function AcademicsIndex() {
  return (
    <AppScreen title="Academics Setup">
      <View style={styles.container}>
        <PrimaryButton
          title="Manage Academic Years"
          onPress={() => router.push("years" as Href)}
        />
        <PrimaryButton
          title="Manage Classes"
          onPress={() => router.push("classes" as Href)}
        />
        <PrimaryButton
          title="Manage Subjects"
          onPress={() => router.push("subjects" as Href)}
        />
        <PrimaryButton
          title="Teacher Assignments"
          onPress={() => router.push("assignments" as Href)}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: erp.space.lg,
    gap: erp.space.md,
  },
});