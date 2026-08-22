import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { useTheme } from "@/src/theme/ThemeContext";
import { fontSize, radius, spacing } from "@/src/theme/tokens";

// Simple, cross-platform (works on web too) date entry as Day / Month / Year.
// Emits an ISO date string (YYYY-MM-DD) when the date is valid, else "".
export function DateField({
  label,
  value,
  onChange,
  testID,
}: {
  label: string;
  value: string;
  onChange: (iso: string) => void;
  testID?: string;
}) {
  const { colors } = useTheme();
  const parsed = value ? dayjs(value) : null;
  const [d, setD] = useState(parsed ? String(parsed.date()) : "");
  const [m, setM] = useState(parsed ? String(parsed.month() + 1) : "");
  const [y, setY] = useState(parsed ? String(parsed.year()) : "");

  useEffect(() => {
    const dd = parseInt(d, 10);
    const mm = parseInt(m, 10);
    const yy = parseInt(y, 10);
    if (!dd || !mm || !yy || String(yy).length !== 4) {
      onChange("");
      return;
    }
    const candidate = dayjs(new Date(yy, mm - 1, dd));
    if (
      candidate.isValid() &&
      candidate.date() === dd &&
      candidate.month() + 1 === mm &&
      candidate.year() === yy
    ) {
      onChange(candidate.format("YYYY-MM-DD"));
    } else {
      onChange("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d, m, y]);

  const box = (
    val: string,
    set: (t: string) => void,
    ph: string,
    max: number,
    id: string,
    flex: number,
  ) => (
    <View
      style={[
        styles.box,
        { flex, backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
      ]}
    >
      <TextInput
        testID={id}
        value={val}
        onChangeText={(t) => set(t.replace(/[^0-9]/g, "").slice(0, max))}
        placeholder={ph}
        placeholderTextColor={colors.muted}
        keyboardType="number-pad"
        style={[styles.input, { color: colors.onSurface }]}
      />
    </View>
  );

  return (
    <View style={{ gap: spacing.sm }} testID={testID}>
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
      <View style={styles.row}>
        {box(d, setD, "DD", 2, `${testID}-day`, 1)}
        {box(m, setM, "MM", 2, `${testID}-month`, 1)}
        {box(y, setY, "YYYY", 4, `${testID}-year`, 1.4)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: fontSize.sm, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  row: { flexDirection: "row", gap: spacing.md },
  box: { borderRadius: radius.md, borderWidth: 1, paddingHorizontal: spacing.md, minHeight: 54, justifyContent: "center" },
  input: { fontSize: fontSize.xl, fontWeight: "700", textAlign: "center", paddingVertical: spacing.md },
});
