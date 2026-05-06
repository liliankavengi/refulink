import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Polyline, Line, Rect, LinearGradient, Stop } from "react-native-svg";
import React from "react";

const { width } = Dimensions.get('window');
const ORANGE = "#FF5722";
const ORANGE_LIGHT = "#FF8A65";
const ORANGE_DARK = "#E64A19";
const DARK_BG = "#1A1A2E";
const CARD_BG = "#16213E";
const GREEN = "#4CAF50";

// ── Enhanced SVG Icons ────────────────────────────────────────────────────────

function IconHome({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Polyline points="9 22 9 12 15 12 15 22" />
    </Svg>
  );
}

function IconScan({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <Path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <Path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <Path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <Line x1="3" y1="12" x2="21" y2="12" />
    </Svg>
  );
}

function IconHistory({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 3v5h5" />
      <Path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
      <Path d="M12 7v5l4 2" />
    </Svg>
  );
}

function IconUser({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

function IconGlobe({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Line x1="2" y1="12" x2="22" y2="12" />
      <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Svg>
  );
}

function IconCheck({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" fill={color} opacity="0.1" />
      <Polyline points="16 10 11 15 8 12" />
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

function IconVault({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="2" y="4" width="20" height="16" rx="2" />
      <Circle cx="12" cy="12" r="3" />
      <Path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
    </Svg>
  );
}

function IconTrendUp({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <Polyline points="17 6 23 6 23 12" />
    </Svg>
  );
}

function IconNotification({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Svg>
  );
}

// ── Dashboard Component ───────────────────────────────────────────────────────

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const balanceScale = useRef(new Animated.Value(0.9)).current;
  const cardsSlide = useRef(new Animated.Value(30)).current;
  const quickActionsSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(fadeAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(balanceScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(cardsSlide, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(quickActionsSlide, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DARK_BG} />
      
      {/* Background Gradient */}
      <ExpoLinearGradient
        colors={[DARK_BG, '#16213E', '#0F3460']}
        style={styles.background}
      />
      
      {/* Background decor */}
      <View style={styles.bgDecor}>
        <View style={[styles.bgCircle, styles.bgCircle1]} />
        <View style={[styles.bgCircle, styles.bgCircle2]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Top Bar */}
        <Animated.View style={[
          styles.topBar,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <View style={styles.topBarLeft}>
            <View style={styles.brandIcon}>
              <IconVault color={ORANGE} size={24} />
            </View>
            <View>
              <Text style={styles.brandName}>REF-M-LINK</Text>
              <Text style={styles.brandSubtitle}>Wallet</Text>
            </View>
          </View>
          
          <View style={styles.topBarRight}>
            <Pressable 
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.iconButtonPressed
              ]}
            >
              <IconNotification color={ORANGE} size={20} />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </Pressable>
            <Pressable 
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.iconButtonPressed
              ]}
            >
              <IconGlobe color={ORANGE} size={20} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={ORANGE}
              colors={[ORANGE]}
            />
          }
        >
          {/* Balance Card */}
          <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ scale: balanceScale }]
          }}>
            <View style={styles.balanceCard}>
              <ExpoLinearGradient
                colors={[CARD_BG, '#1E2A4A']}
                style={styles.balanceCardGradient}
              >
                <View style={styles.balanceHeader}>
                  <View>
                    <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
                    <Text style={styles.balanceAmount}>KES 12,500.00</Text>
                  </View>
                  <View style={styles.balanceTrend}>
                    <IconTrendUp color={GREEN} size={16} />
                    <Text style={styles.trendText}>+2.4%</Text>
                  </View>
                </View>

                <View style={styles.balanceDivider} />

                <View style={styles.balanceFooter}>
                  <View style={styles.verifiedBadge}>
                    <IconCheck color={GREEN} size={14} />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>

                  <Pressable style={styles.scoreButton}>
                    <Text style={styles.scoreText}>Score: B+</Text>
                    <IconChevronRight color={ORANGE} size={14} />
                  </Pressable>
                </View>
              </ExpoLinearGradient>
            </View>
          </Animated.View>

          {/* Action Buttons - Right below balance card */}
          <Animated.View style={[
            styles.actionRow,
            {
              opacity: fadeAnim,
              transform: [{ translateY: quickActionsSlide }]
            }
          ]}>
            <Pressable
              onPress={() => navigation.navigate("DepositOptions")}
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.actionButtonPressed,
              ]}
            >
              <ExpoLinearGradient
                colors={[ORANGE, ORANGE_DARK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
              >
                <Text style={styles.actionText}>Deposit</Text>
              </ExpoLinearGradient>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("Send")}
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.actionButtonPressed,
              ]}
            >
              <View style={styles.actionSend}>
                <Text style={styles.actionSendText}>Send</Text>
              </View>
            </Pressable>
          </Animated.View>

          {/* Recent Activity - Now below action buttons */}
          <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ translateY: cardsSlide }]
          }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <Pressable>
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            </View>
            
            <View style={styles.activityList}>
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Text style={styles.activityEmoji}>💰</Text>
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>Deposit Received</Text>
                  <Text style={styles.activityDate}>Today, 2:30 PM</Text>
                </View>
                <Text style={styles.activityAmount}>+KES 5,000</Text>
              </View>
              
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Text style={styles.activityEmoji}>📤</Text>
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>Sent to John</Text>
                  <Text style={styles.activityDate}>Yesterday</Text>
                </View>
                <Text style={[styles.activityAmount, styles.activitySent]}>-KES 2,500</Text>
              </View>
            </View>
          </Animated.View>

          {/* Vault Quick Access - Now below recent activity */}
          <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ translateY: cardsSlide }]
          }}>
            <Pressable
              onPress={() => navigation.navigate("Vault")}
              style={({ pressed }) => [
                styles.vaultCard,
                pressed && styles.vaultCardPressed,
              ]}
            >
              <ExpoLinearGradient
                colors={[ORANGE + '15', ORANGE + '05']}
                style={styles.vaultGradient}
              >
                <View style={styles.vaultLeft}>
                  <View style={styles.vaultIconBox}>
                    <IconVault color={ORANGE} size={28} />
                  </View>
                  <View style={styles.vaultText}>
                    <Text style={styles.vaultTitle}>REF-M-LINK VAULT</Text>
                    <Text style={styles.vaultSub}>Save, earn & borrow with trust</Text>
                  </View>
                </View>
                <View style={styles.vaultRight}>
                  <View style={styles.vaultBadge}>
                    <Text style={styles.vaultBadgeText}>NEW</Text>
                  </View>
                  <IconChevronRight color={ORANGE} size={24} />
                </View>
              </ExpoLinearGradient>
            </Pressable>
          </Animated.View>

          {/* Quick Stats */}
          <Animated.View style={[
            styles.statsRow,
            {
              opacity: fadeAnim,
              transform: [{ translateY: cardsSlide }]
            }
          ]}>
            <View style={styles.statCard}>
              <View style={styles.statIconBox}>
                <IconVault color={ORANGE} size={20} />
              </View>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Vouch Count</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIconBox, styles.statIconBoxGreen]}>
                <IconTrendUp color={GREEN} size={20} />
              </View>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIconBox, styles.statIconBoxBlue]}>
                <IconCheck color="#2196F3" size={20} />
              </View>
              <Text style={styles.statValue}>98%</Text>
              <Text style={styles.statLabel}>Trust Score</Text>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  bgDecor: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: ORANGE,
  },
  bgCircle1: {
    width: 300,
    height: 300,
    top: -50,
    right: -100,
    opacity: 0.03,
  },
  bgCircle2: {
    width: 200,
    height: 200,
    bottom: 200,
    left: -80,
    opacity: 0.02,
  },
  safeArea: {
    flex: 1,
  },
  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ORANGE + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
  },
  brandSubtitle: {
    color: '#666',
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: 2,
  },
  topBarRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  iconButtonPressed: {
    backgroundColor: '#2A2A3E',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: "bold",
  },
  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 24,
  },
  // Balance Card
  balanceCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
    top: 10,
  },
  balanceCardGradient: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceLabel: {
    color: '#999',
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: 1,
  },
  balanceTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: GREEN + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  trendText: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "700",
  },
  balanceDivider: {
    height: 1,
    backgroundColor: '#2A2A3E',
    marginVertical: 16,
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: GREEN + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  verifiedText: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "600",
  },
  scoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ORANGE + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scoreText: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: "600",
  },
  // Action Buttons
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  actionButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  actionGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  actionSend: {
    paddingVertical: 16,
    alignItems: 'center',
    gap: 6,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  actionSendText: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // Recent Activity
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "700",
  },
  seeAllText: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: "600",
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    gap: 12,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#2A2A3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityEmoji: {
    fontSize: 20,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "600",
  },
  activityDate: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  activityAmount: {
    color: GREEN,
    fontSize: 14,
    fontWeight: "700",
  },
  activitySent: {
    color: ORANGE,
  },
  // Vault Card
  vaultCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ORANGE + '30',
  },
  vaultCardPressed: {
    borderColor: ORANGE,
  },
  vaultGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vaultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  vaultIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: ORANGE + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ORANGE + '30',
  },
  vaultText: {
    gap: 4,
  },
  vaultTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  vaultSub: {
    color: ORANGE,
    fontSize: 11,
    fontWeight: "600",
  },
  vaultRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vaultBadge: {
    backgroundColor: ORANGE,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  vaultBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ORANGE + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconBoxGreen: {
    backgroundColor: GREEN + '15',
  },
  statIconBoxBlue: {
    backgroundColor: '#2196F3' + '15',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    color: '#666',
    fontSize: 8,
    fontWeight: "600",
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});