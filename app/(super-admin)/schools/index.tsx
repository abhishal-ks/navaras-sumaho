import { useState } from "react";
import { useForm } from "react-hook-form";
import { Href, router } from "expo-router";
import * as SchoolsApi from "@/src/api/schools";
import { ErrorBox, SectionTitle, SuccessNotification, PrimaryButton } from "@/src/ui/basic";
import { ControlledField } from "@/src/ui/rhf";
import { ErpCard } from "@/src/ui/erp-widgets";
import { ScrollView, View, Text } from "react-native";
import { AppScreen } from "@/src/ui/app-screen";
import { erp } from "@/src/theme/erp";

type SchoolForm = {
  name: string;
  board: string;
  address: string;
};

export default function SchoolsIndex() {
  const schoolForm = useForm<SchoolForm>({
    defaultValues: { name: "", board: "", address: "" },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createdSchool, setCreatedSchool] = useState<SchoolsApi.School | null>(null);

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
    } catch (e: any) {
      setError(e?.message ?? "Failed to create school");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen title="School Management">
      <ScrollView contentContainerStyle={{ paddingHorizontal: erp.space.lg, paddingBottom: 100 }}>
        {error ? <ErrorBox message={error} /> : null}
        {success ? <SuccessNotification>{success}</SuccessNotification> : null}

        {/* Navigation */}
        <View style={{ marginBottom: erp.space.lg }}>
          <PrimaryButton
            title="View All Schools"
            onPress={() => router.push("/(super-admin)/schools/list" as Href)}
          />
        </View>

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
      </ScrollView>
    </AppScreen>
  );
}
