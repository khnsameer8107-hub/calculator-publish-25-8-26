import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ToolCard } from "@/src/components/ToolCard";
import { Screen, ScreenHeader } from "@/src/components/ui";
import { TOOLS } from "@/src/data/tools";
import { spacing } from "@/src/theme/tokens";

export default function ConvertersScreen() {
  const insets = useSafeAreaInsets();
  const tools = useMemo(() => TOOLS.filter((t) => t.category === "converter"), []);

  return (
    <Screen>
      <ScreenHeader title="Converters" subtitle="Units, dates & everyday math" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + 110 }}
      >
        <View style={styles.grid}>
          {tools.map((t) => (
            <View key={t.id} style={styles.cell}>
              <ToolCard tool={t} layout="grid" />
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -spacing.sm },
  cell: { width: "50%", padding: spacing.sm },
});
