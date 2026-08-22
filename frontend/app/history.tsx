import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useToast } from "@/src/components/Toast";
import { EmptyState, Screen, ScreenHeader } from "@/src/components/ui";
import { useAppData, HistoryItem } from "@/src/store/AppDataContext";
import { useTheme } from "@/src/theme/ThemeContext";
import { fonts, fontSize, radius, shadow, spacing } from "@/src/theme/tokens";

export default function HistoryScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const toast = useToast();
  const { history, deleteHistory, clearHistory } = useAppData();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return history;
    return history.filter(
      (h) => h.expression.toLowerCase().includes(q) || h.result.toLowerCase().includes(q),
    );
  }, [history, query]);

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <Pressable
      testID={`history-item-${item.id}`}
      onPress={() => router.push(`/calculator?expr=${encodeURIComponent(item.expression)}`)}
      style={[styles.item, shadow.soft, { backgroundColor: colors.surfaceSecondary }]}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={[styles.expr, { color: colors.muted }]} numberOfLines={1}>
          {item.expression}
        </Text>
        <Text style={[styles.result, { color: colors.onSurface }]} numberOfLines={1}>
          = {item.result}
        </Text>
        <Text style={[styles.time, { color: colors.muted }]}>
          {dayjs(item.timestamp).format("DD MMM YYYY, hh:mm A")}
        </Text>
      </View>
      <View style={styles.itemActions}>
        <Pressable
          testID={`history-copy-${item.id}`}
          hitSlop={8}
          onPress={() => toast.copy(item.result.replace(/,/g, ""), "Result copied")}
          style={[styles.smallBtn, { backgroundColor: colors.surfaceTertiary }]}
        >
          <Ionicons name="copy-outline" size={16} color={colors.onSurface} />
        </Pressable>
        <Pressable
          testID={`history-delete-${item.id}`}
          hitSlop={8}
          onPress={() => deleteHistory(item.id)}
          style={[styles.smallBtn, { backgroundColor: colors.surfaceTertiary }]}
        >
          <Ionicons name="trash-outline" size={16} color={colors.error} />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <Screen>
      <ScreenHeader
        title="History"
        subtitle={`${history.length} calculation${history.length === 1 ? "" : "s"}`}
        showBack
        right={
          history.length > 0 ? (
            <Pressable
              testID="clear-all-history"
              onPress={clearHistory}
              style={[styles.clearBtn, { backgroundColor: colors.surfaceSecondary }]}
            >
              <Ionicons name="trash-outline" size={18} color={colors.error} />
            </Pressable>
          ) : undefined
        }
      />
      {history.length > 0 ? (
        <View style={[styles.search, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            testID="history-search"
            value={query}
            onChangeText={setQuery}
            placeholder="Search history..."
            placeholderTextColor={colors.muted}
            style={[styles.searchInput, { color: colors.onSurface }]}
          />
        </View>
      ) : null}
      {history.length === 0 ? (
        <EmptyState
          icon="time-outline"
          title="No history yet"
          message="Your calculations will appear here. Tap any to reuse it."
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + 110, gap: spacing.md }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  clearBtn: { width: 40, height: 40, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: fontSize.base, paddingVertical: spacing.sm },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  expr: { fontSize: fontSize.base, fontFamily: fonts.display },
  result: { fontSize: fontSize.xl, fontWeight: "800", fontFamily: fonts.display },
  time: { fontSize: fontSize.sm, fontWeight: "500", marginTop: 2 },
  itemActions: { gap: spacing.sm },
  smallBtn: { width: 34, height: 34, borderRadius: radius.sm + 2, alignItems: "center", justifyContent: "center" },
});
