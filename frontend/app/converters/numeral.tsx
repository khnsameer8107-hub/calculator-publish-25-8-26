import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useToast } from "@/src/components/Toast";
import { Card, FormScreen, SegmentedControl } from "@/src/components/ui";
import { Base, convertNumeral, isValidForBase } from "@/src/utils/convert/numeral";
import { useTheme } from "@/src/theme/ThemeContext";
import { fonts, fontSize, radius, spacing } from "@/src/theme/tokens";

const BASES: { label: string; value: string; base: Base }[] = [
  { label: "DEC", value: "10", base: 10 },
  { label: "BIN", value: "2", base: 2 },
  { label: "OCT", value: "8", base: 8 },
  { label: "HEX", value: "16", base: 16 },
];

const FILTERS: Record<string, RegExp> = {
  "2": /[^01]/g,
  "8": /[^0-7]/g,
  "10": /[^0-9]/g,
  "16": /[^0-9a-fA-F]/g,
};

export default function NumeralScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  const [baseStr, setBaseStr] = useState("10");
  const [value, setValue] = useState("10");

  const base = Number(baseStr) as Base;
  const valid = isValidForBase(value, base);
  const result = useMemo(() => {
    if (!valid) return null;
    try {
      return convertNumeral(value, base);
    } catch {
      return null;
    }
  }, [value, base, valid]);

  const rows: { label: string; key: keyof NonNullable<typeof result> }[] = [
    { label: "Binary", key: "binary" },
    { label: "Octal", key: "octal" },
    { label: "Decimal", key: "decimal" },
    { label: "Hexadecimal", key: "hex" },
  ];

  return (
    <FormScreen title="Numeral System" subtitle="Binary · Octal · Decimal · Hex" toolId="numeral">
      <SegmentedControl
        testID="numeral-base"
        value={baseStr}
        onChange={(v) => {
          setBaseStr(v);
          setValue((prev) => prev.replace(FILTERS[v], ""));
        }}
        options={BASES.map((b) => ({ label: b.label, value: b.value }))}
      />

      <View style={{ gap: spacing.sm }}>
        <Text style={[styles.label, { color: colors.muted }]}>Value</Text>
        <View
          style={[
            styles.inputWrap,
            { backgroundColor: colors.surfaceSecondary, borderColor: valid || !value ? colors.border : colors.error },
          ]}
        >
          <TextInput
            testID="numeral-input"
            value={value}
            onChangeText={(t) => setValue(t.replace(FILTERS[baseStr], "").toUpperCase())}
            placeholder="Enter number"
            placeholderTextColor={colors.muted}
            autoCapitalize="characters"
            keyboardType={base === 10 || base === 2 || base === 8 ? "number-pad" : "default"}
            style={[styles.input, { color: colors.onSurface }]}
          />
        </View>
        {!valid && value ? (
          <Text style={[styles.error, { color: colors.error }]} testID="numeral-error">
            Invalid value for the selected base.
          </Text>
        ) : null}
      </View>

      <Card style={{ gap: spacing.md }}>
        {rows.map((r) => (
          <View key={r.key} style={[styles.row, { borderBottomColor: colors.divider }]} testID={`numeral-${r.key}`}>
            <Text style={[styles.rowLabel, { color: colors.muted }]}>{r.label}</Text>
            <View style={styles.rowRight}>
              <Text style={[styles.rowValue, { color: colors.onSurface }]} numberOfLines={1}>
                {result ? result[r.key] : "—"}
              </Text>
              {result ? (
                <Pressable
                  testID={`numeral-copy-${r.key}`}
                  hitSlop={8}
                  onPress={() => toast.copy(result[r.key], `${r.label} copied`)}
                >
                  <Ionicons name="copy-outline" size={16} color={colors.brandPrimary} />
                </Pressable>
              ) : null}
            </View>
          </View>
        ))}
      </Card>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: fontSize.sm, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  inputWrap: { borderRadius: radius.md, borderWidth: 1, paddingHorizontal: spacing.lg, minHeight: 54, justifyContent: "center" },
  input: { fontSize: fontSize.xl, fontWeight: "700", fontFamily: fonts.display, paddingVertical: spacing.md },
  error: { fontSize: fontSize.sm, fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
  },
  rowLabel: { fontSize: fontSize.base, fontWeight: "600" },
  rowRight: { flexDirection: "row", alignItems: "center", gap: spacing.md, flexShrink: 1 },
  rowValue: { fontSize: fontSize.lg, fontWeight: "700", fontFamily: fonts.display, flexShrink: 1 },
});
