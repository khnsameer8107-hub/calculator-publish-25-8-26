import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card, Field, FormScreen, ResultRow, SegmentedControl } from "@/src/components/ui";
import { formatNumber } from "@/src/utils/calc/format";
import { bmiCategory, calcBmi, healthyRange, IN_TO_CM, LB_TO_KG } from "@/src/utils/convert/misc";
import { useTheme } from "@/src/theme/ThemeContext";
import { fontSize, radius, spacing } from "@/src/theme/tokens";

const toNum = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ""));
  return isNaN(n) || n < 0 ? 0 : n;
};

export default function BmiScreen() {
  const { colors } = useTheme();
  const [system, setSystem] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const { bmi, valid } = useMemo(() => {
    const w = toNum(weight);
    const h = toNum(height);
    if (w <= 0 || h <= 0) return { bmi: 0, valid: false };
    const kg = system === "metric" ? w : w * LB_TO_KG;
    const cm = system === "metric" ? h : h * IN_TO_CM;
    return { bmi: calcBmi(kg, cm), valid: true };
  }, [weight, height, system]);

  const category = valid ? bmiCategory(bmi) : null;
  const range = useMemo(() => {
    const h = toNum(height);
    if (h <= 0) return null;
    const cm = system === "metric" ? h : h * IN_TO_CM;
    const r = healthyRange(cm);
    if (system === "metric") return { min: r.min, max: r.max, unit: "kg" };
    return { min: r.min / LB_TO_KG, max: r.max / LB_TO_KG, unit: "lb" };
  }, [height, system]);

  const catColor = category ? colors[category.color] : colors.onSurface;

  return (
    <FormScreen title="BMI Calculator" subtitle="Body Mass Index & health" toolId="bmi">
      <SegmentedControl
        testID="bmi-system"
        value={system}
        onChange={setSystem}
        options={[
          { label: "Metric", value: "metric" },
          { label: "Imperial", value: "imperial" },
        ]}
      />
      <Field
        testID="bmi-weight"
        label="Weight"
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
        placeholder="0"
        suffix={system === "metric" ? "kg" : "lb"}
      />
      <Field
        testID="bmi-height"
        label="Height"
        value={height}
        onChangeText={setHeight}
        keyboardType="decimal-pad"
        placeholder="0"
        suffix={system === "metric" ? "cm" : "in"}
      />

      {valid ? (
        <>
          <View style={[styles.bmiCard, { backgroundColor: catColor }]} testID="bmi-result">
            <Text style={styles.bmiValue}>{formatNumber(bmi, 1)}</Text>
            <Text style={styles.bmiCat}>{category?.label}</Text>
          </View>
          <Card>
            <ResultRow label="BMI Score" value={formatNumber(bmi, 1)} strong testID="bmi-score" />
            <ResultRow label="Category" value={category?.label ?? ""} color={catColor} testID="bmi-category" />
            {range ? (
              <ResultRow
                label="Healthy Range"
                value={`${formatNumber(range.min, 1)} – ${formatNumber(range.max, 1)} ${range.unit}`}
                testID="bmi-range"
              />
            ) : null}
          </Card>
        </>
      ) : (
        <Card>
          <Text style={[styles.hint, { color: colors.muted }]}>
            Enter a valid weight and height to see your BMI and health category.
          </Text>
        </Card>
      )}
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  bmiCard: { borderRadius: radius.lg, padding: spacing.xl, alignItems: "center", gap: spacing.xs },
  bmiValue: { color: "#fff", fontSize: fontSize["5xl"], fontWeight: "900" },
  bmiCat: { color: "#fff", fontSize: fontSize.lg, fontWeight: "700" },
  hint: { fontSize: fontSize.base, lineHeight: 20, textAlign: "center" },
});
