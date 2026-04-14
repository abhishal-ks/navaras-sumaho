import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as AnnouncementsApi from "@/src/api/announcements";
import { ErrorBox, Field, Info, PrimaryButton } from "@/src/ui/basic";
import { AppScreen } from "@/src/ui/app-screen";
import { OptionSelector } from "@/src/ui/erp-widgets";
import { erp } from "@/src/theme/erp";

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
  const [deleting, setDeleting] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    
    setDeleting(id);
    try {
      await AnnouncementsApi.deleteAnnouncement(id);
      await listQuery.refetch();
    } catch (e: any) {
      alert(e?.message ?? "Failed to delete announcement");
    } finally {
      setDeleting(null);
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
      {listQuery.data && listQuery.data.length > 0 ? (
        <View style={styles.announcementsList}>
          {listQuery.data.map((a) => (
            <View key={a._id} style={styles.announcementCard}>
              <View style={styles.announcementHeader}>
                <View style={styles.announcementTitleContainer}>
                  <Text style={styles.announcementTitle}>{a.title}</Text>
                  <Text style={styles.announcementAudience}>{a.audienceType === "school" ? "📢 School" : "🏫 Class"}</Text>
                </View>
                <Pressable
                  onPress={() => handleDelete(a._id)}
                  disabled={deleting === a._id}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={20} color={erp.colors.danger} />
                </Pressable>
              </View>
              <Text style={styles.announcementMessage}>{a.message}</Text>
              <Text style={styles.announcementDate}>{new Date(a.createdAt).toLocaleDateString()}</Text>
            </View>
          ))}
        </View>
      ) : !listQuery.isLoading ? (
        <Info>No announcements created yet</Info>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  announcementsList: {
    gap: erp.space.md,
    marginTop: erp.space.md,
  },
  announcementCard: {
    backgroundColor: erp.colors.bgElevated,
    borderRadius: erp.radii.md,
    padding: erp.space.md,
    gap: erp.space.sm,
  },
  announcementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: erp.space.md,
  },
  announcementTitleContainer: {
    flex: 1,
    gap: erp.space.xs,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: erp.colors.textPrimary,
  },
  announcementAudience: {
    fontSize: 12,
    color: erp.colors.textSecondary,
  },
  deleteButton: {
    padding: erp.space.sm,
  },
  announcementMessage: {
    fontSize: 14,
    color: erp.colors.textPrimary,
    lineHeight: 20,
  },
  announcementDate: {
    fontSize: 12,
    color: erp.colors.textSecondary,
    marginTop: erp.space.sm,
  },
});