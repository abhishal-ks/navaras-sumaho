import { useState } from "react";
import { Href, router } from "expo-router";
import * as AnnouncementsApi from "@/src/api/announcements";
import { ErrorBox, Field, Info, PrimaryButton } from "@/src/ui/basic";
import { AppScreen } from "@/src/ui/app-screen";
import { OptionSelector } from "@/src/ui/erp-widgets";

export default function AnnouncementsIndex() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audienceType, setAudienceType] = useState<"school" | "class">("school");
  const [classId, setClassId] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const create = async () => {
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      await AnnouncementsApi.create({
        title,
        message,
        audienceType,
        classId: audienceType === "class" ? classId : undefined,
      });
      setSuccess("Announcement created successfully!");
      setTitle("");
      setMessage("");
      setClassId("");
    } catch (e: any) {
      setError(e?.message ?? "Failed to create announcement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppScreen title="Create Announcement">
      {error ? <ErrorBox message={error} /> : null}
      {success ? <Info>{success}</Info> : null}

      <PrimaryButton
        title="View All Announcements"
        onPress={() => router.push("/(teacher)/announcements/list" as Href)}
      />

      <Info>Create announcement</Info>
      <Field label="Title" value={title} onChangeText={setTitle} placeholder="School assembly timing" />
      <Field label="Message" value={message} onChangeText={setMessage} placeholder="Message…" />
      <OptionSelector
        label="Audience"
        options={[
          { label: "School", value: "school" },
          { label: "Class", value: "class" },
        ]}
        value={audienceType}
        onSelect={setAudienceType}
      />
      {audienceType === "class" ? (
        <Field label="Class ID" value={classId} onChangeText={setClassId} placeholder="paste class _id" />
      ) : null}
      <PrimaryButton title="Create announcement" onPress={() => void create()} loading={submitting} />
    </AppScreen>
  );
}
