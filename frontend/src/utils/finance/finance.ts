// Financial formulas. Pure functions, no UI.

export type GstResult = {
  base: number;
  gstAmount: number;
  total: number;
};

// Add GST on top of a base amount.
export function addGst(amount: number, rate: number): GstResult {
  const gstAmount = (amount * rate) / 100;
  return { base: amount, gstAmount, total: amount + gstAmount };
}

// Remove GST from a GST-inclusive price.
export function removeGst(inclusive: number, rate: number): GstResult {
  const base = (inclusive * 100) / (100 + rate);
  return { base, gstAmount: inclusive - base, total: inclusive };
}

export type SipResult = {
  invested: number;
  returns: number;
  futureValue: number;
};

// SIP future value with monthly compounding, contributions at period start.
export function calcSip(
  monthly: number,
  annualRatePct: number,
  months: number,
): SipResult {
  const i = annualRatePct / 12 / 100;
  let fv: number;
  if (i === 0) {
    fv = monthly * months;
  } else {
    fv = monthly * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
  }
  const invested = monthly * months;
  return { invested, returns: fv - invested, futureValue: fv };
}

// Lump-sum (one-time) investment growth.
export function calcLumpSum(
  principal: number,
  annualRatePct: number,
  years: number,
): SipResult {
  const fv = principal * Math.pow(1 + annualRatePct / 100, years);
  return { invested: principal, returns: fv - principal, futureValue: fv };
}

export type EmiResult = {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  principal: number;
};

// EMI for a reducing-balance loan.
export function calcEmi(
  principal: number,
  annualRatePct: number,
  months: number,
): EmiResult {
  const r = annualRatePct / 12 / 100;
  let emi: number;
  if (r === 0) {
    emi = principal / months;
  } else {
    emi =
      (principal * r * Math.pow(1 + r, months)) /
      (Math.pow(1 + r, months) - 1);
  }
  const totalPayment = emi * months;
  return {
    emi,
    totalPayment,
    totalInterest: totalPayment - principal,
    principal,
  };
}
