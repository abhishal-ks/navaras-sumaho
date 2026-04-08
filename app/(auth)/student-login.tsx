import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/src/features/auth/auth-store";
import { AppScreen } from "@/src/ui/app-screen";
import { ErrorBox, PrimaryButton } from "@/src/ui/basic";
import { erp } from "@/src/theme/erp";

export default function StudentLogin() {
    const [admissionNumber, setAdmissionNumber] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { loginStudent, status } = useAuth();

    const handleLogin = async () => {
        setError(null);
        try {
            await loginStudent({ admissionNumber, password });
        } catch (err) {
            setError((err as Error)?.message ?? "Login failed");
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
                <Text style={styles.title}>Student login</Text>
                <Text style={styles.subtitle}>Sign in with your admission number</Text>

                {error ? <ErrorBox message={error} /> : null}

                <Text style={styles.label}>Admission number</Text>
                <TextInput
                    value={admissionNumber}
                    onChangeText={setAdmissionNumber}
                    placeholder="123456"
                    placeholderTextColor={erp.colors.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
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

                <PrimaryButton
                    title={status === "loading" ? "Signing in…" : "Sign in"}
                    onPress={handleLogin}
                    disabled={status === "loading"}
                    loading={status === "loading"}
                />

                <Pressable onPress={() => router.replace("/(auth)/login")} style={styles.linkRow} accessibilityRole="button">
                    <Text style={styles.link}>Back to staff login</Text>
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
        color: erp.colors.textSecondary,
        fontWeight: "600",
        marginBottom: 6,
        fontSize: 13,
    },
    input: {
        backgroundColor: erp.colors.bgElevated,
        borderWidth: 1,
        borderColor: erp.colors.border,
        borderRadius: erp.radii.md,
        paddingHorizontal: erp.space.md,
        paddingVertical: 12,
        color: erp.colors.textPrimary,
        marginBottom: erp.space.md,
    },
    passwordRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: erp.space.md,
    },
    inputFlex: { flex: 1, marginBottom: 0, marginRight: erp.space.sm },
    eyeBtn: {
        padding: erp.space.sm,
        marginBottom: erp.space.md,
    },
    linkRow: {
        marginTop: erp.space.md,
        alignItems: "center",
    },
    link: {
        color: erp.colors.accent,
        fontSize: 13,
        fontWeight: "700",
    },
});
