import React, { useMemo, useState } from "react";
import { View } from "react-native";

import { DonutChart } from "@/src/components/DonutChart";
import { Card, Field, FormScreen, ResultCard, ResultRow, SegmentedControl } from "@/src/components/ui";
import { formatCurrency } from "@/src/utils/calc/format";
import { calcLumpSum, calcSip } from "@/src/utils/finance/finance";
import { useTheme } from "@/src/theme/ThemeContext";
import { spacing } from "@/src/theme/tokens";

const toNum = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ""));
  return isNaN(n) || n < 0 ? 0 : n;
};

export default function SipScreen() {
  const { colors } = useTheme();
  const [type, setType] = useState<"sip" | "lumpsum">("sip");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("12");
  const [duration, setDuration] = useState("10");
  const [unit, setUnit] = useState<"years" | "months">("years");

  const result = useMemo(() => {
    const amt = toNum(amount);
    const r = toNum(rate);
    const dur = toNum(duration);
    if (type === "sip") {
      const months = unit === "years" ? dur * 12 : dur;
      return calcSip(amt, r, months);
    }
    const years = unit === "years" ? dur : dur / 12;
    return calcLumpSum(amt, r, years);
  }, [type, amount, rate, duration, unit]);

  return (
    <FormScreen title="SIP & Investment" subtitle="Estimate future wealth" toolId="sip">
      <SegmentedControl
        testID="sip-type"
        value={type}
        onChange={setType}
        options={[
          { label: "SIP (Monthly)", value: "sip" },
          { label: "Lump Sum", value: "lumpsum" },
        ]}
      />
      <Field
        testID="sip-amount"
        label={type === "sip" ? "Monthly Investment" : "Total Investment"}
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="0"
        suffix="₹"
      />
      <Field
        testID="sip-rate"
        label="Expected Annual Return"
        value={rate}
        onChangeText={setRate}
        keyboardType="decimal-pad"
        placeholder="12"
        suffix="% p.a."
      />
      <Field
        testID="sip-duration"
        label="Investment Duration"
        value={duration}
        onChangeText={setDuration}
        keyboardType="number-pad"
        placeholder="10"
      />
      <SegmentedControl
        testID="sip-unit"
        value={unit}
        onChange={setUnit}
        options={[
          { label: "Years", value: "years" },
          { label: "Months", value: "months" },
        ]}
      />

      <ResultCard testID="sip-final-value" label="Estimated Future Value" value={formatCurrency(result.futureValue)} accent />

      <Card style={{ gap: spacing.lg }}>
        <DonutChart
          segments={[
            { value: result.invested, color: colors.info, label: "Invested" },
            { value: Math.max(0, result.returns), color: colors.brandPrimary, label: "Returns" },
          ]}
          centerLabel="Total"
          centerValue={formatCurrency(result.futureValue)}
        />
        <View>
          <ResultRow label="Invested Amount" value={formatCurrency(result.invested)} testID="sip-invested" />
          <ResultRow label="Estimated Returns" value={formatCurrency(result.returns)} color={colors.brandPrimary} testID="sip-returns" />
          <ResultRow label="Total Value" value={formatCurrency(result.futureValue)} strong testID="sip-total" />
        </View>
      </Card>
    </FormScreen>
  );
}
