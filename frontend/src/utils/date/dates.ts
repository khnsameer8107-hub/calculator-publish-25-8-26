// Date & age calculations using dayjs (leap-year safe).
import dayjs from "dayjs";

export type AgeResult = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthday: string;
  daysToNextBirthday: number;
};

export function calcAge(dobIso: string, refIso: string): AgeResult | null {
  const dob = dayjs(dobIso);
  const ref = dayjs(refIso);
  if (!dob.isValid() || !ref.isValid() || dob.isAfter(ref)) return null;

  let years = ref.year() - dob.year();
  let months = ref.month() - dob.month();
  let days = ref.date() - dob.date();

  if (days < 0) {
    months -= 1;
    const prevMonth = ref.subtract(1, "month");
    days += prevMonth.daysInMonth();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = ref.startOf("day").diff(dob.startOf("day"), "day");

  // next birthday
  let nb = dob.year(ref.year());
  if (nb.isBefore(ref, "day") || nb.isSame(ref, "day")) {
    nb = nb.add(1, "year");
  }
  const daysToNextBirthday = nb.startOf("day").diff(ref.startOf("day"), "day");

  return {
    years,
    months,
    days,
    totalDays,
    nextBirthday: nb.format("ddd, DD MMM YYYY"),
    daysToNextBirthday,
  };
}

export type DateDiffResult = {
  totalDays: number;
  years: number;
  months: number;
  days: number;
};

export function dateDiff(startIso: string, endIso: string): DateDiffResult | null {
  let a = dayjs(startIso);
  let b = dayjs(endIso);
  if (!a.isValid() || !b.isValid()) return null;
  if (a.isAfter(b)) [a, b] = [b, a];

  const totalDays = b.startOf("day").diff(a.startOf("day"), "day");

  let years = b.year() - a.year();
  let months = b.month() - a.month();
  let days = b.date() - a.date();
  if (days < 0) {
    months -= 1;
    days += b.subtract(1, "month").daysInMonth();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { totalDays, years, months, days };
}

export function addDays(dateIso: string, days: number): string | null {
  const d = dayjs(dateIso);
  if (!d.isValid()) return null;
  return d.add(days, "day").format("ddd, DD MMM YYYY");
}

export function subtractDays(dateIso: string, days: number): string | null {
  const d = dayjs(dateIso);
  if (!d.isValid()) return null;
  return d.subtract(days, "day").format("ddd, DD MMM YYYY");
}
