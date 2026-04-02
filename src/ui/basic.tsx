import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export function Screen({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{title}</Text>
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
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        placeholderTextColor="#94a3b8"
      />
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
        pressed && !disabled && !loading ? { opacity: 0.9 } : null,
      ]}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{title}</Text>}
    </Pressable>
  );
}

export function Info({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoText}>{children}</Text>
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
  screen: { flex: 1, padding: 16, backgroundColor: "#0b1220" },
  title: { fontSize: 22, fontWeight: "700", color: "#e2e8f0" },
  body: { marginTop: 16 },
  label: { color: "#cbd5e1", marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: "#0f1a30",
    borderColor: "#203256",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#e2e8f0",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "700" },
  info: {
    backgroundColor: "#0f1a30",
    borderColor: "#203256",
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
  },
  infoText: { color: "#cbd5e1" },
  error: {
    backgroundColor: "#2a0f15",
    borderColor: "#7f1d1d",
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
  },
  errorText: { color: "#fecaca", fontWeight: "600" },
});

