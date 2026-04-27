import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import * as SchoolsApi from "@/src/api/schools";
import { ErrorBox, SectionTitle, SuccessNotification, PrimaryButton } from "@/src/ui/basic";
import { ControlledField } from "@/src/ui/rhf";
import { ScrollView, View, Text, TextInput, TouchableOpacity } from "react-native";
import { AppScreen } from "@/src/ui/app-screen";
import { ErpCard } from "@/src/ui/erp-widgets";
import { erp } from "@/src/theme/erp";

type SchoolForm = {
  name: string;
  board: string;
  address: string;
};

export default function SuperAdminSchools() {
  const schoolForm = useForm<SchoolForm>({
    defaultValues: { name: "", board: "", address: "" },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createdSchool, setCreatedSchool] = useState<SchoolsApi.School | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const schoolsQuery = useQuery({
    queryKey: ["schools", page, search],
    queryFn: () => SchoolsApi.listSchools({ page, limit: 10, search }),
  });

  const createSchool = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const values = schoolForm.getValues();
      const s = await SchoolsApi.createSchool(values);
      setCreatedSchool(s);
      setSuccess("School created successfully!");
      schoolForm.reset();
      schoolsQuery.refetch();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create school");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    setPage(1);
  };

  return (
    <AppScreen title="School Management">
      <ScrollView contentContainerStyle={{ paddingHorizontal: erp.space.lg, paddingBottom: 100 }}>
        {error ? <ErrorBox message={error} /> : null}
        {success ? <SuccessNotification>{success}</SuccessNotification> : null}

        {/* SECTION: Create School */}
        <SectionTitle>Create New School</SectionTitle>
        <ErpCard>
          <ControlledField control={schoolForm.control} name="name" label="School name" placeholder="Navaras Public School" />
          <ControlledField control={schoolForm.control} name="board" label="Board" placeholder="CBSE" />
          <ControlledField control={schoolForm.control} name="address" label="Address" placeholder="Street, City" />
          <PrimaryButton title="Create School" onPress={createSchool} loading={loading} />
          {createdSchool && (
            <View style={{ backgroundColor: erp.colors.successBg, padding: erp.space.md, borderRadius: erp.radii.md, marginTop: erp.space.md }}>
              <Text style={{ color: erp.colors.success, fontWeight: "600", marginBottom: erp.space.xs }}>
                ✓ School created successfully
              </Text>
              <Text style={{ color: erp.colors.success, fontSize: 12 }}>
                {createdSchool.name} ({createdSchool._id})
              </Text>
            </View>
          )}
        </ErpCard>

        {/* SECTION: All Schools */}
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