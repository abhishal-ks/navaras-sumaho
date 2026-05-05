import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, View, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import * as UsersApi from "@/src/api/users";
import * as SchoolsApi from "@/src/api/schools";
import { ErrorBox, PrimaryButton } from "@/src/ui/basic";
import { ErpCard } from "@/src/ui/erp-widgets";
import { AppScreen } from "@/src/ui/app-screen";
import { Ionicons } from "@expo/vector-icons";
import { erp } from "@/src/theme/erp";

export default function AdminsSchools() {
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [expandedSchoolId, setExpandedSchoolId] = useState<string | null>(null);

  const schoolsQuery = useQuery({
    queryKey: ["schools", page, search],
    queryFn: () => SchoolsApi.listSchools({ page, limit: 10, search }),
  });

  const adminsQuery = useQuery({
    queryKey: ["admins"],
    queryFn: () => UsersApi.listUsersByRole("SCHOOL_ADMIN", { page: 1, limit: 100 }),
  });

  // Removed assignAdminToSchool as it is no longer needed
  // Assignment logic is now in administrators.tsx

  // Removed confirmAssignAdmin and adminOptions as they are no longer needed
  // Assignment logic is now in administrators.tsx

  const handleSearch = (text: string) => {
    setSearch(text);
    setPage(1);
  };

  return (
    <AppScreen title="All Schools">
      <ScrollView contentContainerStyle={{ paddingHorizontal: erp.space.lg, paddingBottom: 100 }}>
        {error ? <ErrorBox message={error} /> : null}

        <View style={{ marginBottom: erp.space.md }}>
          <PrimaryButton
            title="← Back"
            onPress={() => router.back()}
          />
        </View>

        <View style={{ marginBottom: erp.space.lg }}>
          <PrimaryButton
            title="Assign Admin to Schools"
            onPress={() => router.push("/(super-admin)/admins/administrators")}
          />
        </View>

        <View style={{ marginBottom: erp.space.md }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: erp.colors.textPrimary }}>
            All Schools ({schoolsQuery.data?.total || 0})
          </Text>
        </View>
        <TextInput
          placeholder="Search schools by name or address..."
          value={search}
          onChangeText={handleSearch}
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

        <View style={{ marginBottom: erp.space.md }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: erp.colors.textPrimary }}>
            School Administrators ({adminsQuery.data?.total || 0})
          </Text>
        </View>
        {adminsQuery.isError && (
          <ErrorBox message={(adminsQuery.error as any)?.message ?? "Failed to load administrators"} />
        )}
        {adminsQuery.data?.users.map((admin) => (
          <ErpCard key={admin._id} style={{ marginBottom: erp.space.md }}>
            <View style={{ paddingVertical: erp.space.sm }}>
              <View style={{ marginBottom: erp.space.sm }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: erp.colors.textPrimary }}>
                  {admin.name}
                </Text>
                <Text style={{ color: erp.colors.textSecondary, marginTop: erp.space.xs, fontSize: 13 }}>
                  📧 {admin.email}
                </Text>
              </View>
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
            </View>
          </ErpCard>
        ))}

        {schoolsQuery.data?.schools.map((school: any) => {
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

              {/* Assignment moved to administrators.tsx */}
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
