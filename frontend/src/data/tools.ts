import { Ionicons } from "@expo/vector-icons";

export type ToolCategory = "calculator" | "finance" | "converter";

export type Tool = {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  category: ToolCategory;
  keywords: string[];
};

export const TOOLS: Tool[] = [
  // Calculators
  {
    id: "standard",
    name: "Calculator",
    description: "Standard everyday calculator",
    icon: "calculator",
    route: "/calculator?mode=standard",
    category: "calculator",
    keywords: ["calculator", "standard", "basic", "math", "arithmetic"],
  },
  {
    id: "scientific",
    name: "Scientific",
    description: "Trig, logs, powers & roots",
    icon: "flask",
    route: "/calculator?mode=scientific",
    category: "calculator",
    keywords: ["scientific", "sin", "cos", "tan", "log", "ln", "power", "root", "factorial"],
  },
  // Finance
  {
    id: "gst",
    name: "GST Calculator",
    description: "Add or remove GST",
    icon: "receipt",
    route: "/finance/gst",
    category: "finance",
    keywords: ["gst", "tax", "vat", "invoice"],
  },
  {
    id: "currency",
    name: "Currency Converter",
    description: "Convert between currencies",
    icon: "cash",
    route: "/finance/currency",
    category: "finance",
    keywords: ["currency", "exchange", "forex", "money", "usd", "inr", "eur"],
  },
  {
    id: "sip",
    name: "SIP & Investment",
    description: "SIP and lump-sum returns",
    icon: "trending-up",
    route: "/finance/sip",
    category: "finance",
    keywords: ["sip", "investment", "mutual fund", "lump sum", "returns", "wealth"],
  },
  {
    id: "emi",
    name: "Loan / EMI",
    description: "Monthly EMI & interest",
    icon: "home",
    route: "/finance/emi",
    category: "finance",
    keywords: ["emi", "loan", "interest", "mortgage", "installment"],
  },
  // Converters
  {
    id: "age",
    name: "Age Calculator",
    description: "Exact age & next birthday",
    icon: "gift",
    route: "/converters/age",
    category: "converter",
    keywords: ["age", "birthday", "dob", "years"],
  },
  {
    id: "area",
    name: "Area Converter",
    description: "m², acre, hectare & more",
    icon: "square",
    route: "/converters/unit?category=area",
    category: "converter",
    keywords: ["area", "square", "acre", "hectare", "land"],
  },
  {
    id: "length",
    name: "Length Converter",
    description: "mm, m, km, mile & more",
    icon: "resize",
    route: "/converters/unit?category=length",
    category: "converter",
    keywords: ["length", "distance", "meter", "mile", "inch", "foot"],
  },
  {
    id: "mass",
    name: "Mass / Weight",
    description: "g, kg, lb, oz & more",
    icon: "barbell",
    route: "/converters/unit?category=mass",
    category: "converter",
    keywords: ["mass", "weight", "kg", "gram", "pound", "ounce"],
  },
  {
    id: "volume",
    name: "Volume Converter",
    description: "L, ml, gallon & more",
    icon: "beaker",
    route: "/converters/unit?category=volume",
    category: "converter",
    keywords: ["volume", "liter", "gallon", "cup", "pint"],
  },
  {
    id: "speed",
    name: "Speed Converter",
    description: "km/h, mph, knot & more",
    icon: "speedometer",
    route: "/converters/unit?category=speed",
    category: "converter",
    keywords: ["speed", "velocity", "kmph", "mph", "knot"],
  },
  {
    id: "temperature",
    name: "Temperature",
    description: "Celsius, Fahrenheit, Kelvin",
    icon: "thermometer",
    route: "/converters/temperature",
    category: "converter",
    keywords: ["temperature", "celsius", "fahrenheit", "kelvin", "heat"],
  },
  {
    id: "time",
    name: "Time Converter",
    description: "Seconds, hours, days & more",
    icon: "time",
    route: "/converters/unit?category=time",
    category: "converter",
    keywords: ["time", "seconds", "minutes", "hours", "days", "weeks"],
  },
  {
    id: "bmi",
    name: "BMI Calculator",
    description: "Body Mass Index & health",
    icon: "fitness",
    route: "/converters/bmi",
    category: "converter",
    keywords: ["bmi", "body", "health", "weight", "fitness"],
  },
  {
    id: "data",
    name: "Data Storage",
    description: "Bit, byte, KB, MB, GB, TB",
    icon: "server",
    route: "/converters/unit?category=data",
    category: "converter",
    keywords: ["data", "storage", "byte", "kb", "mb", "gb", "tb", "binary"],
  },
  {
    id: "date",
    name: "Date Calculator",
    description: "Difference & add/subtract days",
    icon: "calendar",
    route: "/converters/date",
    category: "converter",
    keywords: ["date", "days", "difference", "add", "subtract"],
  },
  {
    id: "discount",
    name: "Discount Calculator",
    description: "Discount & final price",
    icon: "pricetag",
    route: "/converters/discount",
    category: "converter",
    keywords: ["discount", "sale", "offer", "price", "percent"],
  },
  {
    id: "numeral",
    name: "Numeral System",
    description: "Binary, octal, decimal, hex",
    icon: "code-slash",
    route: "/converters/numeral",
    category: "converter",
    keywords: ["numeral", "binary", "octal", "decimal", "hexadecimal", "base"],
  },
];

export const TOOLS_BY_ID: Record<string, Tool> = Object.fromEntries(
  TOOLS.map((t) => [t.id, t]),
);

export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.includes(q)),
  );
}
