import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, View, Text, TextInput, TouchableOpacity } from "react-native";
import * as UsersApi from "@/src/api/users";
import { SectionTitle, ErrorBox } from "@/src/ui/basic";
import { ErpCard } from "@/src/ui/erp-widgets";
import { AppScreen } from "@/src/ui/app-screen";
import { Ionicons } from "@expo/vector-icons";
import { erp } from "@/src/theme/erp";

export default function AdminsAdministrators() {
  const [expandedAdminId, setExpandedAdminId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const adminsQuery = useQuery({
    queryKey: ["admins", page, search],
    queryFn: () => UsersApi.listUsersByRole("SCHOOL_ADMIN", { page, limit: 10, search }),
  });

  const handleSearch = (text: string) => {
    setSearch(text);
    setPage(1);
  };

  return (
    <AppScreen title="All Administrators">
      <ScrollView contentContainerStyle={{ paddingHorizontal: erp.space.lg, paddingBottom: 100 }}>
        <SectionTitle>All School Administrators ({adminsQuery.data?.total || 0})</SectionTitle>
        <TextInput
          placeholder="Search admins by name or email..."
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

        {adminsQuery.isError && (
          <ErrorBox message={(adminsQuery.error as any)?.message ?? "Failed to load administrators"} />
        )}

        {adminsQuery.data?.users.map((admin) => {
          const isExpanded = expandedAdminId === admin._id;
          return (
            <ErpCard key={admin._id} style={{ marginBottom: erp.space.md }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setExpandedAdminId(isExpanded ? null : admin._id)}
                style={{ paddingVertical: erp.space.sm }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: erp.space.sm }}>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: erp.colors.textPrimary }}>
                      {admin.name}
                    </Text>
                    <Text style={{ color: erp.colors.textSecondary, marginTop: erp.space.xs, fontSize: 13 }}>
                      📧 {admin.email}
                    </Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={erp.colors.textSecondary}
                  />
                </View>
              </TouchableOpacity>

              {isExpanded ? (
                <View style={{ borderTopWidth: 1, borderTopColor: erp.colors.border, paddingTop: erp.space.md }}>
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
              ) : (
                admin.school ? (
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
                )
              )}
            </ErpCard>
          );
        })}

        {adminsQuery.data && adminsQuery.data.totalPages > 1 && (
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
              {page} / {adminsQuery.data.totalPages}
            </Text>
            <TouchableOpacity
              onPress={() => setPage(Math.min(adminsQuery.data!.totalPages, page + 1))}
              disabled={page === adminsQuery.data.totalPages}
              style={{
                padding: erp.space.md,
                backgroundColor: page === adminsQuery.data.totalPages ? erp.colors.border : erp.colors.accent,
                borderRadius: erp.radii.md,
              }}
            >
              <Text style={{ color: page === adminsQuery.data.totalPages ? erp.colors.textMuted : erp.colors.bg, fontWeight: "600" }}>Next →</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </AppScreen>
  );
}
