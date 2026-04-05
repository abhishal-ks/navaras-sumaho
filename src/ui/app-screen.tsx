import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { erp } from "@/src/theme/erp";

type AppScreenProps = {
  title?: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  children: React.ReactNode;
  /** Default true. Set false when the main child is a FlatList/SectionList. */
  scroll?: boolean;
  contentContainerStyle?: ViewStyle;
  keyboardVerticalOffset?: number;
};

export function AppScreen({
  title,
  subtitle,
  rightElement,
  children,
  scroll = true,
  contentContainerStyle,
  keyboardVerticalOffset,
}: AppScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom + erp.tabBarHeight + erp.space.md;
  const kavOffset =
    keyboardVerticalOffset ??
    (Platform.OS === "ios"
      ? insets.top + 8
      : insets.bottom + erp.tabBarHeight + 8);

  const body = scroll ? (
    <ScrollView
      style={styles.flexFill}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: bottomPad },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flexFill, { paddingBottom: bottomPad }]}>{children}</View>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      {(title || subtitle || rightElement) && (
        <View style={styles.headerRow}>
          <View style={styles.headerTextWrap}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {rightElement}
        </View>
      )}
      <KeyboardAvoidingView
        style={styles.flexFill}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={kavOffset}
      >
        {body}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: erp.colors.bg,
  },
  flexFill: { flex: 1 },
  scrollContent: {
    paddingHorizontal: erp.space.lg,
    paddingTop: erp.space.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: erp.space.lg,
    paddingVertical: erp.space.sm,
    backgroundColor: erp.colors.surface2,
    borderBottomColor: erp.colors.border,
    borderBottomWidth: 1,
  },
  headerTextWrap: { flex: 1, marginRight: erp.space.md },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: erp.colors.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: erp.colors.textSecondary,
  },
});
