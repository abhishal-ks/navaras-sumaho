import { useState } from "react";
import { useForm } from "react-hook-form";
import { Href, router } from "expo-router";
import * as AuthApi from "@/src/api/auth";
import * as UsersApi from "@/src/api/users";
import { ErrorBox, SectionTitle, SuccessNotification, PrimaryButton } from "@/src/ui/basic";
import { ControlledField } from "@/src/ui/rhf";
import { ErpCard } from "@/src/ui/erp-widgets";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { AppScreen } from "@/src/ui/app-screen";
import { Ionicons } from "@expo/vector-icons";
import { erp } from "@/src/theme/erp";

type AdminForm = {
  name: string;
  email: string;
  password: string;
};

export default function AdminsIndex() {
  const { refetch } = UsersApi.useAdminsQuery?.() || {};
  const adminForm = useForm<AdminForm>({
    defaultValues: { name: "", email: "", password: "" },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createdAdmin, setCreatedAdmin] = useState<any | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const createAdmin = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const values = adminForm.getValues();
      const admin = await AuthApi.createAdminUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      setCreatedAdmin(admin);
      setSuccess("Admin created successfully!");
      adminForm.reset();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen title="Admin Management">
      <ScrollView contentContainerStyle={{ paddingHorizontal: erp.space.lg, paddingBottom: 100 }}>
        {error ? <ErrorBox message={error} /> : null}
        {success ? <SuccessNotification>{success}</SuccessNotification> : null}

        {/* Navigation Tabs */}
        <View style={{ flexDirection: "row", marginBottom: erp.space.lg, gap: erp.space.md }}>
          <PrimaryButton
            title="Schools"
            onPress={() => router.push("/(super-admin)/admins/schools" as Href)}
            style={{ flex: 1 }}
          />
          <PrimaryButton
            title="Administrators"
            onPress={() => router.push("/(super-admin)/admins/administrators" as Href)}
            style={{ flex: 1 }}
          />
        </View>

        {/* SECTION: Create Admin */}
        <SectionTitle>Create School Administrator</SectionTitle>
        <ErpCard>
          <ControlledField control={adminForm.control} name="name" label="Admin name" placeholder="Jane Doe" />
          <ControlledField control={adminForm.control} name="email" label="Admin email" placeholder="admin@school.com" />
          <View style={{ position: 'relative', marginBottom: erp.space.md }}>
            <ControlledField
              control={adminForm.control}
              name="password"
              label="Admin password"
              placeholder="min 6 chars"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 10, top: 35 }}
            >
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={erp.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <PrimaryButton title="Create Admin" onPress={createAdmin} loading={loading} />
          {createdAdmin && (
            <View style={{ backgroundColor: erp.colors.successBg, padding: erp.space.md, borderRadius: erp.radii.md, marginTop: erp.space.md }}>
              <Text style={{ color: erp.colors.success, fontWeight: "600" }}>
                ✓ Admin created: {createdAdmin.user.name}
              </Text>
            </View>
          )}
        </ErpCard>
      </ScrollView>
    </AppScreen>
  );
}
