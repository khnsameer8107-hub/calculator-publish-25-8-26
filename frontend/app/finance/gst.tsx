import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { Card, Chip, Field, FormScreen, ResultCard, ResultRow, SegmentedControl } from "@/src/components/ui";
import { formatCurrency } from "@/src/utils/calc/format";
import { addGst, removeGst } from "@/src/utils/finance/finance";
import { spacing } from "@/src/theme/tokens";

const PRESETS = [5, 12, 18, 28];
const toNum = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
};

export default function GstScreen() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("18");
  const [mode, setMode] = useState<"add" | "remove">("add");

  const result = useMemo(() => {
    const amt = toNum(amount);
    const r = toNum(rate);
    return mode === "add" ? addGst(amt, r) : removeGst(amt, r);
  }, [amount, rate, mode]);

  return (
    <FormScreen title="GST Calculator" subtitle="Add or remove GST" toolId="gst">
      <SegmentedControl
        testID="gst-mode"
        value={mode}
        onChange={(v) => setMode(v)}
        options={[
          { label: "Add GST", value: "add" },
          { label: "Remove GST", value: "remove" },
        ]}
      />
      <Field
        testID="gst-amount"
        label={mode === "add" ? "Base Amount" : "GST-Inclusive Amount"}
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="0"
        suffix="₹"
      />
      <View style={{ gap: spacing.md }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.sm }}
        >
          {PRESETS.map((p) => (
            <Chip
              key={p}
              testID={`gst-preset-${p}`}
              label={`${p}%`}
              active={rate === String(p)}
              onPress={() => setRate(String(p))}
            />
          ))}
        </ScrollView>
        <Field
          testID="gst-rate"
          label="GST Rate"
          value={rate}
          onChangeText={setRate}
          keyboardType="decimal-pad"
          placeholder="18"
          suffix="%"
        />
      </View>

      <ResultCard
        testID="gst-final-result"
        label={mode === "add" ? "Final Amount (incl. GST)" : "Base Amount (excl. GST)"}
        value={formatCurrency(mode === "add" ? result.total : result.base)}
        accent
      />
      <Card>
        <ResultRow label="Base Amount" value={formatCurrency(result.base)} testID="gst-base" />
        <ResultRow label="GST Amount" value={formatCurrency(result.gstAmount)} testID="gst-amount-result" />
        <ResultRow
          label="Total Amount"
          value={formatCurrency(result.total)}
          strong
          testID="gst-total"
        />
      </Card>
    </FormScreen>
  );
}
