import dayjs from "dayjs";
import React, { useMemo, useState } from "react";

import { DateField } from "@/src/components/DateField";
import { Card, EmptyState, FormScreen, ResultCard, ResultRow } from "@/src/components/ui";
import { calcAge } from "@/src/utils/date/dates";
import { useTheme } from "@/src/theme/ThemeContext";

export default function AgeScreen() {
  const { colors } = useTheme();
  const [dob, setDob] = useState("");
  const [ref, setRef] = useState(dayjs().format("YYYY-MM-DD"));

  const result = useMemo(() => (dob && ref ? calcAge(dob, ref) : null), [dob, ref]);

  return (
    <FormScreen title="Age Calculator" subtitle="Exact age & next birthday" toolId="age">
      <DateField testID="age-dob" label="Date of Birth" value={dob} onChange={setDob} />
      <DateField testID="age-ref" label="Age at Date" value={ref} onChange={setRef} />

      {result ? (
        <>
          <ResultCard
            testID="age-result"
            label="Your Age"
            value={`${result.years} yr ${result.months} mo ${result.days} d`}
            accent
          />
          <Card>
            <ResultRow label="Years" value={String(result.years)} testID="age-years" />
            <ResultRow label="Months" value={String(result.months)} testID="age-months" />
            <ResultRow label="Days" value={String(result.days)} testID="age-days" />
            <ResultRow label="Total Days Lived" value={result.totalDays.toLocaleString()} strong testID="age-total-days" />
            <ResultRow label="Next Birthday" value={result.nextBirthday} testID="age-next-birthday" />
            <ResultRow
              label="Days to Birthday"
              value={String(result.daysToNextBirthday)}
              color={colors.brandPrimary}
              testID="age-days-to-birthday"
            />
          </Card>
        </>
      ) : (
        <EmptyState
          icon="gift-outline"
          title={dob ? "Check the dates" : "Enter your date of birth"}
          message="Provide a valid date of birth that is on or before the reference date."
        />
      )}
    </FormScreen>
  );
}
