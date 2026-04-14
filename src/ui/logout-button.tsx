import React, { useState } from "react";
import { useAuth } from "@/src/features/auth/auth-store";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { erp } from "@/src/theme/erp";

export function LogoutButton() {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      Alert.alert("Logout Failed", "Unable to logout. Please try again.");
    }
  };

  return (
    <Pressable
      onPress={handleLogout}
      disabled={isLoading}
      style={({ pressed }) => [
        styles.button,
        isLoading && styles.buttonDisabled,
        pressed && !isLoading ? { opacity: 0.92 } : null,
      ]}
    >
      <View style={styles.content}>
        <Ionicons name="log-out-outline" size={18} color={erp.colors.textPrimary} />
        <Text style={styles.buttonText}>{isLoading ? "Signing Out…" : "Sign Out"}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: erp.colors.accent,
    borderRadius: erp.radii.md,
    paddingHorizontal: erp.space.md,
    paddingVertical: erp.space.md,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: erp.space.sm,
  },
  buttonText: {
    color: erp.colors.bg,
    fontSize: 14,
    fontWeight: "600",
  },
});
