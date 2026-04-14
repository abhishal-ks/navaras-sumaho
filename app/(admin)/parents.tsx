import { useState } from "react";
import { StyleSheet, Text, TextInput, View, ScrollView } from "react-native";
import { useAuth } from "@/src/features/auth/auth-store";
import { AppScreen } from "@/src/ui/app-screen";
import { ErrorBox, PrimaryButton, Info } from "@/src/ui/basic";
import { erp } from "@/src/theme/erp";
import * as SchoolsApi from "@/src/api/schools";

export default function InviteParent() {
  const [email, setEmail] = useState("");
  const [parentName, setParentName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { me } = useAuth();

  const handleCreate = async () => {
    setError(null);
    setSuccess(null);

    // Validation
    if (!email || !parentName || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const adminMe = me as { role: "SUPER_ADMIN" | "SCHOOL_ADMIN"; schoolId?: string };
    
    if (!adminMe?.schoolId) {
      setError("No active school found. Please select a school first.");
      return;
    }

    setLoading(true);
    try {
      await SchoolsApi.addParent(adminMe.schoolId!, {
        name: parentName,
        email,
        password,
      });
      setSuccess(`Parent account created successfully. The parent can now log in with their email and password.`);
      setEmail("");
      setParentName("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError((err as Error)?.message ?? "Failed to create parent account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen title="Create Parent Account">
      <ScrollView contentContainerStyle={styles.container}>
        {error ? <ErrorBox message={error} /> : null}
        {success ? <Info>{success}</Info> : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parent Details</Text>

          <Text style={styles.label}>Parent Name</Text>
          <TextInput
            value={parentName}
            onChangeText={setParentName}
            placeholder="e.g., John Doe"
            placeholderTextColor={erp.colors.textMuted}
            editable={!loading}
            style={styles.input}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="parent@example.com"
            placeholderTextColor={erp.colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={erp.colors.textMuted}
            secureTextEntry
            editable={!loading}
            style={styles.input}
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            placeholderTextColor={erp.colors.textMuted}
            secureTextEntry
            editable={!loading}
            style={styles.input}
          />

          <Text style={styles.hint}>
            The parent will be able to log in immediately with the provided email and password.
          </Text>
        </View>

        <PrimaryButton
          title={loading ? "Creating Account…" : "Create Parent Account"}
          onPress={handleCreate}
          disabled={loading}
          loading={loading}
        />

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>📋 How This Works:</Text>
          <Text style={styles.infoItem}>1. Create a parent account with name, email, and password</Text>
          <Text style={styles.infoItem}>2. Parent can immediately log in to access their child&apos;s information</Text>
          <Text style={styles.infoItem}>3. Link the parent to specific students using the student management section</Text>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: erp.space.lg,
    gap: erp.space.xl,
  },
  section: {
    gap: erp.space.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: erp.colors.textPrimary,
    marginBottom: erp.space.sm,
  },
  label: {
    marginTop: erp.space.md,
    marginBottom: erp.space.sm,
    color: erp.colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderRadius: erp.radii.md,
    borderWidth: 1,
    borderColor: erp.colors.border,
    paddingHorizontal: erp.space.md,
    paddingVertical: erp.space.md,
    color: erp.colors.textPrimary,
    fontSize: 14,
  },
  hint: {
    fontSize: 12,
    color: erp.colors.textSecondary,
    marginTop: erp.space.sm,
    fontStyle: "italic",
  },
  infoSection: {
    backgroundColor: erp.colors.bgElevated,
    borderRadius: erp.radii.md,
    padding: erp.space.md,
    gap: erp.space.sm,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: erp.colors.textPrimary,
    marginBottom: erp.space.sm,
  },
  infoItem: {
    fontSize: 13,
    color: erp.colors.textSecondary,
    lineHeight: 20,
  },
});
