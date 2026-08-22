import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CalculatorButton } from "@/src/components/CalculatorButton";
import { useToast } from "@/src/components/Toast";
import { Screen } from "@/src/components/ui";
import { useAppData } from "@/src/store/AppDataContext";
import { useTheme } from "@/src/theme/ThemeContext";
import { fonts, fontSize, radius, spacing } from "@/src/theme/tokens";
import { AngleMode, CalcError, evaluate, tryEvaluate } from "@/src/utils/calc/expression";
import { formatNumber } from "@/src/utils/calc/format";
import { storage } from "@/src/utils/storage";

type Mode = "standard" | "scientific";
const MODE_KEY = "calc.mode";
const ANGLE_KEY = "calc.angle";

const FUNC_PREFIXES = ["sin(", "cos(", "tan(", "asin(", "acos(", "atan(", "log(", "ln(", "√(", "∛("];

export default function CalculatorScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const toast = useToast();
  const { addHistory } = useAppData();
  const params = useLocalSearchParams<{ mode?: string; expr?: string }>();

  const [mode, setMode] = useState<Mode>("standard");
  const [angle, setAngle] = useState<AngleMode>("DEG");
  const [second, setSecond] = useState(false);
  const [expr, setExpr] = useState("");
  const [evaluatedExpr, setEvaluatedExpr] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [justEvaluated, setJustEvaluated] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const bottomScrollRef = useRef<ScrollView>(null);

  // Load persisted prefs.
  useEffect(() => {
    (async () => {
      const m = await storage.getItem<string>(MODE_KEY, "standard");
      const a = await storage.getItem<string>(ANGLE_KEY, "DEG");
      if (m === "standard" || m === "scientific") setMode(m);
      if (a === "DEG" || a === "RAD") setAngle(a);
    })();
  }, []);

  // React to route params (from tools / history).
  useEffect(() => {
    if (params.mode === "standard" || params.mode === "scientific") {
      setMode(params.mode);
      storage.setItem(MODE_KEY, params.mode);
    }
    if (typeof params.expr === "string" && params.expr.length) {
      setExpr(params.expr);
      setJustEvaluated(false);
      setError(null);
    }
  }, [params.mode, params.expr]);

  const changeMode = useCallback((m: Mode) => {
    setMode(m);
    storage.setItem(MODE_KEY, m);
  }, []);

  const toggleAngle = useCallback(() => {
    setAngle((prev) => {
      const next = prev === "DEG" ? "RAD" : "DEG";
      storage.setItem(ANGLE_KEY, next);
      return next;
    });
  }, []);

  const preview = useMemo(() => {
    if (justEvaluated || error || !expr) return null;
    return tryEvaluate(expr, angle);
  }, [expr, angle, justEvaluated, error]);

  const topLine = justEvaluated ? evaluatedExpr : expr || "0";
  const bottomLine = error
    ? error
    : justEvaluated
      ? result
      : preview !== null && preview !== undefined
        ? formatNumber(preview)
        : "";

  const lastNumberHasDot = (s: string) => {
    const m = s.match(/[0-9.]*$/);
    return m ? m[0].includes(".") : false;
  };

  const press = useCallback(
    (tok: string, fresh: boolean) => {
      setError(null);
      setExpr((prev) => {
        if (justEvaluated) {
          setJustEvaluated(false);
          if (fresh) return tok === "." ? "0." : tok;
          return prev + tok; // continue from raw result
        }
        if (tok === "." && lastNumberHasDot(prev)) return prev;
        if (tok === "." && (prev === "" || /[+\-×÷(^]$/.test(prev))) return prev + "0.";
        return prev + tok;
      });
    },
    [justEvaluated],
  );

  const clearAll = useCallback(() => {
    setExpr("");
    setError(null);
    setJustEvaluated(false);
  }, []);

  const backspace = useCallback(() => {
    setError(null);
    if (justEvaluated) {
      clearAll();
      return;
    }
    setExpr((prev) => {
      for (const f of FUNC_PREFIXES) {
        if (prev.endsWith(f)) return prev.slice(0, -f.length);
      }
      return prev.slice(0, -1);
    });
  }, [justEvaluated, clearAll]);

  const toggleSign = useCallback(() => {
    setError(null);
    setExpr((prev) => {
      const src = justEvaluated ? prev : prev;
      const m = src.match(/(-?)(\d*\.?\d+)$/);
      if (!m) return src + "-";
      const start = src.length - m[0].length;
      const before = src.slice(0, start);
      if (m[1] === "-") return before + m[2];
      return before + "-" + m[2];
    });
    setJustEvaluated(false);
  }, [justEvaluated]);

  const equals = useCallback(() => {
    if (!expr) return;
    try {
      const res = evaluate(expr, angle);
      const formatted = formatNumber(res);
      addHistory(expr, formatted);
      setEvaluatedExpr(expr);
      setExpr(String(res));
      setResult(formatted);
      setJustEvaluated(true);
      setError(null);
    } catch (e) {
      setError(e instanceof CalcError ? e.message : "Invalid expression");
      setJustEvaluated(false);
    }
  }, [expr, angle, addHistory]);

  const copyResult = useCallback(() => {
    const value = justEvaluated ? result : preview !== null ? formatNumber(preview!) : expr;
    if (value) toast.copy(value.replace(/,/g, ""), "Result copied");
  }, [justEvaluated, result, preview, expr, toast]);

  // Keyboard input on web / desktop.
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const handler = (e: KeyboardEvent) => {
      const k = e.key;
      if (/[0-9]/.test(k)) press(k, true);
      else if (k === ".") press(".", true);
      else if (k === "+") press("+", false);
      else if (k === "-") press("-", false);
      else if (k === "*") press("×", false);
      else if (k === "/") press("÷", false);
      else if (k === "%") press("%", false);
      else if (k === "^") press("^", false);
      else if (k === "(") press("(", true);
      else if (k === ")") press(")", false);
      else if (k === "Enter" || k === "=") {
        e.preventDefault();
        equals();
      } else if (k === "Backspace") backspace();
      else if (k === "Escape") clearAll();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [press, equals, backspace, clearAll]);

  // Auto scroll expression to the end.
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
    bottomScrollRef.current?.scrollToEnd({ animated: true });
  }, [topLine, bottomLine]);

  return (
    <Screen>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.modeSwitch, { backgroundColor: colors.surfaceTertiary }]}>
          {(["standard", "scientific"] as Mode[]).map((m) => (
            <Pressable
              key={m}
              testID={`mode-${m}`}
              onPress={() => changeMode(m)}
              style={[
                styles.modeBtn,
                mode === m && { backgroundColor: colors.surfaceSecondary },
              ]}
            >
              <Text
                style={[
                  styles.modeText,
                  { color: mode === m ? colors.brandPrimary : colors.muted },
                ]}
              >
                {m === "standard" ? "Standard" : "Scientific"}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.headerActions}>
          <Pressable
            testID="copy-result"
            onPress={copyResult}
            style={[styles.hBtn, { backgroundColor: colors.surfaceSecondary }]}
          >
            <Ionicons name="copy-outline" size={20} color={colors.onSurface} />
          </Pressable>
          <Pressable
            testID="open-history"
            onPress={() => router.push("/history")}
            style={[styles.hBtn, { backgroundColor: colors.surfaceSecondary }]}
          >
            <Ionicons name="time-outline" size={20} color={colors.onSurface} />
          </Pressable>
        </View>
      </View>

      {/* Display */}
      <View style={styles.display}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.displayScroll}
        >
          <Text style={[styles.exprText, { color: colors.muted }]} testID="calc-expression">
            {topLine}
          </Text>
        </ScrollView>
        <ScrollView
          ref={bottomScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.displayScroll}
        >
          <Text
            style={[
              styles.resultText,
              {
                color: error ? colors.error : justEvaluated ? colors.onSurface : colors.muted,
                fontSize: error ? fontSize["2xl"] : fontSize["5xl"],
              },
            ]}
            testID="calc-result"
          >
            {bottomLine}
          </Text>
        </ScrollView>
      </View>

      {/* Keypad */}
      <View style={[styles.keypad, { paddingBottom: insets.bottom + 96 }]}>
        {mode === "scientific" ? (
          <View style={styles.sciBlock}>
            <View style={styles.row}>
              <CalculatorButton testID="btn-2nd" label="2nd" variant={second ? "operator" : "function"} small onPress={() => setSecond((s) => !s)} />
              <CalculatorButton testID="btn-angle" label={angle} variant="function" small onPress={toggleAngle} />
              <CalculatorButton testID="btn-sin" label={second ? "sin⁻¹" : "sin"} variant="function" small onPress={() => press(second ? "asin(" : "sin(", true)} />
              <CalculatorButton testID="btn-cos" label={second ? "cos⁻¹" : "cos"} variant="function" small onPress={() => press(second ? "acos(" : "cos(", true)} />
              <CalculatorButton testID="btn-tan" label={second ? "tan⁻¹" : "tan"} variant="function" small onPress={() => press(second ? "atan(" : "tan(", true)} />
            </View>
            <View style={styles.row}>
              <CalculatorButton testID="btn-pow" label="xʸ" variant="function" small onPress={() => press("^", false)} />
              <CalculatorButton testID="btn-square" label={second ? "x³" : "x²"} variant="function" small onPress={() => press(second ? "^3" : "^2", false)} />
              <CalculatorButton testID="btn-root" label={second ? "∛" : "√"} variant="function" small onPress={() => press(second ? "∛(" : "√(", true)} />
              <CalculatorButton testID="btn-log" label="log" variant="function" small onPress={() => press("log(", true)} />
              <CalculatorButton testID="btn-ln" label="ln" variant="function" small onPress={() => press("ln(", true)} />
            </View>
            <View style={styles.row}>
              <CalculatorButton testID="btn-recip" label="1/x" variant="function" small onPress={() => press("^(-1)", false)} />
              <CalculatorButton testID="btn-fact" label="x!" variant="function" small onPress={() => press("!", false)} />
              <CalculatorButton testID="btn-pi" label="π" variant="function" small onPress={() => press("π", true)} />
              <CalculatorButton testID="btn-e" label="e" variant="function" small onPress={() => press("e", true)} />
              <CalculatorButton testID="btn-percent-sci" label="%" variant="function" small onPress={() => press("%", false)} />
            </View>
          </View>
        ) : null}

        <View style={styles.row}>
          <CalculatorButton testID="btn-clear" label="AC" variant="action" onPress={clearAll} />
          <CalculatorButton testID="btn-open-paren" label="(" variant="action" onPress={() => press("(", true)} />
          <CalculatorButton testID="btn-close-paren" label=")" variant="action" onPress={() => press(")", false)} />
          <CalculatorButton testID="btn-backspace" icon="backspace-outline" variant="action" onPress={backspace} />
        </View>
        <View style={styles.row}>
          <CalculatorButton testID="btn-7" label="7" onPress={() => press("7", true)} />
          <CalculatorButton testID="btn-8" label="8" onPress={() => press("8", true)} />
          <CalculatorButton testID="btn-9" label="9" onPress={() => press("9", true)} />
          <CalculatorButton testID="btn-divide" label="÷" variant="operator" onPress={() => press("÷", false)} />
        </View>
        <View style={styles.row}>
          <CalculatorButton testID="btn-4" label="4" onPress={() => press("4", true)} />
          <CalculatorButton testID="btn-5" label="5" onPress={() => press("5", true)} />
          <CalculatorButton testID="btn-6" label="6" onPress={() => press("6", true)} />
          <CalculatorButton testID="btn-multiply" label="×" variant="operator" onPress={() => press("×", false)} />
        </View>
        <View style={styles.row}>
          <CalculatorButton testID="btn-1" label="1" onPress={() => press("1", true)} />
          <CalculatorButton testID="btn-2" label="2" onPress={() => press("2", true)} />
          <CalculatorButton testID="btn-3" label="3" onPress={() => press("3", true)} />
          <CalculatorButton testID="btn-subtract" label="−" variant="operator" onPress={() => press("-", false)} />
        </View>
        <View style={styles.row}>
          <CalculatorButton testID="btn-negate" label="+/−" variant="action" onPress={toggleSign} />
          <CalculatorButton testID="btn-0" label="0" onPress={() => press("0", true)} />
          <CalculatorButton testID="btn-decimal" label="." onPress={() => press(".", true)} />
          <CalculatorButton testID="btn-add" label="+" variant="operator" onPress={() => press("+", false)} />
        </View>
        <View style={styles.row}>
          <CalculatorButton testID="btn-percent" label="%" variant="action" flex={1} onPress={() => press("%", false)} />
          <CalculatorButton testID="btn-equals" label="=" variant="equals" flex={3} onPress={equals} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  modeSwitch: { flexDirection: "row", borderRadius: radius.md, padding: 4, gap: 4 },
  modeBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.sm + 2 },
  modeText: { fontSize: fontSize.base, fontWeight: "700" },
  headerActions: { flexDirection: "row", gap: spacing.sm },
  hBtn: { width: 40, height: 40, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  display: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  displayScroll: { flexGrow: 1, justifyContent: "flex-end", alignItems: "flex-end", minWidth: "100%" },
  exprText: { fontSize: fontSize.xl, fontWeight: "600", fontFamily: fonts.display, textAlign: "right" },
  resultText: { fontWeight: "800", fontFamily: fonts.display, textAlign: "right" },
  keypad: { paddingHorizontal: spacing.lg, gap: spacing.md },
  sciBlock: { gap: spacing.md },
  row: { flexDirection: "row", gap: spacing.md },
});
