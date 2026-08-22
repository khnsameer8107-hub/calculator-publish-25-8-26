import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useTheme } from "@/src/theme/ThemeContext";
import { fontSize, spacing } from "@/src/theme/tokens";

export type DonutSegment = { value: number; color: string; label: string };

export function DonutChart({
  segments,
  size = 180,
  strokeWidth = 26,
  centerLabel,
  centerValue,
}: {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const { colors } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((s, seg) => s + Math.max(0, seg.value), 0) || 1;

  let offset = 0;

  return (
    <View style={{ alignItems: "center", gap: spacing.md }}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.surfaceTertiary}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {segments.map((seg, idx) => {
            const frac = Math.max(0, seg.value) / total;
            const dash = frac * circumference;
            const el = (
              <Circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={seg.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                rotation={-90}
                origin={`${size / 2}, ${size / 2}`}
              />
            );
            offset += dash;
            return el;
          })}
        </Svg>
        <View style={styles.center}>
          {centerLabel ? (
            <Text style={[styles.centerLabel, { color: colors.muted }]}>{centerLabel}</Text>
          ) : null}
          {centerValue ? (
            <Text style={[styles.centerValue, { color: colors.onSurface }]} numberOfLines={1}>
              {centerValue}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.legend}>
        {segments.map((seg, idx) => (
          <View key={idx} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: seg.color }]} />
            <Text style={[styles.legendText, { color: colors.onSurface }]}>{seg.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  centerLabel: { fontSize: fontSize.sm, fontWeight: "600" },
  centerValue: { fontSize: fontSize.xl, fontWeight: "800" },
  legend: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: spacing.lg },
  legendItem: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  dot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: fontSize.base, fontWeight: "600" },
});
