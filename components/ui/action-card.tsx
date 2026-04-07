import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { erp } from "@/src/theme/erp";

type ActionCardProps = {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onPress: () => void;
  style?: ViewStyle;
};

export function ActionCard({ title, subtitle, icon, iconColor, onPress, style }: ActionCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons
        name={icon}
        size={28}
        color={iconColor || erp.colors.accent}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: erp.colors.surface,
    padding: erp.space.lg,
    borderRadius: erp.radii.lg,
    borderWidth: 1,
    borderColor: erp.colors.border,
    marginBottom: erp.space.md,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: erp.space.md,
  },
  title: {
    color: erp.colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  subtitle: {
    color: erp.colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
});