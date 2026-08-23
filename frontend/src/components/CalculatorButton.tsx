import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text } from "react-native";

import { useTheme } from "@/src/theme/ThemeContext";
import { fonts, fontSize, radius } from "@/src/theme/tokens";

export type ButtonVariant = "number" | "operator" | "action" | "equals" | "function";

export function CalculatorButton({
  label,
  icon,
  onPress,
  variant = "number",
  flex = 1,
  small,
  testID,
}: {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: ButtonVariant;
  flex?: number;
  small?: boolean;
  testID?: string;
}) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const bg = {
    number: colors.surfaceSecondary,
    operator: colors.brandTertiary,
    action: colors.surfaceTertiary,
    equals: colors.brandPrimary,
    function: colors.surfaceTertiary,
  }[variant];

  const fg = {
    number: colors.onSurface,
    operator: colors.brandPrimary,
    action: colors.onSurface,
    equals: colors.onBrandPrimary,
    function: colors.onSurface,
  }[variant];

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, speed: 50 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  return (
    <Animated.View style={{ flex, transform: [{ scale }] }}>
      <Pressable
        testID={testID}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => {
          if (Platform.OS !== "web") {
            const style =
              variant === "equals"
                ? Haptics.ImpactFeedbackStyle.Medium
                : Haptics.ImpactFeedbackStyle.Light;
            Haptics.impactAsync(style).catch(() => {});
          }
          onPress();
        }}
        style={[styles.btn, { backgroundColor: bg }]}
      >
        {icon ? (
          <Ionicons name={icon} size={small ? 22 : 26} color={fg} />
        ) : (
          <Text
            style={[
              styles.label,
              {
                color: fg,
                fontSize: small ? fontSize.lg : fontSize["2xl"],
                fontFamily: variant === "number" || variant === "equals" ? fonts.display : undefined,
              },
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 4,
  },
  label: { fontWeight: "700" },
});
