import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { useAppData } from "@/src/store/AppDataContext";
import { Tool } from "@/src/data/tools";
import { useTheme } from "@/src/theme/ThemeContext";
import { fontSize, radius, shadow, spacing } from "@/src/theme/tokens";
import { IconBadge } from "./ui";
import { Ionicons } from "@expo/vector-icons";

export function ToolCard({
  tool,
  layout = "grid",
  showFavorite = true,
  testID,
}: {
  tool: Tool;
  layout?: "grid" | "row" | "compact";
  showFavorite?: boolean;
  testID?: string;
}) {
  const { colors } = useTheme();
  const router = useRouter();
  const { isFavorite, toggleFavorite, addRecent } = useAppData();
  const fav = isFavorite(tool.id);

  const open = () => {
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    addRecent(tool.id);
    router.push(tool.route as never);
  };

  if (layout === "compact") {
    return (
      <Pressable
        testID={testID ?? `tool-${tool.id}`}
        onPress={open}
        style={[styles.compact, shadow.soft, { backgroundColor: colors.surfaceSecondary }]}
      >
        <IconBadge icon={tool.icon} size={40} />
        <Text style={[styles.compactName, { color: colors.onSurface }]} numberOfLines={1}>
          {tool.name}
        </Text>
      </Pressable>
    );
  }

  if (layout === "row") {
    return (
      <Pressable
        testID={testID ?? `tool-${tool.id}`}
        onPress={open}
        style={[styles.row, shadow.soft, { backgroundColor: colors.surfaceSecondary }]}
      >
        <IconBadge icon={tool.icon} size={48} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.onSurface }]} numberOfLines={1}>
            {tool.name}
          </Text>
          <Text style={[styles.desc, { color: colors.muted }]} numberOfLines={1}>
            {tool.description}
          </Text>
        </View>
        {showFavorite ? (
          <Pressable
            testID={`favorite-toggle-${tool.id}`}
            hitSlop={10}
            onPress={() => {
              if (Platform.OS !== "web")
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              toggleFavorite(tool.id);
            }}
          >
            <Ionicons
              name={fav ? "star" : "star-outline"}
              size={20}
              color={fav ? colors.brandPrimary : colors.muted}
            />
          </Pressable>
        ) : (
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        )}
      </Pressable>
    );
  }

  // grid
  return (
    <Pressable
      testID={testID ?? `tool-${tool.id}`}
      onPress={open}
      style={[styles.grid, shadow.soft, { backgroundColor: colors.surfaceSecondary }]}
    >
      <View style={styles.gridTop}>
        <IconBadge icon={tool.icon} size={48} />
        {showFavorite ? (
          <Pressable
            testID={`favorite-toggle-${tool.id}`}
            hitSlop={10}
            onPress={() => {
              if (Platform.OS !== "web")
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              toggleFavorite(tool.id);
            }}
          >
            <Ionicons
              name={fav ? "star" : "star-outline"}
              size={20}
              color={fav ? colors.brandPrimary : colors.muted}
            />
          </Pressable>
        ) : null}
      </View>
      <Text style={[styles.name, { color: colors.onSurface }]} numberOfLines={1}>
        {tool.name}
      </Text>
      <Text style={[styles.desc, { color: colors.muted }]} numberOfLines={2}>
        {tool.description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    minHeight: 132,
  },
  gridTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  compact: {
    width: 96,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    alignItems: "flex-start",
  },
  compactName: { fontSize: fontSize.sm, fontWeight: "700" },
  name: { fontSize: fontSize.lg, fontWeight: "800" },
  desc: { fontSize: fontSize.sm, fontWeight: "500", lineHeight: 18 },
});
