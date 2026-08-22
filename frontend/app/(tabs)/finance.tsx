import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ToolCard } from "@/src/components/ToolCard";
import { Screen, ScreenHeader } from "@/src/components/ui";
import { TOOLS } from "@/src/data/tools";
import { useTheme } from "@/src/theme/ThemeContext";
import { fontSize, spacing } from "@/src/theme/tokens";

export default function FinanceScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const tools = useMemo(() => TOOLS.filter((t) => t.category === "finance"), []);

  return (
    <Screen>
      <ScreenHeader title="Finance" subtitle="Money & investment tools" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + 110, gap: spacing.md }}
      >
        <Text style={[styles.lead, { color: colors.muted }]}>
          Plan taxes, loans and investments with precise financial formulas.
        </Text>
        {tools.map((t) => (
          <ToolCard key={t.id} tool={t} layout="row" />
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: { fontSize: fontSize.base, lineHeight: 20, marginBottom: spacing.sm },
});
