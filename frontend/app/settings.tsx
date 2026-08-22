import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useToast } from "@/src/components/Toast";
import { Card, IconBadge, Screen, ScreenHeader, SectionTitle } from "@/src/components/ui";
import { useAppData } from "@/src/store/AppDataContext";
import { ThemeMode, useTheme } from "@/src/theme/ThemeContext";
import { fontSize, radius, spacing } from "@/src/theme/tokens";

const OPTIONS: { mode: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { mode: "light", label: "Light", icon: "sunny-outline" },
  { mode: "dark", label: "Dark", icon: "moon-outline" },
  { mode: "system", label: "System", icon: "phone-portrait-outline" },
];

export default function SettingsScreen() {
  const { colors, mode, setMode } = useTheme();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { clearHistory, clearRecents } = useAppData();

  return (
    <Screen>
      <ScreenHeader title="Settings" showBack />
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.xl, gap: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <SectionTitle title="Appearance" />
          <Card style={{ gap: spacing.sm, padding: spacing.sm }}>
            {OPTIONS.map((opt) => {
              const active = mode === opt.mode;
              return (
                <Pressable
                  key={opt.mode}
                  testID={`theme-${opt.mode}`}
                  onPress={() => {
                    if (Platform.OS !== "web")
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    setMode(opt.mode);
                  }}
                  style={[
                    styles.themeRow,
                    active && { backgroundColor: colors.brandTertiary },
                  ]}
                >
                  <IconBadge icon={opt.icon} size={40} />
                  <Text style={[styles.themeLabel, { color: colors.onSurface }]}>{opt.label}</Text>
                  <Ionicons
                    name={active ? "radio-button-on" : "radio-button-off"}
                    size={22}
                    color={active ? colors.brandPrimary : colors.muted}
                  />
                </Pressable>
              );
            })}
          </Card>
          <Text style={[styles.hint, { color: colors.muted }]}>
            Orange accent stays consistent across every theme.
          </Text>
        </View>

        <View>
          <SectionTitle title="Data" />
          <Card style={{ gap: spacing.md }}>
            <Pressable
              testID="clear-history"
              onPress={() => {
                clearHistory();
                toast.show("History cleared", "trash-outline");
              }}
              style={styles.dataRow}
            >
              <Ionicons name="time-outline" size={22} color={colors.onSurface} />
              <Text style={[styles.dataLabel, { color: colors.onSurface }]}>Clear calculation history</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </Pressable>
            <View style={[styles.divider, { backgroundColor: colors.divider }]} />
            <Pressable
              testID="clear-recents"
              onPress={() => {
                clearRecents();
                toast.show("Recent tools cleared", "trash-outline");
              }}
              style={styles.dataRow}
            >
              <Ionicons name="refresh-outline" size={22} color={colors.onSurface} />
              <Text style={[styles.dataLabel, { color: colors.onSurface }]}>Clear recently used tools</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </Pressable>
          </Card>
        </View>

        <View>
          <SectionTitle title="About" />
          <Card style={{ gap: spacing.sm }}>
            <Text style={[styles.aboutTitle, { color: colors.onSurface }]}>CalcHub</Text>
            <Text style={[styles.aboutText, { color: colors.muted }]}>
              A private, offline-first multi-calculator. No ads, no accounts, no tracking.
              Everything is stored only on your device.
            </Text>
            <Text style={[styles.version, { color: colors.muted }]}>Version 1.0.0</Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  themeLabel: { flex: 1, fontSize: fontSize.lg, fontWeight: "700" },
  hint: { fontSize: fontSize.sm, marginTop: spacing.sm, paddingHorizontal: spacing.xs },
  dataRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  dataLabel: { flex: 1, fontSize: fontSize.base, fontWeight: "600" },
  divider: { height: StyleSheet.hairlineWidth },
  aboutTitle: { fontSize: fontSize.xl, fontWeight: "900" },
  aboutText: { fontSize: fontSize.base, lineHeight: 20 },
  version: { fontSize: fontSize.sm, marginTop: spacing.sm },
});
