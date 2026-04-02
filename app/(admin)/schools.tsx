import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/src/features/auth/auth-store";
import * as SchoolsApi from "@/src/api/schools";
import { ErrorBox, Info, PrimaryButton, Screen } from "@/src/ui/basic";
import { ControlledField } from "@/src/ui/rhf";

export default function AdminSchools() {
  const { me, refreshMe } = useAuth();

  const schoolId = (me && "schoolId" in me ? me.schoolId : null) as string | null;

  const schoolForm = useForm<{ name: string; board: string; address: string }>({
    defaultValues: { name: "", board: "", address: "" },
  });
  const teacherForm = useForm<{ name: string; email: string; password: string }>({
    defaultValues: { name: "", email: "", password: "" },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdSchool, setCreatedSchool] = useState<SchoolsApi.School | null>(null);
  const [addedTeacher, setAddedTeacher] = useState<any | null>(null);

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
    <Screen title="School setup">
      {error ? <ErrorBox message={error} /> : null}

      <Info>
        Current schoolId: {schoolId ?? "(none)"}{"\n"}
        Last created schoolId: {createdSchool?._id ?? "(none)"}{"\n"}
        Last added teacher userId: {addedTeacher?.userId ?? "(none)"}
      </Info>

      <ControlledField control={schoolForm.control} name="name" label="School name" placeholder="Navaras Public School" />
      <ControlledField control={schoolForm.control} name="board" label="Board" placeholder="CBSE" />
      <ControlledField control={schoolForm.control} name="address" label="Address" placeholder="Street, City" />
      <PrimaryButton title="Create school" onPress={createSchool} loading={loading} />

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
    </Screen>
  );
}

