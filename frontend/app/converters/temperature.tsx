import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { Selector } from "@/src/components/Selector";
import { useToast } from "@/src/components/Toast";
import { Card, Field, FormScreen, ResultCard } from "@/src/components/ui";
import { formatNumber } from "@/src/utils/calc/format";
import { convertTemperature, TEMP_UNITS, TempUnit } from "@/src/utils/convert/units";
import { useTheme } from "@/src/theme/ThemeContext";
import { radius } from "@/src/theme/tokens";

const toNum = (s: string) => {
  if (s.trim() === "" || s.trim() === "-") return 0;
  const n = parseFloat(s.replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
};

const options = TEMP_UNITS.map((u) => ({ key: u.key, label: u.label, symbol: u.symbol }));

export default function TemperatureScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  const [value, setValue] = useState("0");
  const [from, setFrom] = useState<TempUnit>("c");
  const [to, setTo] = useState<TempUnit>("f");

  const result = useMemo(() => convertTemperature(toNum(value), from, to), [value, from, to]);
  const toUnit = TEMP_UNITS.find((u) => u.key === to)!;
  const fromUnit = TEMP_UNITS.find((u) => u.key === from)!;

  const swap = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setFrom(to);
    setTo(from);
  };

  return (
    <FormScreen title="Temperature" subtitle="Celsius · Fahrenheit · Kelvin" toolId="temperature">
      <Field
        testID="temp-value"
        label="Value"
        value={value}
        onChangeText={setValue}
        keyboardType="numeric"
        placeholder="0"
        suffix={fromUnit.symbol}
      />
      <Selector testID="temp-from" label="From" value={from} options={options} onSelect={(k) => setFrom(k as TempUnit)} />
      <View style={{ alignItems: "center" }}>
        <Pressable testID="temp-swap" onPress={swap} style={[styles.swap, { backgroundColor: colors.brandPrimary }]}>
          <Ionicons name="swap-vertical" size={22} color={colors.onBrandPrimary} />
        </Pressable>
      </View>
      <Selector testID="temp-to" label="To" value={to} options={options} onSelect={(k) => setTo(k as TempUnit)} />

      <ResultCard
        testID="temp-result"
        label={`${value || "0"} ${fromUnit.symbol} =`}
        value={`${formatNumber(result, 4)} ${toUnit.symbol}`}
        accent
      />
      <Card>
        <Pressable
          testID="temp-copy"
          onPress={() => toast.copy(formatNumber(result, 4).replace(/,/g, ""), "Result copied")}
          style={styles.copyRow}
        >
          <Ionicons name="copy-outline" size={18} color={colors.brandPrimary} />
        </Pressable>
      </Card>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  swap: { width: 48, height: 48, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  copyRow: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
});
