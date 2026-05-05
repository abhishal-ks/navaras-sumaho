import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/src/features/auth/auth-store";
import * as SchoolsApi from "@/src/api/schools";
import { ErrorBox, Info, PrimaryButton } from "@/src/ui/basic";
import { ControlledField } from "@/src/ui/rhf";
import { ScrollView } from "react-native";
import { AppScreen } from "@/src/ui/app-screen";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { erp } from "@/src/theme/erp";

export default function AddTeacher() {
  const { me } = useAuth();

  const schoolId = (me && "schoolId" in me ? me.schoolId : null) as string | null;

  const teacherForm = useForm<{ name: string; email: string; password: string }>({
    defaultValues: { name: "", email: "", password: "" },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedTeacher, setAddedTeacher] = useState<any | null>(null);

  const addTeacher = async () => {
    if (!schoolId) {
      setError("No schoolId yet. Create a school first.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const values = teacherForm.getValues();
      const res = await SchoolsApi.addTeacher(schoolId, {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      setAddedTeacher(res);
      teacherForm.reset();
    } catch (e: any) {
      setError(e?.message ?? "Failed to add teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen title="Add Teacher">
      <ScrollView contentContainerStyle={styles.container}>
        {error ? <ErrorBox message={error} /> : null}

        <Info>
          Current schoolId: {schoolId ?? "(none)"}{"\n"}
          Last added teacher userId: {addedTeacher?.userId ?? "(none)"}
        </Info>

        <Info>{"Add teacher (creates a user + TEACHER membership)"}</Info>
        <ControlledField control={teacherForm.control} name="name" label="Teacher name" placeholder="Jane Doe" />
        <ControlledField control={teacherForm.control} name="email" label="Teacher email" placeholder="jane@school.com" />
        <ControlledField
          control={teacherForm.control}
          name="password"
          label="Teacher password"
          placeholder="min 6 chars"
          secureTextEntry
        />
        <PrimaryButton title="Add teacher" onPress={addTeacher} loading={loading} />

        <PrimaryButton
          title="Create School"
          onPress={() => router.push("/(admin)/schools")}
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