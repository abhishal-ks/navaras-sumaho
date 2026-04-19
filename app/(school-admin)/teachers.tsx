import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/src/features/auth/auth-store";
import * as SchoolsApi from "@/src/api/schools";
import { ErrorBox, Info, PrimaryButton } from "@/src/ui/basic";
import { ControlledField } from "@/src/ui/rhf";
import { ScrollView } from "react-native";
import { AppScreen } from "@/src/ui/app-screen";

type TeacherForm = {
  name: string;
  email: string;
  password: string;
};

export default function SchoolAdminTeachers() {
  const { me } = useAuth();
  const schoolId = (me && "schoolId" in me ? me.schoolId : null) as string | null;

  const teacherForm = useForm<TeacherForm>({
    defaultValues: { name: "", email: "", password: "" },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedTeacher, setAddedTeacher] = useState<any | null>(null);

  const addTeacher = async () => {
    if (!schoolId) {
      setError("No school assigned to this admin");
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
    <AppScreen title="Teacher Management">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {error ? <ErrorBox message={error} /> : null}

        <Info>
          School ID: {schoolId ?? "(none)"}
        </Info>

        <Info>{"Add teacher to your school"}</Info>
        <ControlledField control={teacherForm.control} name="name" label="Teacher name" placeholder="Jane Doe" />
        <ControlledField control={teacherForm.control} name="email" label="Teacher email" placeholder="jane@school.com" />
        <ControlledField
          control={teacherForm.control}
          name="password"
          label="Teacher password"
          placeholder="min 6 chars"
          secureTextEntry
        />
        <PrimaryButton title="Add Teacher" onPress={addTeacher} loading={loading} disabled={!schoolId} />

        {addedTeacher && (
          <Info style={{ marginTop: 20 }}>
            Teacher added successfully (User ID: {addedTeacher.userId})
          </Info>
        )}
      </ScrollView>
    </AppScreen>
  );
}