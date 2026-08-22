// BMI and discount calculations.

export type BmiCategory = {
  label: string;
  color: "info" | "success" | "warning" | "error";
};

export function calcBmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  if (m <= 0) return NaN;
  return weightKg / (m * m);
}

export function bmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return { label: "Underweight", color: "info" };
  if (bmi < 25) return { label: "Normal weight", color: "success" };
  if (bmi < 30) return { label: "Overweight", color: "warning" };
  return { label: "Obese", color: "error" };
}

// Healthy weight range (kg) for a given height in cm (BMI 18.5–24.9).
export function healthyRange(heightCm: number): { min: number; max: number } {
  const m = heightCm / 100;
  return { min: 18.5 * m * m, max: 24.9 * m * m };
}

export const LB_TO_KG = 0.45359237;
export const IN_TO_CM = 2.54;

export type DiscountResult = {
  discountAmount: number;
  priceAfterDiscount: number;
  taxAmount: number;
  finalPrice: number;
};

export function calcDiscount(
  price: number,
  discountPct: number,
  taxPct = 0,
): DiscountResult {
  const discountAmount = (price * discountPct) / 100;
  const priceAfterDiscount = price - discountAmount;
  const taxAmount = (priceAfterDiscount * taxPct) / 100;
  return {
    discountAmount,
    priceAfterDiscount,
    taxAmount,
    finalPrice: priceAfterDiscount + taxAmount,
  };
}
