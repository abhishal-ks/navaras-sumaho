import { useState } from "react";
import { Href, router } from "expo-router";
import * as AcademicsApi from "@/src/api/academics";
import { ErrorBox, Field, Info, PrimaryButton } from "@/src/ui/basic";
import { AppScreen } from "@/src/ui/app-screen";

export default function AssignmentsIndex() {
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [last, setLast] = useState<any | null>(null);

  const submit = async () => {
    if (!subjectId) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await AcademicsApi.createAssignment(subjectId, { title, description: description || undefined });
      setLast(res);
      setSuccess("Assignment created successfully!");
      setTitle("");
      setDescription("");
    } catch (e: any) {
      setError(e?.message ?? "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen title="Assignments">
      {error ? <ErrorBox message={error} /> : null}
      {success ? <Info>{success}</Info> : null}

      <PrimaryButton
        title="View Assignments"
        onPress={() => router.push("/(teacher)/assignments/list" as Href)}
      />

      <Info>
        Requires that the logged-in teacher is assigned to the subject via admin setup.{"\n"}
        Last response: {last ? JSON.stringify(last) : "(none)"}
      </Info>
      <Field label="Subject ID" value={subjectId} onChangeText={setSubjectId} placeholder="paste subject _id" />
      <Field label="Title" value={title} onChangeText={setTitle} placeholder="Homework 1" />
      <Field label="Description (optional)" value={description} onChangeText={setDescription} placeholder="Details…" />
      <PrimaryButton title="Create assignment" onPress={() => void submit()} loading={loading} disabled={!subjectId} />
    </AppScreen>
  );
}
