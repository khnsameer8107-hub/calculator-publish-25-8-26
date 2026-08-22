import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { Selector } from "@/src/components/Selector";
import { useToast } from "@/src/components/Toast";
import { Card, Field, FormScreen, ResultCard } from "@/src/components/ui";
import { formatNumber } from "@/src/utils/calc/format";
import { convertCurrency, CURRENCIES, getCurrency, RATES_UPDATED } from "@/src/utils/finance/currency";
import { useTheme } from "@/src/theme/ThemeContext";
import { fontSize, radius, spacing } from "@/src/theme/tokens";

const toNum = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
};

const options = CURRENCIES.map((c) => ({ key: c.code, label: `${c.code} · ${c.name}`, symbol: c.symbol }));

export default function CurrencyScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");

  const converted = useMemo(() => convertCurrency(toNum(amount), from, to), [amount, from, to]);
  const toCur = getCurrency(to);
  const fromCur = getCurrency(from);
  const rate = useMemo(() => convertCurrency(1, from, to), [from, to]);

  const swap = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setFrom(to);
    setTo(from);
  };

  return (
    <FormScreen title="Currency Converter" subtitle="Approximate offline rates" toolId="currency">
      <Field
        testID="currency-amount"
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="0"
        suffix={fromCur.symbol}
      />
      <Selector testID="currency-from" label="From" value={from} options={options} onSelect={setFrom} searchable />
      <View style={{ alignItems: "center" }}>
        <Pressable
          testID="currency-swap"
          onPress={swap}
          style={[styles.swap, { backgroundColor: colors.brandPrimary }]}
        >
          <Ionicons name="swap-vertical" size={22} color={colors.onBrandPrimary} />
        </Pressable>
      </View>
      <Selector testID="currency-to" label="To" value={to} options={options} onSelect={setTo} searchable />

      <ResultCard
        testID="currency-result"
        label={`${amount || "0"} ${from} =`}
        value={`${toCur.symbol}${formatNumber(converted, 2)}`}
        accent
      />

      <Card style={{ gap: spacing.sm }}>
        <View style={styles.rateRow}>
          <Text style={[styles.rateText, { color: colors.onSurface }]}>
            1 {from} = {formatNumber(rate, 4)} {to}
          </Text>
          <Pressable
            testID="currency-copy"
            hitSlop={8}
            onPress={() => toast.copy(String(formatNumber(converted, 2).replace(/,/g, "")), "Amount copied")}
          >
            <Ionicons name="copy-outline" size={18} color={colors.brandPrimary} />
          </Pressable>
        </View>
        <View style={[styles.note, { backgroundColor: colors.brandTertiary }]}>
          <Ionicons name="information-circle-outline" size={16} color={colors.onBrandTertiary} />
          <Text style={[styles.noteText, { color: colors.onBrandTertiary }]}>
            Rates are approximate & static (not live). Last reviewed {RATES_UPDATED}.
          </Text>
        </View>
      </Card>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  swap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  rateRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rateText: { fontSize: fontSize.lg, fontWeight: "700" },
  note: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  noteText: { fontSize: fontSize.sm, fontWeight: "600", flex: 1, lineHeight: 18 },
});
