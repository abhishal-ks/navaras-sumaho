import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/features/auth/auth-store";
import { AppScreen } from "@/src/ui/app-screen";
import { ErrorBox, PrimaryButton, Info } from "@/src/ui/basic";
import { erp } from "@/src/theme/erp";

export default function InviteParent() {
  const [email, setEmail] = useState("");
  const [parentName, setParentName] = useState("");
  const [studentInfo, setStudentInfo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { me } = useAuth();

  const handleInvite = async () => {
    setError(null);
    setSuccess(null);

    // Validation
    if (!email || !parentName || !studentInfo) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      // TODO: Call backend API to create parent account
      // For now, show success message
      setSuccess(`Invitation sent to ${email}. Parent can activate account using parent activation link.`);
      setEmail("");
      setParentName("");
      setStudentInfo("");
    } catch (err) {
      setError((err as Error)?.message ?? "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen title="Invite Parent">
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

          <Text style={styles.label}>Child/Student Information</Text>
          <TextInput
            value={studentInfo}
            onChangeText={setStudentInfo}
            placeholder="e.g., John Doe - Class 10A"
            placeholderTextColor={erp.colors.textMuted}
            editable={!loading}
            style={styles.input}
          />

          <Text style={styles.hint}>
            The parent will receive an email with a link to activate their account and set their password.
          </Text>
        </View>

        <PrimaryButton
          title={loading ? "Sending Invitation…" : "Send Invitation"}
          onPress={handleInvite}
          disabled={loading}
          loading={loading}
        />

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>📋 How This Works:</Text>
          <Text style={styles.infoItem}>1. You create a parent account with their email</Text>
          <Text style={styles.infoItem}>2. Parent receives activation link via email</Text>
          <Text style={styles.infoItem}>3. Parent sets their password and activates account</Text>
          <Text style={styles.infoItem}>4. Parent can now access their child's information</Text>
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
