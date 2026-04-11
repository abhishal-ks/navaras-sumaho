import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/src/features/auth/auth-store";
import { AppScreen } from "@/src/ui/app-screen";
import { ErrorBox, PrimaryButton } from "@/src/ui/basic";
import { erp } from "@/src/theme/erp";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register, status } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);

    // Validation
    if (!name || !email || !password) {
      setError("Please fill in all fields");
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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      await register({ name, email, password });
    } catch (err) {
      setError((err as Error)?.message ?? "Registration failed");
    }
  };

  return (
    <AppScreen
      scroll
      contentContainerStyle={styles.scrollCenter}
      keyboardVerticalOffset={64}
    >
      <View style={styles.card}>
        <Text style={styles.brand}>Navarasa</Text>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Set up your admin account to manage your school</Text>

        {error ? <ErrorBox message={error} /> : null}

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="John Doe"
          placeholderTextColor={erp.colors.textMuted}
          autoCapitalize="words"
          editable={status !== "loading"}
          style={styles.input}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@school.com"
          placeholderTextColor={erp.colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={status !== "loading"}
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={erp.colors.textMuted}
            secureTextEntry={!showPassword}
            editable={status !== "loading"}
            style={[styles.input, styles.inputFlex]}
          />
          <Pressable
            onPress={() => setShowPassword((s) => !s)}
            style={styles.eyeBtn}
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={erp.colors.textSecondary}
            />
          </Pressable>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="••••••••"
          placeholderTextColor={erp.colors.textMuted}
          secureTextEntry={!showPassword}
          editable={status !== "loading"}
          style={styles.input}
        />

        <PrimaryButton
          title={status === "loading" ? "Creating account…" : "Create account & sign in"}
          onPress={handleRegister}
          disabled={status === "loading"}
          loading={status === "loading"}
        />

        <Pressable
          onPress={() => router.replace("/(auth)/login")}
          style={styles.linkRow}
          accessibilityRole="button"
        >
          <Text style={styles.link}>Already have an account? Sign in</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollCenter: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: erp.space.xxl,
  },
  card: {
    backgroundColor: erp.colors.surface,
    borderRadius: erp.radii.xl,
    borderWidth: 1,
    borderColor: erp.colors.border,
    padding: erp.space.xl,
  },
  brand: {
    color: erp.colors.accent,
    fontWeight: "800",
    fontSize: 13,
    letterSpacing: 1,
    marginBottom: erp.space.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: erp.colors.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: erp.space.lg,
    color: erp.colors.textSecondary,
    fontSize: 14,
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
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputFlex: {
    flexGrow: 1,
  },
  eyeBtn: {
    marginLeft: -36,
    padding: erp.space.md,
  },
  linkRow: {
    marginTop: erp.space.lg,
    alignItems: "center",
  },
  link: {
    color: erp.colors.accent,
    fontSize: 14,
    fontWeight: "600",
  },
});
