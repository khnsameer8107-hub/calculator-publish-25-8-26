import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { Selector } from "@/src/components/Selector";
import { useToast } from "@/src/components/Toast";
import { Card, Field, FormScreen, PrimaryButton, ResultCard } from "@/src/components/ui";
import { formatNumber } from "@/src/utils/calc/format";
import { convertUnit, UNIT_CATEGORIES } from "@/src/utils/convert/units";
import { useTheme } from "@/src/theme/ThemeContext";
import { radius, spacing } from "@/src/theme/tokens";

const toNum = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
};

export default function UnitConverterScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  const params = useLocalSearchParams<{ category?: string }>();
  const categoryId = params.category ?? "length";
  const category = UNIT_CATEGORIES[categoryId] ?? UNIT_CATEGORIES.length;

  const [value, setValue] = useState("1");
  const [from, setFrom] = useState(category.units[0].key);
  const [to, setTo] = useState(category.units[1].key);

  useEffect(() => {
    setFrom(category.units[0].key);
    setTo(category.units[1].key);
    setValue("1");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const options = category.units.map((u) => ({ key: u.key, label: u.label, symbol: u.symbol }));
  const fromUnit = category.units.find((u) => u.key === from) ?? category.units[0];
  const toUnit = category.units.find((u) => u.key === to) ?? category.units[1];

  const result = useMemo(
    () => convertUnit(toNum(value), fromUnit.factor, toUnit.factor),
    [value, fromUnit, toUnit],
  );

  const swap = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setFrom(to);
    setTo(from);
  };

  const reset = () => {
    setValue("1");
    setFrom(category.units[0].key);
    setTo(category.units[1].key);
  };

  return (
    <FormScreen title={category.name} subtitle="Instant unit conversion" toolId={categoryId}>
      <Field
        testID="unit-value"
        label="Value"
        value={value}
        onChangeText={setValue}
        keyboardType="decimal-pad"
        placeholder="0"
        suffix={fromUnit.symbol}
      />
      <Selector testID="unit-from" label="From" value={from} options={options} onSelect={setFrom} searchable />
      <View style={{ alignItems: "center" }}>
        <Pressable testID="unit-swap" onPress={swap} style={[styles.swap, { backgroundColor: colors.brandPrimary }]}>
          <Ionicons name="swap-vertical" size={22} color={colors.onBrandPrimary} />
        </Pressable>
      </View>
      <Selector testID="unit-to" label="To" value={to} options={options} onSelect={setTo} searchable />

      <ResultCard
        testID="unit-result"
        label={`${value || "0"} ${fromUnit.symbol} =`}
        value={`${formatNumber(result)} ${toUnit.symbol}`}
        accent
      />

      <Card style={{ flexDirection: "row", gap: spacing.md }}>
        <View style={{ flex: 1 }}>
          <PrimaryButton
            testID="unit-copy"
            label="Copy"
            icon="copy-outline"
            variant="secondary"
            onPress={() => toast.copy(formatNumber(result).replace(/,/g, ""), "Result copied")}
          />
        </View>
        <View style={{ flex: 1 }}>
          <PrimaryButton testID="unit-reset" label="Reset" icon="refresh-outline" variant="secondary" onPress={reset} />
        </View>
      </Card>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  swap: { width: 48, height: 48, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
});
