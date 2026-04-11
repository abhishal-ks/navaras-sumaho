import { StyleSheet, Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { AppScreen } from "@/src/ui/app-screen";
import { PrimaryButton } from "@/src/ui/basic";
import { erp } from "@/src/theme/erp";

export default function AuthIndex() {
  return (
    <AppScreen
      scroll
      contentContainerStyle={styles.scrollCenter}
    >
      <View style={styles.container}>
        {/* Logo/Brand */}
        <View style={styles.heroSection}>
          <Text style={styles.brand}>Navarasa</Text>
          <Text style={styles.tagline}>School Management & Learning Platform</Text>
        </View>

        {/* Selection Cards */}
        <View style={styles.cardsSection}>
          {/* Admin Option */}
          <Pressable
            style={styles.card}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.cardIcon}>👨‍💼</Text>
            <Text style={styles.cardTitle}>Admin</Text>
            <Text style={styles.cardSubtitle}>School administration</Text>
          </Pressable>

          {/* Student Option */}
          <Pressable
            style={styles.card}
            onPress={() => router.push("/(auth)/student-login")}
          >
            <Text style={styles.cardIcon}>👨‍🎓</Text>
            <Text style={styles.cardTitle}>Student</Text>
            <Text style={styles.cardSubtitle}>Access your academics</Text>
          </Pressable>

          {/* Parent Option */}
          <Pressable
            style={styles.card}
            onPress={() => router.push("/(auth)/parent-activate")}
          >
            <Text style={styles.cardIcon}>👨‍👩‍👧</Text>
            <Text style={styles.cardTitle}>Parent</Text>
            <Text style={styles.cardSubtitle}>Monitor your child's progress</Text>
          </Pressable>
        </View>

        {/* Create Admin Account */}
        <View style={styles.createSection}>
          <Text style={styles.createLabel}>Setting up a new school?</Text>
          <PrimaryButton
            title="Create Admin Account"
            onPress={() => router.push("/(auth)/register")}
          />
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollCenter: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: erp.space.lg,
    paddingVertical: erp.space.xxl,
  },
  container: {
    gap: erp.space.xxl,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: erp.space.xl,
  },
  brand: {
    color: erp.colors.accent,
    fontWeight: "800",
    fontSize: 32,
    letterSpacing: 1,
    marginBottom: erp.space.sm,
  },
  tagline: {
    color: erp.colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
  cardsSection: {
    gap: erp.space.md,
  },
  card: {
    backgroundColor: erp.colors.surface,
    borderRadius: erp.radii.lg,
    borderWidth: 2,
    borderColor: erp.colors.border,
    padding: erp.space.lg,
    alignItems: "center",
    gap: erp.space.sm,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: erp.space.sm,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: erp.colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: erp.colors.textSecondary,
    textAlign: "center",
  },
  createSection: {
    alignItems: "center",
    gap: erp.space.md,
    marginTop: erp.space.lg,
    paddingTop: erp.space.lg,
    borderTopWidth: 1,
    borderTopColor: erp.colors.border,
  },
  createLabel: {
    color: erp.colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
});
