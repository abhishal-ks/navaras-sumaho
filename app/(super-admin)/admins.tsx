import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import * as AuthApi from "@/src/api/auth";
import * as UsersApi from "@/src/api/users";
import * as SchoolsApi from "@/src/api/schools";
import { ErrorBox, SectionTitle, SuccessNotification, PrimaryButton } from "@/src/ui/basic";
import { ControlledField } from "@/src/ui/rhf";
import { OptionSelector, ErpCard } from "@/src/ui/erp-widgets";
import { ScrollView, View, Text, TextInput, TouchableOpacity } from "react-native";
import { AppScreen } from "@/src/ui/app-screen";
import { Ionicons } from "@expo/vector-icons";
import { erp } from "@/src/theme/erp";

type AdminForm = {
  name: string;
  email: string;
  password: string;
};

export default function SuperAdminAdmins() {
  const adminForm = useForm<AdminForm>({
    defaultValues: { name: "", email: "", password: "" },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createdAdmin, setCreatedAdmin] = useState<any | null>(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [schoolsPage, setSchoolsPage] = useState(1);
  const [schoolsSearch, setSchoolsSearch] = useState("");
  const [adminsPage, setAdminsPage] = useState(1);
  const [adminsSearch, setAdminsSearch] = useState("");

  const schoolsQuery = useQuery({
    queryKey: ["schools", schoolsPage, schoolsSearch],
    queryFn: () => SchoolsApi.listSchools({ page: schoolsPage, limit: 10, search: schoolsSearch }),
  });

  const adminsQuery = useQuery({
    queryKey: ["admins", adminsPage, adminsSearch],
    queryFn: () => UsersApi.listUsersByRole("SCHOOL_ADMIN", { page: adminsPage, limit: 10, search: adminsSearch }),
  });

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
      adminsQuery.refetch();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  const assignAdminToSchool = async () => {
    if (!selectedSchoolId || !selectedAdminId) {
      setError("Please select both a school and an admin");
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const response = await SchoolsApi.assignSchoolAdmin(selectedSchoolId, selectedAdminId);
      
      let successMessage = "Admin assigned to school successfully!";
      if (response.isUpdate && response.previousSchool) {
        successMessage = "Admin reassigned to new school! Previous assignment has been updated.";
      } else if (!response.isUpdate && response.message?.includes("already assigned")) {
        successMessage = "Admin is already assigned to this school.";
      }
      
      setSuccess(successMessage);
      setSelectedSchoolId("");
      setSelectedAdminId("");
      schoolsQuery.refetch();
      adminsQuery.refetch();
    } catch (e: any) {
      const errorMsg = e?.message ?? "Failed to assign admin to school";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const schoolOptions = schoolsQuery.data?.schools.map((school) => ({
    label: `${school.name} (${school.board})`,
    value: school._id,
  })) || [];

  const adminOptions = adminsQuery.data?.users.map((admin) => ({
    label: `${admin.name} (${admin.email})`,
    value: admin._id,
  })) || [];

  const handleSchoolsSearch = (text: string) => {
    setSchoolsSearch(text);
    setSchoolsPage(1);
  };

  const handleAdminsSearch = (text: string) => {
    setAdminsSearch(text);
    setAdminsPage(1);
  };

  return (
    <AppScreen title="Admin Management">
      <ScrollView contentContainerStyle={{ paddingHorizontal: erp.space.lg, paddingBottom: 100 }}>
        {error ? <ErrorBox message={error} /> : null}
        {success ? <SuccessNotification>{success}</SuccessNotification> : null}

        {/* SECTION 1: Create Admin */}
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

        {/* SECTION 2: Assign Admin to School */}
        <SectionTitle>Assign Admin to School</SectionTitle>
        <ErpCard>
          <Text style={{ color: erp.colors.textSecondary, marginBottom: erp.space.md, fontSize: 13 }}>
            Select a school and administrator to link them together.
          </Text>
          <View style={{ marginBottom: erp.space.lg }}>
            <OptionSelector
              label="Select School"
              value={selectedSchoolId}
              onSelect={setSelectedSchoolId}
              options={schoolOptions}
            />
          </View>

          <View style={{ marginBottom: erp.space.lg }}>
            <OptionSelector
              label="Select Admin"
              value={selectedAdminId}
              onSelect={setSelectedAdminId}
              options={adminOptions}
            />
          </View>

          <PrimaryButton
            title="Assign Admin to School"
            onPress={assignAdminToSchool}
            loading={loading}
            disabled={!selectedSchoolId || !selectedAdminId}
          />
        </ErpCard>

        {/* SECTION 3: All Schools */}
        <SectionTitle>All Schools ({schoolsQuery.data?.total || 0})</SectionTitle>
        <TextInput
          placeholder="Search schools by name or address..."
          value={schoolsSearch}
          onChangeText={handleSchoolsSearch}
          style={{
            borderWidth: 1,
            borderColor: erp.colors.border,
            backgroundColor: erp.colors.surface,
            color: erp.colors.textPrimary,
            padding: erp.space.md,
            marginVertical: erp.space.md,
            borderRadius: erp.radii.md,
            fontSize: 14,
          }}
          placeholderTextColor={erp.colors.textMuted}
        />

        {schoolsQuery.data?.schools.map((school) => (
          <ErpCard key={school._id} style={{ marginBottom: erp.space.md }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: erp.colors.textPrimary, marginBottom: erp.space.sm }}>
              {school.name}
            </Text>
            <Text style={{ color: erp.colors.textSecondary, marginBottom: erp.space.xs, fontSize: 13 }}>
              {school.board}
            </Text>
            <Text style={{ color: erp.colors.textMuted, marginBottom: erp.space.md, fontSize: 12 }}>
              📍 {school.address}
            </Text>
            {school.admin ? (
              <View style={{ backgroundColor: erp.colors.successBg, padding: erp.space.sm, borderRadius: erp.radii.md }}>
                <Text style={{ color: erp.colors.success, fontWeight: "600", fontSize: 12 }}>
                  ✓ Admin: {school.admin.name}
                </Text>
                <Text style={{ color: erp.colors.success, fontSize: 11, marginTop: 2 }}>
                  {school.admin.email}
                </Text>
              </View>
            ) : (
              <View style={{ backgroundColor: erp.colors.warningBg, padding: erp.space.sm, borderRadius: erp.radii.md }}>
                <Text style={{ color: erp.colors.warning, fontWeight: "600", fontSize: 12 }}>
                  ⚠ No admin assigned
                </Text>
              </View>
            )}
          </ErpCard>
        ))}

        {schoolsQuery.data && schoolsQuery.data.totalPages > 1 && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: erp.space.lg, gap: erp.space.md }}>
            <TouchableOpacity
              onPress={() => setSchoolsPage(Math.max(1, schoolsPage - 1))}
              disabled={schoolsPage === 1}
              style={{
                padding: erp.space.md,
                backgroundColor: schoolsPage === 1 ? erp.colors.border : erp.colors.accent,
                borderRadius: erp.radii.md,
              }}
            >
              <Text style={{ color: schoolsPage === 1 ? erp.colors.textMuted : erp.colors.bg, fontWeight: "600" }}>← Prev</Text>
            </TouchableOpacity>
            <Text style={{ color: erp.colors.textSecondary, fontWeight: "600" }}>
              {schoolsPage} / {schoolsQuery.data.totalPages}
            </Text>
            <TouchableOpacity
              onPress={() => setSchoolsPage(Math.min(schoolsQuery.data!.totalPages, schoolsPage + 1))}
              disabled={schoolsPage === schoolsQuery.data.totalPages}
              style={{
                padding: erp.space.md,
                backgroundColor: schoolsPage === schoolsQuery.data.totalPages ? erp.colors.border : erp.colors.accent,
                borderRadius: erp.radii.md,
              }}
            >
              <Text style={{ color: schoolsPage === schoolsQuery.data.totalPages ? erp.colors.textMuted : erp.colors.bg, fontWeight: "600" }}>Next →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SECTION 4: All Admins */}
        <SectionTitle>All School Administrators ({adminsQuery.data?.total || 0})</SectionTitle>
        <TextInput
          placeholder="Search admins by name or email..."
          value={adminsSearch}
          onChangeText={handleAdminsSearch}
          style={{
            borderWidth: 1,
            borderColor: erp.colors.border,
            backgroundColor: erp.colors.surface,
            color: erp.colors.textPrimary,
            padding: erp.space.md,
            marginVertical: erp.space.md,
            borderRadius: erp.radii.md,
            fontSize: 14,
          }}
          placeholderTextColor={erp.colors.textMuted}
        />

        {adminsQuery.data?.users.map((admin) => (
          <ErpCard key={admin._id} style={{ marginBottom: erp.space.md }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: erp.colors.textPrimary, marginBottom: erp.space.sm }}>
              {admin.name}
            </Text>
            <Text style={{ color: erp.colors.textSecondary, marginBottom: erp.space.md, fontSize: 13 }}>
              📧 {admin.email}
            </Text>
            {admin.school ? (
              <View style={{ backgroundColor: erp.colors.accentMuted, padding: erp.space.sm, borderRadius: erp.radii.md }}>
                <Text style={{ color: erp.colors.accent, fontWeight: "600", fontSize: 12 }}>
                  🏫 Assigned to: {admin.school.name}
                </Text>
              </View>
            ) : (
              <View style={{ backgroundColor: erp.colors.surface, borderWidth: 1, borderColor: erp.colors.border, padding: erp.space.sm, borderRadius: erp.radii.md }}>
                <Text style={{ color: erp.colors.textSecondary, fontWeight: "500", fontSize: 12 }}>
                  ○ Not assigned to any school
                </Text>
              </View>
            )}
          </ErpCard>
        ))}

        {adminsQuery.data && adminsQuery.data.totalPages > 1 && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: erp.space.lg, gap: erp.space.md }}>
            <TouchableOpacity
              onPress={() => setAdminsPage(Math.max(1, adminsPage - 1))}
              disabled={adminsPage === 1}
              style={{
                padding: erp.space.md,
                backgroundColor: adminsPage === 1 ? erp.colors.border : erp.colors.accent,
                borderRadius: erp.radii.md,
              }}
            >
              <Text style={{ color: adminsPage === 1 ? erp.colors.textMuted : erp.colors.bg, fontWeight: "600" }}>← Prev</Text>
            </TouchableOpacity>
            <Text style={{ color: erp.colors.textSecondary, fontWeight: "600" }}>
              {adminsPage} / {adminsQuery.data.totalPages}
            </Text>
            <TouchableOpacity
              onPress={() => setAdminsPage(Math.min(adminsQuery.data!.totalPages, adminsPage + 1))}
              disabled={adminsPage === adminsQuery.data.totalPages}
              style={{
                padding: erp.space.md,
                backgroundColor: adminsPage === adminsQuery.data.totalPages ? erp.colors.border : erp.colors.accent,
                borderRadius: erp.radii.md,
              }}
            >
              <Text style={{ color: adminsPage === adminsQuery.data.totalPages ? erp.colors.textMuted : erp.colors.bg, fontWeight: "600" }}>Next →</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </AppScreen>
  );
}