import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path, Circle, Polyline, Line, Rect } from "react-native-svg";

const ORANGE = "#FF5722";

// ── Inline SVG icons (Lucide paths) ──────────────────────────────────────────

function IconHome({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Polyline points="9 22 9 12 15 12 15 22" />
    </Svg>
  );
}

function IconScan({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <Path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <Path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <Path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <Line x1="3" y1="12" x2="21" y2="12" />
    </Svg>
  );
}

function IconHistory({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 3v5h5" />
      <Path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
      <Path d="M12 7v5l4 2" />
    </Svg>
  );
}

function IconUser({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

function IconGlobe({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Line x1="2" y1="12" x2="22" y2="12" />
      <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Svg>
  );
}

function IconCheck({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Polyline points="22 4 12 14.01 9 11.01" />
    </Svg>
  );
}

function IconChevronRight({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="9 18 15 12 9 6" />
    </Svg>
  );
}

function IconVault({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="2" y="4" width="20" height="16" rx="2" />
      <Circle cx="12" cy="12" r="3" />
      <Path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
    </Svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

type Tab = "home" | "scan" | "history" | "profile";

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const navigation = useNavigation<any>();

  const navTabs: { key: Tab; Icon: React.FC<{ color: string }>; route?: string }[] = [
    { key: "home",    Icon: IconHome },
    { key: "scan",    Icon: IconScan,    route: "Scan" },
    { key: "history", Icon: IconHistory, route: "History" },
    { key: "profile", Icon: IconUser,    route: "Profile" },
  ];

  return (
    <SafeAreaView style={styles.screen}>

      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.brandName}>REFULINK</Text>
        <Pressable style={({ pressed }) => pressed && { opacity: 0.6 }}>
          <IconGlobe color={ORANGE} />
        </Pressable>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Wallet Balance</Text>
          <Text style={styles.balanceAmount}>KES 12,500.00</Text>

          <View style={styles.divider} />

          <View style={styles.verifiedRow}>
            <IconCheck color={ORANGE} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>

          <Pressable style={styles.scoreRow}>
            <Text style={styles.scoreText}>Portability Score: B+</Text>
            <IconChevronRight color={ORANGE} size={16} />
          </Pressable>
        </View>

        {/* Trust Metrics */}
        <View style={styles.trustCard}>
          <Text style={styles.trustLabel}>Social Vouch Count</Text>
          <Text style={styles.trustValue}>4</Text>
        </View>

        {/* Vault Quick Access */}
        <Pressable
          onPress={() => navigation.navigate("Vault")}
          style={({ pressed }) => [
            styles.vaultCard,
            pressed && styles.cardPressed,
          ]}
        >
          <View style={styles.vaultLeft}>
            <View style={styles.vaultIconBox}>
              <IconVault color={ORANGE} />
            </View>
            <View style={styles.vaultText}>
              <Text style={styles.vaultTitle}>Refulink Vault</Text>
              <Text style={styles.vaultSub}>Save & Borrow</Text>
            </View>
          </View>
          <IconChevronRight color={ORANGE} size={20} />
        </Pressable>

        {/* Action Hub */}
        <View style={styles.actionRow}>
          <Pressable
            onPress={() => navigation.navigate("Deposit")}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionButtonPressed,
            ]}
          >
            <Text style={styles.actionButtonText}>Deposit</Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("Send")}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionButtonPressed,
            ]}
          >
            <Text style={styles.actionButtonText}>Send</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {navTabs.map(({ key, Icon, route }) => (
          <Pressable
            key={key}
            onPress={() => {
              setActiveTab(key);
              if (route) navigation.navigate(route);
            }}
            style={styles.navItem}
          >
            <Icon color={activeTab === key ? ORANGE : "#404040"} />
          </Pressable>
        ))}
      </View>

    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000000",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  brandName: {
    color: ORANGE,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 100, // clears bottom nav
    gap: 24,
  },

  // Balance Card
  balanceCard: {
    borderWidth: 2,
    borderColor: ORANGE,
    borderRadius: 16,
    padding: 24,
    gap: 8,
  },
  balanceLabel: {
    color: "#B0B0B0",
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#1A1A1A",
    marginVertical: 12,
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  verifiedText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  scoreText: {
    color: ORANGE,
    fontSize: 14,
  },

  // Trust Card
  trustCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  trustLabel: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  trustValue: {
    color: ORANGE,
    fontSize: 20,
    fontWeight: "700",
  },

  // Vault Card
  vaultCard: {
    borderWidth: 2,
    borderColor: ORANGE,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardPressed: {
    backgroundColor: "rgba(255, 87, 34, 0.05)",
  },
  vaultLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  vaultIconBox: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 87, 34, 0.2)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  vaultText: {
    gap: 4,
  },
  vaultTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  vaultSub: {
    color: ORANGE,
    fontSize: 14,
    fontWeight: "600",
  },

  // Action Buttons
  actionRow: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: ORANGE,
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
  },
  actionButtonPressed: {
    backgroundColor: ORANGE,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#1A1A1A",
    backgroundColor: "#000000",
  },
  navItem: {
    padding: 8,
  },
});