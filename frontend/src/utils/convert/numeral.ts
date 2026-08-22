// Numeral system conversion with strict validation.

export type Base = 2 | 8 | 10 | 16;

const PATTERNS: Record<Base, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  10: /^[0-9]+$/,
  16: /^[0-9a-f]+$/i,
};

export function isValidForBase(value: string, base: Base): boolean {
  const v = value.trim();
  if (!v) return false;
  return PATTERNS[base].test(v);
}

export type NumeralResult = {
  binary: string;
  octal: string;
  decimal: string;
  hex: string;
};

// Convert a validated value in the given base to all supported bases.
export function convertNumeral(value: string, base: Base): NumeralResult {
  const dec = parseInt(value.trim(), base);
  if (Number.isNaN(dec)) throw new Error("Invalid input");
  return {
    binary: dec.toString(2),
    octal: dec.toString(8),
    decimal: dec.toString(10),
    hex: dec.toString(16).toUpperCase(),
  };
}
