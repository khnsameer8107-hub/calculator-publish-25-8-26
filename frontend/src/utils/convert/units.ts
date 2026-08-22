// Unit conversion definitions. Ratio-based via a base unit per category.

export type Unit = {
  key: string;
  label: string;
  symbol: string;
  factor: number; // value in base units
};

export type UnitCategory = {
  id: string;
  name: string;
  units: Unit[];
};

export const UNIT_CATEGORIES: Record<string, UnitCategory> = {
  length: {
    id: "length",
    name: "Length",
    units: [
      { key: "mm", label: "Millimeter", symbol: "mm", factor: 0.001 },
      { key: "cm", label: "Centimeter", symbol: "cm", factor: 0.01 },
      { key: "m", label: "Meter", symbol: "m", factor: 1 },
      { key: "km", label: "Kilometer", symbol: "km", factor: 1000 },
      { key: "in", label: "Inch", symbol: "in", factor: 0.0254 },
      { key: "ft", label: "Foot", symbol: "ft", factor: 0.3048 },
      { key: "yd", label: "Yard", symbol: "yd", factor: 0.9144 },
      { key: "mi", label: "Mile", symbol: "mi", factor: 1609.344 },
    ],
  },
  area: {
    id: "area",
    name: "Area",
    units: [
      { key: "mm2", label: "Square Millimeter", symbol: "mm²", factor: 1e-6 },
      { key: "cm2", label: "Square Centimeter", symbol: "cm²", factor: 1e-4 },
      { key: "m2", label: "Square Meter", symbol: "m²", factor: 1 },
      { key: "km2", label: "Square Kilometer", symbol: "km²", factor: 1e6 },
      { key: "in2", label: "Square Inch", symbol: "in²", factor: 0.00064516 },
      { key: "ft2", label: "Square Foot", symbol: "ft²", factor: 0.09290304 },
      { key: "yd2", label: "Square Yard", symbol: "yd²", factor: 0.83612736 },
      { key: "acre", label: "Acre", symbol: "ac", factor: 4046.8564224 },
      { key: "ha", label: "Hectare", symbol: "ha", factor: 10000 },
    ],
  },
  mass: {
    id: "mass",
    name: "Mass / Weight",
    units: [
      { key: "mg", label: "Milligram", symbol: "mg", factor: 0.001 },
      { key: "g", label: "Gram", symbol: "g", factor: 1 },
      { key: "kg", label: "Kilogram", symbol: "kg", factor: 1000 },
      { key: "ton", label: "Metric Ton", symbol: "t", factor: 1e6 },
      { key: "oz", label: "Ounce", symbol: "oz", factor: 28.349523125 },
      { key: "lb", label: "Pound", symbol: "lb", factor: 453.59237 },
    ],
  },
  volume: {
    id: "volume",
    name: "Volume",
    units: [
      { key: "ml", label: "Milliliter", symbol: "ml", factor: 0.001 },
      { key: "l", label: "Liter", symbol: "L", factor: 1 },
      { key: "m3", label: "Cubic Meter", symbol: "m³", factor: 1000 },
      { key: "cm3", label: "Cubic Centimeter", symbol: "cm³", factor: 0.001 },
      { key: "gal", label: "Gallon (US)", symbol: "gal", factor: 3.785411784 },
      { key: "qt", label: "Quart (US)", symbol: "qt", factor: 0.946352946 },
      { key: "pt", label: "Pint (US)", symbol: "pt", factor: 0.473176473 },
      { key: "cup", label: "Cup (US)", symbol: "cup", factor: 0.2365882365 },
    ],
  },
  speed: {
    id: "speed",
    name: "Speed",
    units: [
      { key: "mps", label: "Meter/second", symbol: "m/s", factor: 1 },
      { key: "kmph", label: "Kilometer/hour", symbol: "km/h", factor: 0.2777777778 },
      { key: "mph", label: "Mile/hour", symbol: "mph", factor: 0.44704 },
      { key: "knot", label: "Knot", symbol: "kn", factor: 0.5144444444 },
    ],
  },
  time: {
    id: "time",
    name: "Time",
    units: [
      { key: "s", label: "Seconds", symbol: "s", factor: 1 },
      { key: "min", label: "Minutes", symbol: "min", factor: 60 },
      { key: "hr", label: "Hours", symbol: "hr", factor: 3600 },
      { key: "day", label: "Days", symbol: "d", factor: 86400 },
      { key: "week", label: "Weeks", symbol: "wk", factor: 604800 },
    ],
  },
  data: {
    id: "data",
    name: "Data Storage",
    units: [
      { key: "bit", label: "Bit", symbol: "b", factor: 0.125 },
      { key: "byte", label: "Byte", symbol: "B", factor: 1 },
      { key: "kb", label: "Kilobyte (KB)", symbol: "KB", factor: 1e3 },
      { key: "mb", label: "Megabyte (MB)", symbol: "MB", factor: 1e6 },
      { key: "gb", label: "Gigabyte (GB)", symbol: "GB", factor: 1e9 },
      { key: "tb", label: "Terabyte (TB)", symbol: "TB", factor: 1e12 },
      { key: "kib", label: "Kibibyte (KiB)", symbol: "KiB", factor: 1024 },
      { key: "mib", label: "Mebibyte (MiB)", symbol: "MiB", factor: 1048576 },
      { key: "gib", label: "Gibibyte (GiB)", symbol: "GiB", factor: 1073741824 },
      { key: "tib", label: "Tebibyte (TiB)", symbol: "TiB", factor: 1099511627776 },
    ],
  },
};

export function convertUnit(
  value: number,
  fromFactor: number,
  toFactor: number,
): number {
  return (value * fromFactor) / toFactor;
}

// Temperature needs special formulas (offset-based, not ratio).
export const TEMP_UNITS = [
  { key: "c", label: "Celsius", symbol: "°C" },
  { key: "f", label: "Fahrenheit", symbol: "°F" },
  { key: "k", label: "Kelvin", symbol: "K" },
] as const;

export type TempUnit = (typeof TEMP_UNITS)[number]["key"];

export function convertTemperature(value: number, from: TempUnit, to: TempUnit): number {
  // to Celsius first
  let c: number;
  if (from === "c") c = value;
  else if (from === "f") c = (value - 32) * (5 / 9);
  else c = value - 273.15;

  if (to === "c") return c;
  if (to === "f") return c * (9 / 5) + 32;
  return c + 273.15;
}
