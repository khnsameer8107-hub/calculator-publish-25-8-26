import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/src/theme/ThemeContext";
import { fontSize, radius, spacing } from "@/src/theme/tokens";

export type Option = { key: string; label: string; symbol?: string };

export function Selector({
  label,
  value,
  options,
  onSelect,
  searchable,
  testID,
}: {
  label: string;
  value: string;
  options: Option[];
  onSelect: (key: string) => void;
  searchable?: boolean;
  testID?: string;
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const current = options.find((o) => o.key === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.symbol ?? "").toLowerCase().includes(q) ||
        o.key.toLowerCase().includes(q),
    );
  }, [options, query]);

  return (
    <View style={{ gap: spacing.sm }}>
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
      <Pressable
        testID={testID}
        onPress={() => setOpen(true)}
        style={[
          styles.trigger,
          { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.triggerText, { color: colors.onSurface }]} numberOfLines={1}>
          {current ? `${current.label}${current.symbol ? ` (${current.symbol})` : ""}` : "Select"}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.muted} />
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.surface, paddingBottom: insets.bottom + spacing.lg },
          ]}
        >
          <View style={styles.sheetHandle}>
            <View style={[styles.handleBar, { backgroundColor: colors.borderStrong }]} />
          </View>
          <Text style={[styles.sheetTitle, { color: colors.onSurface }]}>{label}</Text>
          {searchable ? (
            <View
              style={[
                styles.search,
                { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
              ]}
            >
              <Ionicons name="search" size={18} color={colors.muted} />
              <TextInput
                testID={`${testID}-search`}
                value={query}
                onChangeText={setQuery}
                placeholder="Search..."
                placeholderTextColor={colors.muted}
                style={[styles.searchInput, { color: colors.onSurface }]}
              />
            </View>
          ) : null}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.key}
            keyboardShouldPersistTaps="handled"
            style={{ maxHeight: 380 }}
            renderItem={({ item }) => {
              const active = item.key === value;
              return (
                <Pressable
                  testID={`${testID}-option-${item.key}`}
                  onPress={() => {
                    onSelect(item.key);
                    setQuery("");
                    setOpen(false);
                  }}
                  style={[
                    styles.option,
                    { borderBottomColor: colors.divider },
                    active && { backgroundColor: colors.brandTertiary },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: active ? colors.brandPrimary : colors.onSurface },
                    ]}
                  >
                    {item.label}
                    {item.symbol ? `  ·  ${item.symbol}` : ""}
                  </Text>
                  {active ? (
                    <Ionicons name="checkmark" size={20} color={colors.brandPrimary} />
                  ) : null}
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: fontSize.sm, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    minHeight: 54,
  },
  triggerText: { fontSize: fontSize.lg, fontWeight: "700", flexShrink: 1 },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  sheetHandle: { alignItems: "center", paddingVertical: spacing.sm },
  handleBar: { width: 40, height: 5, borderRadius: radius.pill },
  sheetTitle: { fontSize: fontSize.xl, fontWeight: "800", marginBottom: spacing.md },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  searchInput: { flex: 1, fontSize: fontSize.base, paddingVertical: spacing.md },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: { fontSize: fontSize.lg, fontWeight: "600" },
});
