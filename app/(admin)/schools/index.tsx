import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/src/features/auth/auth-store";
import * as SchoolsApi from "@/src/api/schools";
import { ErrorBox, Info, PrimaryButton } from "@/src/ui/basic";
import { ControlledField } from "@/src/ui/rhf";
import { ScrollView } from "react-native";
import { AppScreen } from "@/src/ui/app-screen";
import { Href, router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { erp } from "@/src/theme/erp";

export default function CreateSchool() {
  const { me, refreshMe } = useAuth();

  const schoolId = (me && "schoolId" in me ? me.schoolId : null) as string | null;

  const schoolForm = useForm<{ name: string; board: string; address: string }>({
    defaultValues: { name: "", board: "", address: "" },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdSchool, setCreatedSchool] = useState<SchoolsApi.School | null>(null);

  const createSchool = async () => {
    setError(null);
    setLoading(true);
    try {
      const values = schoolForm.getValues();
      const s = await SchoolsApi.createSchool(values);
      setCreatedSchool(s);
      await refreshMe();
      schoolForm.reset();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create school");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen title="Create School">
      <ScrollView contentContainerStyle={styles.container}>
        {error ? <ErrorBox message={error} /> : null}

        <Info>
          Current schoolId: {schoolId ?? "(none)"}{"\n"}
          Last created schoolId: {createdSchool?._id ?? "(none)"}
        </Info>

        <ControlledField control={schoolForm.control} name="name" label="School name" placeholder="Navaras Public School" />
        <ControlledField control={schoolForm.control} name="board" label="Board" placeholder="CBSE" />
        <ControlledField control={schoolForm.control} name="address" label="Address" placeholder="Street, City" />
        <PrimaryButton title="Create school" onPress={createSchool} loading={loading} />

        <PrimaryButton
          title="Add Teachers"
          onPress={() => router.push("teachers" as Href)}
        />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: erp.space.lg,
    gap: erp.space.md,
  },
});