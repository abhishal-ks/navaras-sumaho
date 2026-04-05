import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { erp } from "@/src/theme/erp";

export function ErpCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function KpiCard({
  label,
  value,
  hint,
  hintTone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  hintTone?: "default" | "success" | "warning" | "danger";
}) {
  const hintColor =
    hintTone === "success"
      ? erp.colors.success
      : hintTone === "warning"
        ? erp.colors.warning
        : hintTone === "danger"
          ? erp.colors.danger
          : erp.colors.textSecondary;
  return (
    <ErpCard style={styles.kpi}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
      {hint ? <Text style={[styles.kpiHint, { color: hintColor }]}>{hint}</Text> : null}
    </ErpCard>
  );
}

export function SectionHeader({
  title,
  actionLabel,
  onActionPress,
}: {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress} hitSlop={8}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function OptionSelector<T extends string>({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: Array<{ label: string; value: T }>;
  value: T;
  onSelect: (value: T) => void;
}) {
  return (
    <View style={styles.optionGroup}>
      <Text style={styles.optionLabel}>{label}</Text>
      <View style={styles.optionRow}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={[
                styles.optionItem,
                selected ? styles.optionItemSelected : styles.optionItemUnselected,
              ]}
            >
              <Text style={[styles.optionText, selected ? styles.optionTextSelected : null]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function Badge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "accent";
}) {
  const bg =
    tone === "success"
      ? erp.colors.successBg
      : tone === "warning"
        ? erp.colors.warningBg
        : tone === "danger"
          ? erp.colors.dangerBg
          : tone === "accent"
            ? erp.colors.accentMuted
            : erp.colors.surface2;
  const color =
    tone === "success"
      ? erp.colors.success
      : tone === "warning"
        ? erp.colors.warning
        : tone === "danger"
          ? erp.colors.danger
          : tone === "accent"
            ? erp.colors.accent
            : erp.colors.textSecondary;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

export function AvatarInitials({
  name,
  size = 44,
  backgroundColor = erp.colors.accentMuted,
}: {
  name: string;
  size?: number;
  backgroundColor?: string;
}) {
  const parts = name.trim().split(/\s+/);
  const initials =
    parts.length >= 2
      ? `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
      : (parts[0]?.slice(0, 2).toUpperCase() ?? "?");
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.32 }]}>{initials}</Text>
    </View>
  );
}

export function ListRow({
  left,
  title,
  subtitle,
  right,
  onPress,
}: {
  left?: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}) {
  const Inner = (
    <View style={styles.listRow}>
      {left}
      <View style={styles.listRowText}>
        <Text style={styles.listTitle}>{title}</Text>
        {subtitle ? <Text style={styles.listSubtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.92 }}>
        {Inner}
      </Pressable>
    );
  }
  return Inner;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: erp.colors.surface2,
    borderRadius: erp.radii.lg,
    borderWidth: 1,
    borderColor: erp.colors.border,
    padding: erp.space.lg,
  },
  kpi: { minHeight: 100, justifyContent: "center" },
  kpiLabel: { color: erp.colors.textSecondary, fontSize: 13, marginBottom: 4 },
  kpiValue: {
    color: erp.colors.textPrimary,
    fontSize: 28,
    fontWeight: "700",
  },
  kpiHint: { marginTop: 6, fontSize: 12 },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: erp.space.xl,
    marginBottom: erp.space.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: erp.colors.textPrimary,
  },
  sectionAction: {
    color: erp.colors.accent,
    fontWeight: "600",
    fontSize: 14,
  },
  optionGroup: { marginBottom: erp.space.md },
  optionLabel: { color: erp.colors.textSecondary, marginBottom: erp.space.xs, fontWeight: "600" },
  optionRow: {
    flexDirection: "row",
    backgroundColor: erp.colors.surface,
    borderWidth: 1,
    borderColor: erp.colors.border,
    borderRadius: erp.radii.full,
    overflow: "hidden",
  },
  optionItem: {
    flex: 1,
    paddingVertical: erp.space.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  optionItemSelected: {
    backgroundColor: erp.colors.accent,
  },
  optionItemUnselected: {
    backgroundColor: erp.colors.surface2,
  },
  optionText: {
    color: erp.colors.textPrimary,
    fontWeight: "600",
  },
  optionTextSelected: {
    color: erp.colors.bg,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: erp.radii.full,
  },
  badgeText: { fontSize: 12, fontWeight: "600" },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: erp.colors.border,
  },
  avatarText: { color: erp.colors.accent, fontWeight: "700" },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: erp.colors.surface,
    borderRadius: erp.radii.lg,
    borderWidth: 1,
    borderColor: erp.colors.border,
    padding: erp.space.md,
    marginBottom: erp.space.sm,
    gap: erp.space.md,
  },
  listRowText: { flex: 1 },
  listTitle: {
    color: erp.colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  listSubtitle: {
    color: erp.colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
});
