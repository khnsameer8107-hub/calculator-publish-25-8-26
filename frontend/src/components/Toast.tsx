import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/src/theme/ThemeContext";
import { fontSize, radius, spacing } from "@/src/theme/tokens";

type ToastValue = {
  show: (message: string, icon?: keyof typeof Ionicons.glyphMap) => void;
  copy: (value: string, label?: string) => Promise<void>;
};

const ToastContext = createContext<ToastValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState<keyof typeof Ionicons.glyphMap>("checkmark-circle");
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (msg: string, ic: keyof typeof Ionicons.glyphMap = "checkmark-circle") => {
      setMessage(msg);
      setIcon(ic);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
      ]).start();
      hideTimer.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 20, duration: 220, useNativeDriver: true }),
        ]).start();
      }, 1600);
    },
    [opacity, translateY],
  );

  const copy = useCallback(
    async (value: string, label = "Copied to clipboard") => {
      await Clipboard.setStringAsync(value);
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      show(label, "copy");
    },
    [show],
  );

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ show, copy }}>
      {children}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.wrap,
          { bottom: insets.bottom + 90, opacity, transform: [{ translateY }] },
        ]}
      >
        <View
          style={[
            styles.toast,
            { backgroundColor: colors.surfaceInverse },
          ]}
        >
          <Ionicons name={icon} size={18} color={colors.brandPrimary} />
          <Text style={[styles.text, { color: colors.onSurfaceInverse }]} numberOfLines={2}>
            {message}
          </Text>
        </View>
      </Animated.View>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    maxWidth: "100%",
  },
  text: {
    fontSize: fontSize.base,
    fontWeight: "600",
    flexShrink: 1,
  },
});
