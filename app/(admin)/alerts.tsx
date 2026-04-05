import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as AnnouncementsApi from "@/src/api/announcements";
import { AppScreen } from "@/src/ui/app-screen";
import { ErrorBox, Field, Info, PrimaryButton } from "@/src/ui/basic";
import { ErpCard, ListRow, OptionSelector, SectionHeader } from "@/src/ui/erp-widgets";
import { erp } from "@/src/theme/erp";

export default function AdminAlerts() {
  const listQuery = useQuery({
    queryKey: ["announcements", "my", "admin"],
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
    } catch (e: unknown) {
      setError((e as Error)?.message ?? "Failed to post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppScreen title="Alerts" subtitle="School announcements">
      {error ? <ErrorBox message={error} /> : null}

      <SectionHeader
        title="New announcement"
        actionLabel={listQuery.isFetching ? "…" : "Refresh"}
        onActionPress={() => void listQuery.refetch()}
      />
      <ErpCard style={{ marginBottom: erp.space.lg }}>
        <Field label="Title" value={title} onChangeText={setTitle} placeholder="Title" />
        <Field label="Message" value={message} onChangeText={setMessage} placeholder="Message" />
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
          <Field label="Class ID" value={classId} onChangeText={setClassId} placeholder="Class Mongo id" />
        ) : null}
        <PrimaryButton title="Post" onPress={() => void create()} loading={submitting} />
      </ErpCard>

      <SectionHeader title="Recent" />
      {listQuery.isLoading ? <Info loading>Loading announcements…</Info> : null}
      {listQuery.isError ? (
        <ErrorBox message={(listQuery.error as Error)?.message ?? "Failed to load"} />
      ) : null}
      {!listQuery.isLoading && listQuery.data?.length === 0 ? (
        <Info>No announcements posted yet</Info>
      ) : (
        listQuery.data?.map((a) => (
          <ListRow
            key={a._id}
            title={a.title}
            subtitle={`${a.audienceType} · ${a.createdAt?.slice?.(0, 10) ?? ""}`}
          />
        ))
      )}
    </AppScreen>
  );
}
