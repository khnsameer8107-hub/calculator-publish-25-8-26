import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text } from "react-native";

import { DateField } from "@/src/components/DateField";
import { Card, Field, FormScreen, ResultCard, ResultRow, SegmentedControl } from "@/src/components/ui";
import { addDays, dateDiff, subtractDays } from "@/src/utils/date/dates";
import { useTheme } from "@/src/theme/ThemeContext";
import { fontSize } from "@/src/theme/tokens";

type Op = "diff" | "add" | "sub";

export default function DateScreen() {
  const { colors } = useTheme();
  const [op, setOp] = useState<Op>("diff");
  const [start, setStart] = useState(dayjs().format("YYYY-MM-DD"));
  const [end, setEnd] = useState("");
  const [days, setDays] = useState("30");

  const diff = useMemo(() => (op === "diff" && start && end ? dateDiff(start, end) : null), [op, start, end]);
  const shifted = useMemo(() => {
    if (op === "add" && start) return addDays(start, parseInt(days || "0", 10));
    if (op === "sub" && start) return subtractDays(start, parseInt(days || "0", 10));
    return null;
  }, [op, start, days]);

  return (
    <FormScreen title="Date Calculator" subtitle="Difference & add / subtract days" toolId="date">
      <SegmentedControl
        testID="date-op"
        value={op}
        onChange={setOp}
        options={[
          { label: "Difference", value: "diff" },
          { label: "Add", value: "add" },
          { label: "Subtract", value: "sub" },
        ]}
      />

      <DateField testID="date-start" label={op === "diff" ? "Start Date" : "Base Date"} value={start} onChange={setStart} />

      {op === "diff" ? (
        <DateField testID="date-end" label="End Date" value={end} onChange={setEnd} />
      ) : (
        <Field
          testID="date-days"
          label="Number of Days"
          value={days}
          onChangeText={(t) => setDays(t.replace(/[^0-9]/g, ""))}
          keyboardType="number-pad"
          placeholder="0"
          suffix="days"
        />
      )}

      {op === "diff" ? (
        diff ? (
          <>
            <ResultCard testID="date-result" label="Total Difference" value={`${diff.totalDays.toLocaleString()} days`} accent />
            <Card>
              <ResultRow label="Years" value={String(diff.years)} testID="date-years" />
              <ResultRow label="Months" value={String(diff.months)} testID="date-months" />
              <ResultRow label="Days" value={String(diff.days)} testID="date-days-part" />
              <ResultRow label="Total Days" value={diff.totalDays.toLocaleString()} strong testID="date-total-days" />
            </Card>
          </>
        ) : (
          <Card>
            <Text style={[styles.hint, { color: colors.muted }]}>Enter both valid dates to see the difference.</Text>
          </Card>
        )
      ) : shifted ? (
        <ResultCard testID="date-result" label={op === "add" ? "Resulting Date" : "Resulting Date"} value={shifted} accent />
      ) : (
        <Card>
          <Text style={[styles.hint, { color: colors.muted }]}>Enter a valid base date and number of days.</Text>
        </Card>
      )}
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: fontSize.base, lineHeight: 20, textAlign: "center" },
});
