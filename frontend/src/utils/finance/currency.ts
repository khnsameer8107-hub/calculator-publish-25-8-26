// Static/approximate currency rates (relative to 1 USD). OFFLINE-FIRST.
// These are NOT live. Always label as approximate in the UI.

export type Currency = {
  code: string;
  name: string;
  symbol: string;
  perUsd: number; // how many units equal 1 USD
};

// Approximate rates. Last reviewed date shown to the user.
export const RATES_UPDATED = "2026-01-15";

export const CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", perUsd: 1 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", perUsd: 83.2 },
  { code: "EUR", name: "Euro", symbol: "€", perUsd: 0.92 },
  { code: "GBP", name: "British Pound", symbol: "£", perUsd: 0.79 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", perUsd: 151.5 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", perUsd: 1.52 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", perUsd: 1.36 },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", perUsd: 3.67 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", perUsd: 1.34 },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", perUsd: 0.88 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", perUsd: 7.24 },
];

export function getCurrency(code: string): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

// Convert amount from one currency to another via USD.
export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string,
): number {
  const from = getCurrency(fromCode);
  const to = getCurrency(toCode);
  const usd = amount / from.perUsd;
  return usd * to.perUsd;
}
