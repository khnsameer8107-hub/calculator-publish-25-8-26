import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ToolCard } from "@/src/components/ToolCard";
import { IconBadge, Screen, SectionTitle } from "@/src/components/ui";
import { TOOLS, TOOLS_BY_ID } from "@/src/data/tools";
import { useAppData } from "@/src/store/AppDataContext";
import { useTheme } from "@/src/theme/ThemeContext";
import { fontSize, radius, shadow, spacing } from "@/src/theme/tokens";

const BANNER_LIGHT =
  "https://images.unsplash.com/photo-1707324148764-99647364afa3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNsZWFuJTIwbWluaW1hbGlzdCUyMGdlb21ldHJpYyUyMHNoYXBlcyUyMG9yYW5nZXxlbnwwfHx8fDE3ODY5MzQ1MzR8MA&ixlib=rb-4.1.0&q=85";

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { favorites, recents } = useAppData();

  const financeTools = useMemo(() => TOOLS.filter((t) => t.category === "finance"), []);
  const converterTools = useMemo(() => TOOLS.filter((t) => t.category === "converter"), []);
  const favTools = favorites.map((id) => TOOLS_BY_ID[id]).filter(Boolean);
  const recentTools = recents.map((r) => TOOLS_BY_ID[r.id]).filter(Boolean);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 110,
        }}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.brand, { color: colors.onSurface }]}>Calc<Text style={{ color: colors.brandPrimary }}>Hub</Text></Text>
            <Text style={[styles.tagline, { color: colors.muted }]}>Every calculator, one place</Text>
          </View>
          <Pressable
            testID="open-settings"
            onPress={() => router.push("/settings")}
            style={[styles.iconBtn, { backgroundColor: colors.surfaceSecondary }]}
          >
            <Ionicons name="settings-outline" size={22} color={colors.onSurface} />
          </Pressable>
        </View>

        {/* Search */}
        <Pressable
          testID="home-search-bar"
          onPress={() => router.push("/search")}
          style={[styles.search, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
        >
          <Ionicons name="search" size={20} color={colors.muted} />
          <Text style={[styles.searchText, { color: colors.muted }]}>
            Search calculator or converter...
          </Text>
        </Pressable>

        {/* Banner + primary CTAs */}
        <View style={styles.section}>
          <View style={[styles.banner, shadow.card]}>
            <Image source={{ uri: BANNER_LIGHT }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
            <View style={styles.bannerOverlay} />
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Fast, private & offline</Text>
              <Text style={styles.bannerSub}>18 tools · works with no internet</Text>
            </View>
          </View>
        </View>

        {/* Quick calculators */}
        <View style={styles.section}>
          <View style={styles.quickRow}>
            <Pressable
              testID="quick-standard"
              onPress={() => router.push("/calculator?mode=standard")}
              style={[styles.quickCard, shadow.soft, { backgroundColor: colors.brandPrimary }]}
            >
              <Ionicons name="calculator" size={28} color={colors.onBrandPrimary} />
              <Text style={[styles.quickTitle, { color: colors.onBrandPrimary }]}>Calculator</Text>
              <Text style={[styles.quickSub, { color: colors.onBrandPrimary }]}>Standard</Text>
            </Pressable>
            <Pressable
              testID="quick-scientific"
              onPress={() => router.push("/calculator?mode=scientific")}
              style={[styles.quickCard, shadow.soft, { backgroundColor: colors.surfaceSecondary }]}
            >
              <IconBadge icon="flask" size={40} />
              <Text style={[styles.quickTitle, { color: colors.onSurface }]}>Scientific</Text>
              <Text style={[styles.quickSub, { color: colors.muted }]}>sin · log · xʸ</Text>
            </Pressable>
            <Pressable
              testID="quick-history"
              onPress={() => router.push("/history")}
              style={[styles.quickCard, shadow.soft, { backgroundColor: colors.surfaceSecondary }]}
            >
              <IconBadge icon="time" size={40} />
              <Text style={[styles.quickTitle, { color: colors.onSurface }]}>History</Text>
              <Text style={[styles.quickSub, { color: colors.muted }]}>Recent math</Text>
            </Pressable>
          </View>
        </View>

        {/* Favorites */}
        {favTools.length > 0 ? (
          <View style={styles.section}>
            <SectionTitle title="Favorites" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: spacing.md }}
            >
              {favTools.map((t) => (
                <ToolCard key={t.id} tool={t} layout="compact" />
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* Recently used */}
        {recentTools.length > 0 ? (
          <View style={styles.section}>
            <SectionTitle title="Recently Used" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: spacing.md }}
            >
              {recentTools.map((t) => (
                <ToolCard key={t.id} tool={t} layout="compact" />
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* Finance */}
        <View style={styles.section}>
          <SectionTitle
            title="Finance"
            action={
              <Pressable testID="see-all-finance" onPress={() => router.push("/finance")}>
                <Text style={[styles.seeAll, { color: colors.brandPrimary }]}>See all</Text>
              </Pressable>
            }
          />
          <View style={{ gap: spacing.md }}>
            {financeTools.map((t) => (
              <ToolCard key={t.id} tool={t} layout="row" />
            ))}
          </View>
        </View>

        {/* Converters */}
        <View style={styles.section}>
          <SectionTitle
            title="Converters"
            action={
              <Pressable testID="see-all-converters" onPress={() => router.push("/converters")}>
                <Text style={[styles.seeAll, { color: colors.brandPrimary }]}>See all</Text>
              </Pressable>
            }
          />
          <View style={styles.grid}>
            {converterTools.slice(0, 6).map((t) => (
              <View key={t.id} style={styles.gridCell}>
                <ToolCard tool={t} layout="grid" />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  brand: { fontSize: fontSize["3xl"], fontWeight: "900", letterSpacing: -0.5 },
  tagline: { fontSize: fontSize.sm, fontWeight: "500", marginTop: 2 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.lg,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  searchText: { fontSize: fontSize.base, fontWeight: "500" },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
  banner: {
    height: 120,
    borderRadius: radius.lg,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.32)",
  },
  bannerContent: { padding: spacing.lg },
  bannerTitle: { color: "#fff", fontSize: fontSize.xl, fontWeight: "900" },
  bannerSub: { color: "rgba(255,255,255,0.9)", fontSize: fontSize.sm, fontWeight: "600", marginTop: 2 },
  quickRow: { flexDirection: "row", gap: spacing.md },
  quickCard: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    minHeight: 120,
    justifyContent: "space-between",
  },
  quickTitle: { fontSize: fontSize.base, fontWeight: "800" },
  quickSub: { fontSize: fontSize.sm, fontWeight: "500" },
  seeAll: { fontSize: fontSize.base, fontWeight: "700" },
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -spacing.sm },
  gridCell: { width: "50%", padding: spacing.sm },
});
