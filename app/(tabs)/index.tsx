import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Button } from "react-native";

export default function Dashboard() {

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/(auth)/login")
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Welcome back Ryty 👋</Text>

      <Button
        title="Logout" onPress={logout}
      />

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc", // light tech background
    padding: 20,
  },

  header: {
    fontSize: 26,
    color: "#0f172a",
    fontWeight: "600",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  smallCard: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 18,
    width: "48%",
    marginBottom: 16,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  cardTitle: {
    color: "#64748b", // soft muted gray
    fontSize: 14,
    marginBottom: 8,
  },

  cardValue: {
    color: "#f59e0b", // warm cozy amber
    fontSize: 20,
    fontWeight: "600",
  },
});