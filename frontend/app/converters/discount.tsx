import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";

import { Chip, Field, FormScreen, ResultCard, ResultRow, Card } from "@/src/components/ui";
import { formatCurrency } from "@/src/utils/calc/format";
import { calcDiscount } from "@/src/utils/convert/misc";
import { spacing } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/ThemeContext";

const PRESETS = [10, 20, 25, 50, 70];
const toNum = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ""));
  return isNaN(n) || n < 0 ? 0 : n;
};

export default function DiscountScreen() {
  const { colors } = useTheme();
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("20");
  const [tax, setTax] = useState("");

  const result = useMemo(
    () => calcDiscount(toNum(price), toNum(discount), toNum(tax)),
    [price, discount, tax],
  );

  return (
    <FormScreen title="Discount Calculator" subtitle="Discount, tax & final price" toolId="discount">
      <Field
        testID="discount-price"
        label="Original Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
        placeholder="0"
        suffix="₹"
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
        {PRESETS.map((p) => (
          <Chip
            key={p}
            testID={`discount-preset-${p}`}
            label={`${p}%`}
            active={discount === String(p)}
            onPress={() => setDiscount(String(p))}
          />
        ))}
      </ScrollView>
      <Field
        testID="discount-percent"
        label="Discount"
        value={discount}
        onChangeText={setDiscount}
        keyboardType="decimal-pad"
        placeholder="0"
        suffix="%"
      />
      <Field
        testID="discount-tax"
        label="Tax after discount (optional)"
        value={tax}
        onChangeText={setTax}
        keyboardType="decimal-pad"
        placeholder="0"
        suffix="%"
      />

      <ResultCard testID="discount-final" label="Final Price" value={formatCurrency(result.finalPrice)} accent />
      <Card>
        <ResultRow label="You Save" value={formatCurrency(result.discountAmount)} color={colors.success} testID="discount-saved" />
        <ResultRow label="Price After Discount" value={formatCurrency(result.priceAfterDiscount)} testID="discount-after" />
        {toNum(tax) > 0 ? (
          <ResultRow label="Tax Amount" value={formatCurrency(result.taxAmount)} testID="discount-tax-amount" />
        ) : null}
        <ResultRow label="Final Price" value={formatCurrency(result.finalPrice)} strong testID="discount-final-row" />
      </Card>
    </FormScreen>
  );
}
