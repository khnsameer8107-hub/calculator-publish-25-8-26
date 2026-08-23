import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ColorPalette } from "@/src/theme/colors";
import { useTheme } from "@/src/theme/ThemeContext";
import { fontSize, radius, spacing } from "@/src/theme/tokens";

type Props = { colors: ColorPalette; children: React.ReactNode };
type State = { hasError: boolean; message: string };

// Top-level safety net so a render error in any screen never white-screens
// the whole app. Users can recover without restarting.
class Boundary extends React.Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }

  componentDidCatch(error: unknown) {
    // Keep it local — no external reporting.
    console.warn("[ErrorBoundary]", error);
  }

  reset = () => this.setState({ hasError: false, message: "" });

  render() {
    const { colors, children } = this.props;
    if (!this.state.hasError) return children;
    return (
      <View style={[styles.wrap, { backgroundColor: colors.surface }]}>
        <View
          style={[styles.badge, { backgroundColor: colors.brandTertiary }]}
        >
          <Ionicons name="warning-outline" size={40} color={colors.brandPrimary} />
        </View>
        <Text style={[styles.title, { color: colors.onSurface }]}>Something went wrong</Text>
        <Text style={[styles.msg, { color: colors.muted }]}>
          The screen ran into an unexpected error. Your data is safe on your device.
          Tap below to continue.
        </Text>
        <Pressable
          testID="error-boundary-retry"
          onPress={this.reset}
          style={[styles.btn, { backgroundColor: colors.brandPrimary }]}
        >
          <Ionicons name="refresh" size={20} color={colors.onBrandPrimary} />
          <Text style={[styles.btnText, { color: colors.onBrandPrimary }]}>Try again</Text>
        </Pressable>
      </View>
    );
  }
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return <Boundary colors={colors}>{children}</Boundary>;
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl, gap: spacing.lg },
  badge: { width: 80, height: 80, borderRadius: radius.lg, alignItems: "center", justifyContent: "center" },
  title: { fontSize: fontSize.xl, fontWeight: "800" },
  msg: { fontSize: fontSize.base, textAlign: "center", lineHeight: 20 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    height: 52,
    borderRadius: radius.md,
  },
  btnText: { fontSize: fontSize.lg, fontWeight: "800" },
});
