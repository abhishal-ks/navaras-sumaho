import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, ScrollView, View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import * as UsersApi from "@/src/api/users";
import * as SchoolsApi from "@/src/api/schools";
import { ErrorBox, SectionTitle, SuccessNotification, PrimaryButton } from "@/src/ui/basic";
import { OptionSelector, ErpCard } from "@/src/ui/erp-widgets";
import { AppScreen } from "@/src/ui/app-screen";
import { Ionicons } from "@expo/vector-icons";
import { erp } from "@/src/theme/erp";

export default function AdminsAdministrators() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedSchoolId, setExpandedSchoolId] = useState<string | null>(null);
  const [selectedAdminForSchool, setSelectedAdminForSchool] = useState("");
  const [page, setPage] = useState(1);

  const schoolsQuery = useQuery({
    queryKey: ["schools", page],
    queryFn: () => SchoolsApi.listSchools({ page, limit: 10 }),
  });

  const adminsQuery = useQuery({
    queryKey: ["admins"],
    queryFn: () => UsersApi.listUsersByRole("SCHOOL_ADMIN", { page: 1, limit: 100 }),
  });

  const assignAdminToSchool = async (schoolId: string, adminId: string) => {
    if (!schoolId || !adminId) {
      setError("Please select an administrator first");
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const response = await SchoolsApi.assignSchoolAdmin(schoolId, adminId);
      
      let successMessage = "Admin assigned to school successfully!";
      if (response.isUpdate && response.previousSchool) {
        successMessage = "Admin reassigned to a new school successfully.";
      } else if (!response.isUpdate && response.message?.includes("already assigned")) {
        successMessage = "Admin is already assigned to this school.";
      }
      
      setSuccess(successMessage);
      setSelectedAdminForSchool("");
      setExpandedSchoolId(null);
      schoolsQuery.refetch();
      adminsQuery.refetch();
    } catch (e: any) {
      const errorMsg = e?.message ?? "Failed to assign admin to school";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const confirmAssignAdmin = (school: any) => {
    if (!selectedAdminForSchool) {
      setError("Please select an administrator first");
      return;
    }

    Alert.alert(
      "Confirm assignment",
      `Assign selected admin to ${school.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => assignAdminToSchool(school._id, selectedAdminForSchool),
        },
      ],
    );
  };

  const adminOptions = adminsQuery.data?.users.map((admin) => ({
    label: `${admin.name} (${admin.email})`,
    value: admin._id,
  })) || [];

  return (
    <AppScreen title="Assign Admin">
      <ScrollView contentContainerStyle={{ paddingHorizontal: erp.space.lg, paddingBottom: 100 }}>
        {error ? <ErrorBox message={error} /> : null}
        {success ? <SuccessNotification>{success}</SuccessNotification> : null}

        <View style={{ marginBottom: erp.space.md }}>
          <PrimaryButton
            title="← Back"
            onPress={() => router.back()}
          />
        </View>

        <SectionTitle>Assign Administrators to Schools</SectionTitle>

        {schoolsQuery.data?.schools.map((school) => {
          const isExpanded = expandedSchoolId === school._id;
          return (
            <ErpCard key={school._id} style={{ marginBottom: erp.space.md }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setExpandedSchoolId(isExpanded ? null : school._id)}
                style={{ paddingVertical: erp.space.sm }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: erp.space.sm }}>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: erp.colors.textPrimary }}>
                      {school.name}
                    </Text>
                    <Text style={{ color: erp.colors.textSecondary, marginTop: erp.space.xs, fontSize: 13 }}>
                      {school.board}
                    </Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={erp.colors.textSecondary}
                  />
                </View>
              </TouchableOpacity>

              <Text style={{ color: erp.colors.textMuted, marginBottom: erp.space.md, fontSize: 12 }}>
                📍 {school.address}
              </Text>

              {school.admin ? (
                <View style={{ backgroundColor: erp.colors.successBg, padding: erp.space.sm, borderRadius: erp.radii.md, marginBottom: erp.space.md }}>
                  <Text style={{ color: erp.colors.success, fontWeight: "600", fontSize: 12 }}>
                    ✓ Admin: {school.admin.name}
                  </Text>
                  <Text style={{ color: erp.colors.success, fontSize: 11, marginTop: 2 }}>
                    {school.admin.email}
                  </Text>
                </View>
              ) : (
                <View style={{ backgroundColor: erp.colors.warningBg, padding: erp.space.sm, borderRadius: erp.radii.md, marginBottom: erp.space.md }}>
                  <Text style={{ color: erp.colors.warning, fontWeight: "600", fontSize: 12 }}>
                    ⚠ No admin assigned
                  </Text>
                </View>
              )}

              {isExpanded && (
                <View style={{ marginTop: erp.space.sm, borderTopWidth: 1, borderTopColor: erp.colors.border, paddingTop: erp.space.md }}>
                  <Text style={{ color: erp.colors.textSecondary, marginBottom: erp.space.md, fontSize: 13 }}>
                    Tap below to assign or change the admin for this school.
                  </Text>
                  <View style={{ marginBottom: erp.space.lg }}>
                    <OptionSelector
                      label="Choose school administrator"
                      value={selectedAdminForSchool}
                      onSelect={setSelectedAdminForSchool}
                      options={adminOptions}
                    />
                  </View>
                  <PrimaryButton
                    title={school.admin ? "Change Admin" : "Assign Admin"}
                    onPress={() => confirmAssignAdmin(school)}
                    loading={loading}
                    disabled={!selectedAdminForSchool}
                  />
                </View>
              )}
            </ErpCard>
          );
        })}

        {schoolsQuery.data && schoolsQuery.data.totalPages > 1 && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: erp.space.lg, gap: erp.space.md }}>
            <TouchableOpacity
              onPress={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              style={{
                padding: erp.space.md,
                backgroundColor: page === 1 ? erp.colors.border : erp.colors.accent,
                borderRadius: erp.radii.md,
              }}
            >
              <Text style={{ color: page === 1 ? erp.colors.textMuted : erp.colors.bg, fontWeight: "600" }}>← Prev</Text>
            </TouchableOpacity>
            <Text style={{ color: erp.colors.textSecondary, fontWeight: "600" }}>
              {page} / {schoolsQuery.data.totalPages}
            </Text>
            <TouchableOpacity
              onPress={() => setPage(Math.min(schoolsQuery.data!.totalPages, page + 1))}
              disabled={page === schoolsQuery.data.totalPages}
              style={{
                padding: erp.space.md,
                backgroundColor: page === schoolsQuery.data.totalPages ? erp.colors.border : erp.colors.accent,
                borderRadius: erp.radii.md,
              }}
            >
              <Text style={{ color: page === schoolsQuery.data.totalPages ? erp.colors.textMuted : erp.colors.bg, fontWeight: "600" }}>Next →</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </AppScreen>
  );
}
