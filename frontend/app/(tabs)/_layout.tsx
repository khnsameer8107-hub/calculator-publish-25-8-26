import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/src/theme/ThemeContext";
import { radius, shadow, spacing } from "@/src/theme/tokens";

const TABS: {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}[] = [
  { name: "index", label: "Home", icon: "home-outline", activeIcon: "home" },
  { name: "calculator", label: "Calculator", icon: "calculator-outline", activeIcon: "calculator" },
  { name: "finance", label: "Finance", icon: "wallet-outline", activeIcon: "wallet" },
  { name: "converters", label: "Convert", icon: "swap-horizontal-outline", activeIcon: "swap-horizontal" },
];

function CustomTabBar({ state, navigation }: { state: any; navigation: any }) {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom || spacing.md }]}>
      <View style={[styles.bar, shadow.card, { borderColor: colors.border }]}>
        <BlurView
          intensity={Platform.OS === "ios" ? 40 : 24}
          tint={scheme === "dark" ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor:
                scheme === "dark" ? "rgba(28,28,30,0.82)" : "rgba(255,255,255,0.82)",
              borderRadius: radius.lg,
            },
          ]}
        />
        {state.routes
          .filter((r: any) => TABS.some((t) => t.name === r.name))
          .map((route: any) => {
            const tab = TABS.find((t) => t.name === route.name)!;
            const routeIndex = state.routes.findIndex((r: any) => r.key === route.key);
            const focused = state.index === routeIndex;
            return (
              <Pressable
                key={route.key}
                testID={`tab-${tab.name}`}
                style={styles.tab}
                onPress={() => {
                  if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
                  const event = navigation.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}
              >
                <Ionicons
                  name={focused ? tab.activeIcon : tab.icon}
                  size={24}
                  color={focused ? colors.brandPrimary : colors.muted}
                />
                <Text
                  style={[
                    styles.label,
                    { color: focused ? colors.brandPrimary : colors.muted },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="calculator" />
      <Tabs.Screen name="finance" />
      <Tabs.Screen name="converters" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
  },
  bar: {
    flexDirection: "row",
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    paddingVertical: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: spacing.xs,
  },
  label: { fontSize: 11, fontWeight: "700" },
});
