// Safe mathematical expression evaluator.
// NO eval / Function. Tokenizer + recursive-descent parser + evaluator.
// Supports: + - * / % ^, parentheses, unary +/-, postfix ! (factorial),
// postfix % (percent = /100), functions (sin/cos/tan/asin/acos/atan/log/ln/
// sqrt/cbrt/abs/exp), and constants pi & e.

import { roundSmart } from "./format";

export type AngleMode = "DEG" | "RAD";

export class CalcError extends Error {}

const FUNCTIONS = new Set([
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "log",
  "ln",
  "sqrt",
  "cbrt",
  "abs",
  "exp",
]);

type Token =
  | { type: "num"; value: number }
  | { type: "op"; value: string }
  | { type: "lparen" }
  | { type: "rparen" }
  | { type: "func"; value: string }
  | { type: "const"; value: string };

// Normalize UI symbols to plain math symbols.
export function normalizeExpression(raw: string): string {
  return raw
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/π/g, "pi")
    .replace(/√/g, "sqrt")
    .replace(/∛/g, "cbrt")
    .replace(/\s+/g, "");
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const s = input.toLowerCase();

  while (i < s.length) {
    const ch = s[i];

    if (ch >= "0" && ch <= "9") {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      // scientific notation e.g. 1e-5
      if (s[j] === "e" && (/[0-9]/.test(s[j + 1]) || ((s[j + 1] === "+" || s[j + 1] === "-") && /[0-9]/.test(s[j + 2])))) {
        j++;
        if (s[j] === "+" || s[j] === "-") j++;
        while (j < s.length && /[0-9]/.test(s[j])) j++;
      }
      const numStr = s.slice(i, j);
      const value = Number(numStr);
      if (Number.isNaN(value)) throw new CalcError("Invalid expression");
      tokens.push({ type: "num", value });
      i = j;
      continue;
    }

    if (ch === ".") {
      // number starting with a dot
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      const value = Number(s.slice(i, j));
      if (Number.isNaN(value)) throw new CalcError("Invalid expression");
      tokens.push({ type: "num", value });
      i = j;
      continue;
    }

    if (/[a-z]/.test(ch)) {
      let j = i;
      while (j < s.length && /[a-z0-9]/.test(s[j])) j++;
      const word = s.slice(i, j);
      if (FUNCTIONS.has(word)) {
        tokens.push({ type: "func", value: word });
      } else if (word === "pi" || word === "e") {
        tokens.push({ type: "const", value: word });
      } else {
        throw new CalcError("Invalid expression");
      }
      i = j;
      continue;
    }

    if ("+-*/^%!".includes(ch)) {
      tokens.push({ type: "op", value: ch });
      i++;
      continue;
    }
    if (ch === "(") {
      tokens.push({ type: "lparen" });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "rparen" });
      i++;
      continue;
    }

    throw new CalcError("Invalid expression");
  }
  return tokens;
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new CalcError("Invalid expression");
  if (n > 170) return Infinity;
  let r = 1;
  for (let k = 2; k <= n; k++) r *= k;
  return r;
}

// Recursive descent parser + evaluator.
class Parser {
  private pos = 0;
  constructor(
    private tokens: Token[],
    private angle: AngleMode,
  ) {}

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }
  private next(): Token | undefined {
    return this.tokens[this.pos++];
  }

  parse(): number {
    if (this.tokens.length === 0) throw new CalcError("Invalid expression");
    const v = this.parseExpr();
    if (this.pos !== this.tokens.length) throw new CalcError("Invalid expression");
    return v;
  }

  private parseExpr(): number {
    let left = this.parseTerm();
    while (true) {
      const t = this.peek();
      if (t && t.type === "op" && (t.value === "+" || t.value === "-")) {
        this.next();
        const right = this.parseTerm();
        left = t.value === "+" ? left + right : left - right;
      } else break;
    }
    return left;
  }

  private parseTerm(): number {
    let left = this.parseUnary();
    while (true) {
      const t = this.peek();
      if (t && t.type === "op" && (t.value === "*" || t.value === "/")) {
        this.next();
        const right = this.parseUnary();
        if (t.value === "/") {
          if (right === 0) throw new CalcError("Cannot divide by zero");
          left = left / right;
        } else {
          left = left * right;
        }
      } else break;
    }
    return left;
  }

  private parseUnary(): number {
    const t = this.peek();
    if (t && t.type === "op" && (t.value === "-" || t.value === "+")) {
      this.next();
      const v = this.parseUnary();
      return t.value === "-" ? -v : v;
    }
    return this.parsePower();
  }

  private parsePower(): number {
    const base = this.parsePostfix();
    const t = this.peek();
    if (t && t.type === "op" && t.value === "^") {
      this.next();
      const exp = this.parseUnary(); // right-associative, allow unary exp
      const r = Math.pow(base, exp);
      if (Number.isNaN(r)) throw new CalcError("Invalid expression");
      return r;
    }
    return base;
  }

  private parsePostfix(): number {
    let v = this.parsePrimary();
    while (true) {
      const t = this.peek();
      if (t && t.type === "op" && t.value === "!") {
        this.next();
        v = factorial(v);
      } else if (t && t.type === "op" && t.value === "%") {
        this.next();
        v = v / 100;
      } else break;
    }
    return v;
  }

  private parsePrimary(): number {
    const t = this.next();
    if (!t) throw new CalcError("Invalid expression");

    if (t.type === "num") return t.value;
    if (t.type === "const") return t.value === "pi" ? Math.PI : Math.E;

    if (t.type === "lparen") {
      const v = this.parseExpr();
      const close = this.next();
      if (!close || close.type !== "rparen") throw new CalcError("Invalid expression");
      return v;
    }

    if (t.type === "func") {
      const open = this.next();
      if (!open || open.type !== "lparen") throw new CalcError("Invalid expression");
      const arg = this.parseExpr();
      const close = this.next();
      if (!close || close.type !== "rparen") throw new CalcError("Invalid expression");
      return this.applyFunc(t.value, arg);
    }

    throw new CalcError("Invalid expression");
  }

  private toRad(x: number): number {
    return this.angle === "DEG" ? (x * Math.PI) / 180 : x;
  }
  private fromRad(x: number): number {
    return this.angle === "DEG" ? (x * 180) / Math.PI : x;
  }

  private applyFunc(name: string, x: number): number {
    let r: number;
    switch (name) {
      case "sin":
        r = Math.sin(this.toRad(x));
        break;
      case "cos":
        r = Math.cos(this.toRad(x));
        break;
      case "tan":
        r = Math.tan(this.toRad(x));
        break;
      case "asin":
        if (x < -1 || x > 1) throw new CalcError("Invalid expression");
        r = this.fromRad(Math.asin(x));
        break;
      case "acos":
        if (x < -1 || x > 1) throw new CalcError("Invalid expression");
        r = this.fromRad(Math.acos(x));
        break;
      case "atan":
        r = this.fromRad(Math.atan(x));
        break;
      case "log":
        if (x <= 0) throw new CalcError("Invalid expression");
        r = Math.log10(x);
        break;
      case "ln":
        if (x <= 0) throw new CalcError("Invalid expression");
        r = Math.log(x);
        break;
      case "sqrt":
        if (x < 0) throw new CalcError("Invalid expression");
        r = Math.sqrt(x);
        break;
      case "cbrt":
        r = Math.cbrt(x);
        break;
      case "abs":
        r = Math.abs(x);
        break;
      case "exp":
        r = Math.exp(x);
        break;
      default:
        throw new CalcError("Invalid expression");
    }
    if (Number.isNaN(r)) throw new CalcError("Invalid expression");
    return r;
  }
}

// Evaluate a UI expression string. Returns rounded numeric result.
export function evaluate(raw: string, angle: AngleMode = "DEG"): number {
  const normalized = normalizeExpression(raw);
  if (!normalized) throw new CalcError("Invalid expression");
  const tokens = tokenize(normalized);
  const parser = new Parser(tokens, angle);
  const result = parser.parse();
  if (Number.isNaN(result)) throw new CalcError("Invalid expression");
  if (!isFinite(result)) throw new CalcError("Cannot divide by zero");
  return roundSmart(result);
}

// Live preview: returns formatted result or null if the (partial) expression
// can't be evaluated yet. Never throws.
export function tryEvaluate(raw: string, angle: AngleMode = "DEG"): number | null {
  try {
    return evaluate(raw, angle);
  } catch {
    return null;
  }
}
