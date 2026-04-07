import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { erp } from "@/src/theme/erp";

type StatCardProps = {
  title: string;
  value: string | number;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  style?: ViewStyle;
};

export function StatCard({ title, value, icon, iconColor, style }: StatCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardContent}>
        <View style={styles.leftContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardValue}>{value}</Text>
        </View>
        {icon && (
          <View style={styles.iconContainer}>
            <Ionicons
              name={icon}
              size={24}
              color={iconColor || erp.colors.accent}
            />
          </View>
        )}
      </View>
    </View>
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
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContent: {
    flex: 1,
  },
  cardTitle: {
    color: erp.colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: erp.space.xs,
  },
  cardValue: {
    color: erp.colors.textPrimary,
    fontSize: 24,
    fontWeight: "700",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: erp.radii.md,
    backgroundColor: erp.colors.accentMuted,
    alignItems: "center",
    justifyContent: "center",
  },
});