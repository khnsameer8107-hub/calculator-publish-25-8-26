import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ToolCard } from "@/src/components/ToolCard";
import { EmptyState, Screen, ScreenHeader } from "@/src/components/ui";
import { searchTools, TOOLS } from "@/src/data/tools";
import { useTheme } from "@/src/theme/ThemeContext";
import { fontSize, radius, spacing } from "@/src/theme/tokens";

export default function SearchScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const results = useMemo(() => (query.trim() ? searchTools(query) : TOOLS), [query]);

  return (
    <Screen>
      <ScreenHeader title="Search" showBack />
      <View style={[styles.search, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.muted} />
        <TextInput
          testID="search-input"
          value={query}
          onChangeText={setQuery}
          placeholder="Search calculator or converter..."
          placeholderTextColor={colors.muted}
          autoFocus
          style={[styles.searchInput, { color: colors.onSurface }]}
        />
        {query ? (
          <Ionicons name="close-circle" size={20} color={colors.muted} onPress={() => setQuery("")} />
        ) : null}
      </View>
      {results.length === 0 ? (
        <EmptyState icon="search-outline" title="No results" message={`Nothing matches "${query}". Try another keyword.`} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => <ToolCard tool={item} layout="row" />}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.xl, gap: spacing.md }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={[styles.count, { color: colors.muted }]}>
              {query.trim() ? `${results.length} result${results.length === 1 ? "" : "s"}` : "All tools"}
            </Text>
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: fontSize.lg, paddingVertical: spacing.sm },
  count: { fontSize: fontSize.sm, fontWeight: "600", marginBottom: spacing.sm },
});
