import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as AnnouncementsApi from "@/src/api/announcements";
import { ErrorBox, Field, Info, PrimaryButton } from "@/src/ui/basic";
import { AppScreen } from "@/src/ui/app-screen";
import { OptionSelector } from "@/src/ui/erp-widgets";

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
    <AppScreen title="Announcements">
      {error ? <ErrorBox message={error} /> : null}

      <Info>Create</Info>
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

      <Info>My announcements</Info>
      <PrimaryButton title="Refresh" onPress={() => void listQuery.refetch()} loading={listQuery.isFetching} />
      {listQuery.isLoading ? <Info loading>Loading announcements…</Info> : null}
      {listQuery.isError ? <ErrorBox message={(listQuery.error as any)?.message ?? "Failed to load"} /> : null}
      {listQuery.data ? (
        <Info>
          {listQuery.data.length
            ? listQuery.data.map((a) => `${a.title}\n${a.message}\n(${a.audienceType}) ${a.createdAt}\n---`).join("\n")
            : "No announcements"}
        </Info>
      ) : null}
    </AppScreen>
  );
}