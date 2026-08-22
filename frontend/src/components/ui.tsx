import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/src/theme/ThemeContext";
import { fontSize, radius, shadow, spacing } from "@/src/theme/tokens";
import { useAppData } from "@/src/store/AppDataContext";

// ---------- Screen wrappers ----------

export function Screen({
  children,
  style,
  edges = ["top"],
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: ("top" | "bottom" | "left" | "right")[];
}) {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      edges={edges}
      style={[{ flex: 1, backgroundColor: colors.surface }, style]}
    >
      {children}
    </SafeAreaView>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  showBack,
  right,
}: {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
}) {
  const { colors } = useTheme();
  const router = useRouter();
  return (
    <View
      style={[
        styles.header,
        { backgroundColor: colors.surface, borderBottomColor: colors.divider },
      ]}
    >
      <View style={styles.headerLeft}>
        {showBack ? (
          <Pressable
            testID="header-back-button"
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => [
              styles.backBtn,
              { backgroundColor: colors.surfaceSecondary, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
          </Pressable>
        ) : null}
        <View style={{ flexShrink: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.onSurface }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.headerSubtitle, { color: colors.muted }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

// Form screen: header + keyboard-aware scroll content.
export function FormScreen({
  title,
  subtitle,
  toolId,
  children,
  contentStyle,
}: {
  title: string;
  subtitle?: string;
  toolId?: string;
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Screen>
      <ScreenHeader
        title={title}
        subtitle={subtitle}
        showBack
        right={toolId ? <FavoriteButton toolId={toolId} /> : undefined}
      />
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: colors.surface }}
        contentContainerStyle={[
          { padding: spacing.lg, paddingBottom: insets.bottom + spacing.xxxl, gap: spacing.lg },
          contentStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={spacing.xl}
      >
        {children}
      </KeyboardAwareScrollView>
    </Screen>
  );
}

// ---------- Card ----------

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        shadow.soft,
        { backgroundColor: colors.surfaceSecondary },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// ---------- Icon badge ----------

export function IconBadge({
  icon,
  size = 44,
  color,
  bg,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  bg?: string;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius.md,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bg ?? colors.brandTertiary,
      }}
    >
      <Ionicons name={icon} size={size * 0.5} color={color ?? colors.brandPrimary} />
    </View>
  );
}

// ---------- Field (labeled input) ----------

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  suffix,
  autoFocus,
  testID,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "decimal-pad" | "number-pad";
  suffix?: string;
  autoFocus?: boolean;
  testID?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
      <View
        style={[
          styles.inputWrap,
          { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
        ]}
      >
        <TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          style={[styles.input, { color: colors.onSurface }]}
        />
        {suffix ? (
          <Text style={[styles.suffix, { color: colors.muted }]}>{suffix}</Text>
        ) : null}
      </View>
    </View>
  );
}

// ---------- Segmented control ----------

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  testID,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  testID?: string;
}) {
  const { colors } = useTheme();
  return (
    <View
      testID={testID}
      style={[styles.segment, { backgroundColor: colors.surfaceTertiary }]}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            testID={`${testID ?? "segment"}-${opt.value}`}
            onPress={() => {
              if (Platform.OS !== "web")
                Haptics.selectionAsync().catch(() => {});
              onChange(opt.value);
            }}
            style={[
              styles.segmentItem,
              active && { backgroundColor: colors.surfaceSecondary },
              active && shadow.soft,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                { color: active ? colors.brandPrimary : colors.muted },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------- Chip ----------

export function Chip({
  label,
  active,
  onPress,
  testID,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
  testID?: string;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? colors.brandPrimary : colors.surfaceSecondary,
          borderColor: active ? colors.brandPrimary : colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          { color: active ? colors.onBrandPrimary : colors.onSurface },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ---------- Primary button ----------

export function PrimaryButton({
  label,
  onPress,
  icon,
  variant = "primary",
  testID,
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "primary" | "secondary";
  testID?: string;
}) {
  const { colors } = useTheme();
  const isPrimary = variant === "primary";
  return (
    <Pressable
      testID={testID}
      onPress={() => {
        if (Platform.OS !== "web")
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [
        styles.primaryBtn,
        {
          backgroundColor: isPrimary ? colors.brandPrimary : colors.surfaceTertiary,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={20}
          color={isPrimary ? colors.onBrandPrimary : colors.onSurface}
        />
      ) : null}
      <Text
        style={[
          styles.primaryBtnText,
          { color: isPrimary ? colors.onBrandPrimary : colors.onSurface },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ---------- Result card & row ----------

export function ResultCard({
  label,
  value,
  accent,
  testID,
}: {
  label: string;
  value: string;
  accent?: boolean;
  testID?: string;
}) {
  const { colors } = useTheme();
  return (
    <View
      testID={testID}
      style={[
        styles.resultCard,
        {
          backgroundColor: accent ? colors.brandPrimary : colors.brandTertiary,
        },
      ]}
    >
      <Text
        style={[
          styles.resultLabel,
          { color: accent ? colors.onBrandPrimary : colors.onBrandTertiary },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.resultValue,
          { color: accent ? colors.onBrandPrimary : colors.brandPrimary },
        ]}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

export function ResultRow({
  label,
  value,
  strong,
  color,
  testID,
}: {
  label: string;
  value: string;
  strong?: boolean;
  color?: string;
  testID?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.resultRow, { borderBottomColor: colors.divider }]} testID={testID}>
      <Text style={[styles.rowLabel, { color: colors.muted }]}>{label}</Text>
      <Text
        style={[
          styles.rowValue,
          {
            color: color ?? colors.onSurface,
            fontWeight: strong ? "800" : "600",
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

// ---------- Favorite button ----------

export function FavoriteButton({ toolId }: { toolId: string }) {
  const { colors } = useTheme();
  const { isFavorite, toggleFavorite } = useAppData();
  const fav = isFavorite(toolId);
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      testID={`favorite-toggle-${toolId}`}
      hitSlop={12}
      onPress={() => {
        if (Platform.OS !== "web")
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.3, duration: 120, useNativeDriver: true }),
          Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
        ]).start();
        toggleFavorite(toolId);
      }}
      style={({ pressed }) => [
        styles.favBtn,
        { backgroundColor: colors.surfaceSecondary, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={fav ? "star" : "star-outline"}
          size={20}
          color={fav ? colors.brandPrimary : colors.muted}
        />
      </Animated.View>
    </Pressable>
  );
}

// ---------- Empty state ----------

export function EmptyState({
  icon,
  title,
  message,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.empty}>
      <IconBadge icon={icon} size={64} />
      <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>{title}</Text>
      <Text style={[styles.emptyMsg, { color: colors.muted }]}>{message}</Text>
    </View>
  );
}

// ---------- Section title ----------

export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionTitle}>
      <Text style={[styles.sectionTitleText, { color: colors.onSurface }]}>{title}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flexShrink: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: fontSize.xl, fontWeight: "800" },
  headerSubtitle: { fontSize: fontSize.sm, fontWeight: "500", marginTop: 2 },
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  label: { fontSize: fontSize.sm, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    minHeight: 54,
  },
  input: { flex: 1, fontSize: fontSize.xl, fontWeight: "700", paddingVertical: spacing.md },
  suffix: { fontSize: fontSize.base, fontWeight: "700", marginLeft: spacing.sm },
  segment: {
    flexDirection: "row",
    borderRadius: radius.md,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: radius.sm + 2,
  },
  segmentText: { fontSize: fontSize.base, fontWeight: "700" },
  chip: {
    paddingHorizontal: spacing.lg,
    height: 40,
    justifyContent: "center",
    borderRadius: radius.pill,
    borderWidth: 1,
    flexShrink: 0,
  },
  chipText: { fontSize: fontSize.base, fontWeight: "700" },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    height: 56,
    borderRadius: radius.md,
  },
  primaryBtnText: { fontSize: fontSize.lg, fontWeight: "800" },
  resultCard: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.xs,
  },
  resultLabel: { fontSize: fontSize.sm, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  resultValue: { fontSize: fontSize["3xl"], fontWeight: "800" },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
  },
  rowLabel: { fontSize: fontSize.base, fontWeight: "500", flexShrink: 1 },
  rowValue: { fontSize: fontSize.lg },
  favBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: "800" },
  emptyMsg: { fontSize: fontSize.base, textAlign: "center", lineHeight: 20 },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  sectionTitleText: { fontSize: fontSize.xl, fontWeight: "800" },
});
