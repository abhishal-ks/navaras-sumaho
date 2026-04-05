import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "@/src/features/auth/auth-store";
import { AppScreen } from "@/src/ui/app-screen";
import { PrimaryButton } from "@/src/ui/basic";
import { erp } from "@/src/theme/erp";

export default function Dashboard() {
  const { logout } = useAuth();

  return (
    <AppScreen title="Welcome back Ryty 👋">
      <View style={styles.card}>
        <Text style={styles.cardTitle}>System Status</Text>
        <Text style={styles.cardValue}>All systems running</Text>
      </View>

      <View style={styles.cardRow}>
        <View style={styles.smallCard}>
          <Text style={styles.cardTitle}>Tasks</Text>
          <Text style={styles.cardValue}>12</Text>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.cardTitle}>Messages</Text>
          <Text style={styles.cardValue}>5</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Focus Time</Text>
        <Text style={styles.cardValue}>2h 30m</Text>
      </View>

      <PrimaryButton title="Logout" onPress={logout} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: erp.colors.surface,
    padding: 18,
    borderRadius: erp.radii.lg,
    marginBottom: erp.space.md,
    borderWidth: 1,
    borderColor: erp.colors.border,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: erp.space.md,
  },

  smallCard: {
    backgroundColor: erp.colors.surface,
    padding: 18,
    borderRadius: erp.radii.lg,
    width: "48%",
    marginBottom: erp.space.md,
    borderWidth: 1,
    borderColor: erp.colors.border,
  },

  cardTitle: {
    color: erp.colors.textMuted,
    fontSize: 14,
    marginBottom: erp.space.sm,
    fontWeight: "500",
  },

  cardValue: {
    color: erp.colors.accent,
    fontSize: 20,
    fontWeight: "600",
  },
});