import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as AnnouncementsApi from "@/src/api/announcements";
import { ErrorBox, Field, Info, PrimaryButton, Screen } from "@/src/ui/basic";

export default function TeacherAnnouncements() {
  const listQuery = useQuery({
    queryKey: ["announcements", "my"],
    queryFn: () => AnnouncementsApi.my(),
  });

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audienceType, setAudienceType] = useState<"school" | "class">("school");
  const [classId, setClassId] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await AnnouncementsApi.create({
        title,
        message,
        audienceType,
        classId: audienceType === "class" ? classId : undefined,
      });
      setTitle("");
      setMessage("");
      setClassId("");
      await listQuery.refetch();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create announcement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen title="Announcements">
      {error ? <ErrorBox message={error} /> : null}

      <Info>Create</Info>
      <Field label="Title" value={title} onChangeText={setTitle} placeholder="School assembly timing" />
      <Field label="Message" value={message} onChangeText={setMessage} placeholder="Message…" />
      <Field
        label="Audience type (school/class)"
        value={audienceType}
        onChangeText={(v) => setAudienceType(v === "class" ? "class" : "school")}
        placeholder="school"
      />
      {audienceType === "class" ? (
        <Field label="Class ID" value={classId} onChangeText={setClassId} placeholder="paste class _id" />
      ) : null}
      <PrimaryButton title="Create announcement" onPress={() => void create()} loading={submitting} />

      <Info>My announcements</Info>
      <PrimaryButton title="Refresh" onPress={() => void listQuery.refetch()} loading={listQuery.isFetching} />
      {listQuery.isLoading ? <Info>Loading…</Info> : null}
      {listQuery.isError ? <ErrorBox message={(listQuery.error as any)?.message ?? "Failed to load"} /> : null}
      {listQuery.data ? (
        <Info>
          {listQuery.data.length
            ? listQuery.data.map((a) => `${a.title}\n${a.message}\n(${a.audienceType}) ${a.createdAt}\n---`).join("\n")
            : "No announcements"}
        </Info>
      ) : null}
    </Screen>
  );
}