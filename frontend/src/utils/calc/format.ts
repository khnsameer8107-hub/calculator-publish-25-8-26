// Number formatting helpers. Keep display readable and avoid float noise.

export function roundSmart(value: number, sig = 12): number {
  if (!isFinite(value)) return value;
  if (value === 0) return 0;
  // Round to a sane number of significant digits to kill FP noise.
  const rounded = Number(value.toPrecision(sig));
  return Object.is(rounded, -0) ? 0 : rounded;
}

// Format a number for display with grouping and scientific fallback.
export function formatNumber(value: number, maxDecimals = 8): string {
  if (Number.isNaN(value)) return "Error";
  if (!isFinite(value)) return value > 0 ? "∞" : "-∞";

  const rounded = roundSmart(value);
  const abs = Math.abs(rounded);

  // Use scientific notation for extreme magnitudes.
  if (abs !== 0 && (abs >= 1e15 || abs < 1e-9)) {
    return rounded.toExponential(6).replace(/\.?0+e/, "e");
  }

  const [intPart, decPartRaw] = String(rounded).split(".");
  const sign = intPart.startsWith("-") ? "-" : "";
  const digits = sign ? intPart.slice(1) : intPart;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  let decPart = decPartRaw ?? "";
  if (decPart.length > maxDecimals) {
    decPart = decPart.slice(0, maxDecimals);
  }
  decPart = decPart.replace(/0+$/, "");

  return decPart ? `${sign}${grouped}.${decPart}` : `${sign}${grouped}`;
}

export function formatCurrency(value: number, symbol = "₹"): string {
  if (Number.isNaN(value) || !isFinite(value)) return `${symbol}0`;
  return `${symbol}${formatNumber(Math.round(value * 100) / 100, 2)}`;
}
