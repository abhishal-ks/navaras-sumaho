import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { erp } from "@/src/theme/erp";

/** @deprecated Prefer AppScreen from app-screen.tsx for new screens */
export function Screen({ title, children }: { title: string; children: React.ReactNode }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + erp.space.lg }]}> 
      <StatusBar style="light" />
      <Text style={styles.screenTitle}>{title}</Text>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  rightElement,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  rightElement?: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: erp.space.md }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          style={[styles.input, rightElement ? styles.inputWithRight : null]}
          placeholderTextColor={erp.colors.textMuted}
        />
        {rightElement}
      </View>
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        (disabled || loading) && styles.buttonDisabled,
        pressed && !disabled && !loading ? { opacity: 0.92 } : null,
      ]}
    >
      {loading ? <ActivityIndicator color={erp.colors.bg} /> : <Text style={styles.buttonText}>{title}</Text>}
    </Pressable>
  );
}

export function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function SuccessNotification({ children }: { children: string }) {
  return (
    <View style={styles.successBox}>
      <Text style={styles.successText}>{children}</Text>
    </View>
  );
}

export function Info({ children, loading }: { children: React.ReactNode; loading?: boolean }) {
  return (
    <View style={styles.infoBox}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={erp.colors.accent} size="large" />
          {typeof children === "string" && <Text style={styles.infoText}>{children}</Text>}
        </View>
      ) : (
        <Text style={styles.infoText}>{children}</Text>
      )}
    </View>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <View style={styles.error}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: erp.space.lg, backgroundColor: erp.colors.bg },
  screenTitle: { fontSize: 22, fontWeight: "700", color: erp.colors.textPrimary },
  body: { marginTop: erp.space.md },
  label: { color: erp.colors.textSecondary, marginBottom: 6, fontWeight: "600" },
  inputRow: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    backgroundColor: erp.colors.surface,
    borderColor: erp.colors.border,
    borderWidth: 1,
    borderRadius: erp.radii.md,
    paddingHorizontal: erp.space.md,
    paddingVertical: 12,
    color: erp.colors.textPrimary,
  },
  inputWithRight: { paddingRight: 4 },
  button: {
    backgroundColor: erp.colors.accent,
    paddingVertical: 14,
    paddingHorizontal: erp.space.md,
    borderRadius: erp.radii.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: erp.space.md,
  },
  buttonDisabled: { opacity: 0.55 },
  buttonText: { color: erp.colors.bg, fontWeight: "700", fontSize: 16 },
  infoBox: {
    backgroundColor: erp.colors.surface2,
    borderColor: erp.colors.border,
    borderWidth: 1,
    padding: erp.space.md,
    borderRadius: erp.radii.md,
    marginBottom: erp.space.md,
  },
  infoText: { color: erp.colors.textPrimary, textAlign: "center", fontWeight: "500" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: erp.colors.textPrimary,
    marginTop: erp.space.lg,
    marginBottom: erp.space.md,
    paddingHorizontal: erp.space.xs,
  },
  successBox: {
    backgroundColor: erp.colors.successBg,
    borderColor: erp.colors.success,
    borderWidth: 1,
    padding: erp.space.md,
    borderRadius: erp.radii.md,
    marginBottom: erp.space.md,
  },
  successText: { color: erp.colors.success, fontWeight: "600", textAlign: "center" },
  loadingContainer: { justifyContent: "center", alignItems: "center", paddingVertical: erp.space.lg },
  error: {
    backgroundColor: erp.colors.dangerBg,
    borderColor: erp.colors.danger,
    borderWidth: 1,
    padding: erp.space.md,
    borderRadius: erp.radii.md,
    marginBottom: erp.space.md,
  },
  errorText: { color: erp.colors.danger, fontWeight: "600" },
});
