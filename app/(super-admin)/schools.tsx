import { useState } from "react";
import { useForm } from "react-hook-form";
import * as SchoolsApi from "@/src/api/schools";
import * as AuthApi from "@/src/api/auth";
import { ErrorBox, Info, PrimaryButton } from "@/src/ui/basic";
import { ControlledField } from "@/src/ui/rhf";
import { ScrollView } from "react-native";
import { AppScreen } from "@/src/ui/app-screen";

type SchoolForm = {
  name: string;
  board: string;
  address: string;
};

type AdminForm = {
  name: string;
  email: string;
  password: string;
};

export default function SuperAdminSchools() {
  const schoolForm = useForm<SchoolForm>({
    defaultValues: { name: "", board: "", address: "" },
  });
  const adminForm = useForm<AdminForm>({
    defaultValues: { name: "", email: "", password: "" },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdSchool, setCreatedSchool] = useState<SchoolsApi.School | null>(null);
  const [assignedAdmin, setAssignedAdmin] = useState<any | null>(null);

  const createSchool = async () => {
    setError(null);
    setLoading(true);
    try {
      const values = schoolForm.getValues();
      const s = await SchoolsApi.createSchool(values);
      setCreatedSchool(s);
      schoolForm.reset();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create school");
    } finally {
      setLoading(false);
    }
  };

  const assignAdmin = async () => {
    if (!createdSchool) {
      setError("Please create a school first");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const values = adminForm.getValues();
      // First create the admin user
      const createdUser = await AuthApi.createAdminUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      // Then assign them as school admin
      const res = await SchoolsApi.assignSchoolAdmin(createdSchool._id, createdUser.user.id);
      setAssignedAdmin(res);
      adminForm.reset();
    } catch (e: any) {
      setError(e?.message ?? "Failed to assign admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen title="School Management">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {error ? <ErrorBox message={error} /> : null}

        <Info>
          Super Admin: Create schools and assign administrators
        </Info>

        <ControlledField control={schoolForm.control} name="name" label="School name" placeholder="Navaras Public School" />
        <ControlledField control={schoolForm.control} name="board" label="Board" placeholder="CBSE" />
        <ControlledField control={schoolForm.control} name="address" label="Address" placeholder="Street, City" />
        <PrimaryButton title="Create School" onPress={createSchool} loading={loading} />

        {createdSchool && (
          <>
            <Info style={{ marginTop: 20 }}>
              School created: {createdSchool.name} (ID: {createdSchool._id})
            </Info>

            <Info>{"Assign School Admin"}</Info>
            <ControlledField control={adminForm.control} name="name" label="Admin name" placeholder="Jane Doe" />
            <ControlledField control={adminForm.control} name="email" label="Admin email" placeholder="admin@school.com" />
            <ControlledField
              control={adminForm.control}
              name="password"
              label="Admin password"
              placeholder="min 6 chars"
              secureTextEntry
            />
            <PrimaryButton title="Assign Admin" onPress={assignAdmin} loading={loading} />
          </>
        )}

        {assignedAdmin && (
          <Info style={{ marginTop: 20 }}>
            Admin assigned successfully (User ID: {assignedAdmin.userId})
          </Info>
        )}
      </ScrollView>
    </AppScreen>
  );
}