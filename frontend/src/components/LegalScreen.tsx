import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen, ScreenHeader } from "@/src/components/ui";
import { useTheme } from "@/src/theme/ThemeContext";
import { fontSize, spacing } from "@/src/theme/tokens";

export type LegalSection = { heading: string; body: string };

export function LegalScreen({
  title,
  updated,
  intro,
  sections,
  testID,
}: {
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
  testID?: string;
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Screen>
      <ScreenHeader title={title} showBack />
      <ScrollView
        testID={testID}
        showsVerticalScrollIndicator
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.xxxl, gap: spacing.lg }}
      >
        <Text style={[styles.updated, { color: colors.muted }]}>Last updated: {updated}</Text>
        {intro ? <Text style={[styles.intro, { color: colors.onSurface }]}>{intro}</Text> : null}
        {sections.map((s, i) => (
          <View key={i} style={{ gap: spacing.sm }}>
            <Text style={[styles.heading, { color: colors.onSurface }]}>{`${i + 1}. ${s.heading}`}</Text>
            <Text style={[styles.body, { color: colors.muted }]}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  updated: { fontSize: fontSize.sm, fontWeight: "600" },
  intro: { fontSize: fontSize.base, lineHeight: 22, fontWeight: "500" },
  heading: { fontSize: fontSize.lg, fontWeight: "800" },
  body: { fontSize: fontSize.base, lineHeight: 22 },
});
