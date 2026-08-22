import React, { useMemo, useState } from "react";
import { View } from "react-native";

import { DonutChart } from "@/src/components/DonutChart";
import { Card, Field, FormScreen, ResultCard, ResultRow, SegmentedControl } from "@/src/components/ui";
import { formatCurrency } from "@/src/utils/calc/format";
import { calcEmi } from "@/src/utils/finance/finance";
import { useTheme } from "@/src/theme/ThemeContext";
import { spacing } from "@/src/theme/tokens";

const toNum = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ""));
  return isNaN(n) || n < 0 ? 0 : n;
};

export default function EmiScreen() {
  const { colors } = useTheme();
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("9");
  const [duration, setDuration] = useState("5");
  const [unit, setUnit] = useState<"years" | "months">("years");

  const result = useMemo(() => {
    const p = toNum(amount);
    const r = toNum(rate);
    const dur = toNum(duration);
    const months = unit === "years" ? dur * 12 : dur;
    if (p <= 0 || months <= 0) {
      return { emi: 0, totalInterest: 0, totalPayment: 0, principal: p };
    }
    return calcEmi(p, r, months);
  }, [amount, rate, duration, unit]);

  return (
    <FormScreen title="Loan / EMI" subtitle="Monthly instalment & interest" toolId="emi">
      <Field
        testID="emi-amount"
        label="Loan Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="0"
        suffix="₹"
      />
      <Field
        testID="emi-rate"
        label="Interest Rate"
        value={rate}
        onChangeText={setRate}
        keyboardType="decimal-pad"
        placeholder="9"
        suffix="% p.a."
      />
      <Field
        testID="emi-duration"
        label="Loan Duration"
        value={duration}
        onChangeText={setDuration}
        keyboardType="number-pad"
        placeholder="5"
      />
      <SegmentedControl
        testID="emi-unit"
        value={unit}
        onChange={setUnit}
        options={[
          { label: "Years", value: "years" },
          { label: "Months", value: "months" },
        ]}
      />

      <ResultCard testID="emi-monthly" label="Monthly EMI" value={formatCurrency(result.emi)} accent />

      <Card style={{ gap: spacing.lg }}>
        <DonutChart
          segments={[
            { value: result.principal, color: colors.info, label: "Principal" },
            { value: Math.max(0, result.totalInterest), color: colors.brandPrimary, label: "Interest" },
          ]}
          centerLabel="Total Payable"
          centerValue={formatCurrency(result.totalPayment)}
        />
        <View>
          <ResultRow label="Principal Amount" value={formatCurrency(result.principal)} testID="emi-principal" />
          <ResultRow label="Total Interest" value={formatCurrency(result.totalInterest)} color={colors.brandPrimary} testID="emi-interest" />
          <ResultRow label="Total Payment" value={formatCurrency(result.totalPayment)} strong testID="emi-total" />
        </View>
      </Card>
    </FormScreen>
  );
}
