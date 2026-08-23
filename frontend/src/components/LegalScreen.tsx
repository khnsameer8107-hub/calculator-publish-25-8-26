import React from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen, ScreenHeader } from "@/src/components/ui";
import { useTheme } from "@/src/theme/ThemeContext";
import { fontSize, radius, spacing } from "@/src/theme/tokens";

export type LegalSection = { heading: string; body: string; email?: string };

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
            {s.email ? (
              <TouchableOpacity
                accessibilityRole="link"
                accessibilityLabel={`Email support at ${s.email}`}
                activeOpacity={0.7}
                onPress={() => Linking.openURL(`mailto:${s.email}`)}
                style={[styles.emailCard, { backgroundColor: colors.brandTertiary, borderColor: colors.brand }]}
              >
                <Text style={[styles.emailLabel, { color: colors.muted }]}>Support email</Text>
                <Text style={[styles.emailValue, { color: colors.brand }]}>{s.email}</Text>
              </TouchableOpacity>
            ) : null}
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
  emailCard: {
    marginTop: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: 2,
  },
  emailLabel: { fontSize: fontSize.sm, fontWeight: "600" },
  emailValue: { fontSize: fontSize.lg, fontWeight: "800" },
});
