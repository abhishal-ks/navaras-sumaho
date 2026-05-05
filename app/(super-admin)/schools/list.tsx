import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, View, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import * as SchoolsApi from "@/src/api/schools";
import { SectionTitle, PrimaryButton, ErrorBox } from "@/src/ui/basic";
import { ErpCard } from "@/src/ui/erp-widgets";
import { AppScreen } from "@/src/ui/app-screen";
import { erp } from "@/src/theme/erp";

export default function SchoolsList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const schoolsQuery = useQuery({
    queryKey: ["schools", page, search],
    queryFn: () => SchoolsApi.listSchools({ page, limit: 10, search }),
  });

  const handleSearch = (text: string) => {
    setSearch(text);
    setPage(1);
  };

  return (
    <AppScreen title="All Schools">
      <ScrollView contentContainerStyle={{ paddingHorizontal: erp.space.lg, paddingBottom: 100 }}>
        <View style={{ marginBottom: erp.space.md }}>
          <PrimaryButton
            title="← Back"
            onPress={() => router.back()}
          />
        </View>

        <SectionTitle>All Schools ({schoolsQuery.data?.total || 0})</SectionTitle>
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

        {schoolsQuery.isError && (
          <ErrorBox message={(schoolsQuery.error as any)?.message ?? "Failed to load schools"} />
        )}

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
