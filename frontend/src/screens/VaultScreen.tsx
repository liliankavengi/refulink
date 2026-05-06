import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Rect, Line, Polyline, Defs, LinearGradient, Stop } from "react-native-svg";
import Slider from "@react-native-community/slider";
import { getTrustScore, type TrustScoreResponse } from "../services/trustService";
import { getBalance } from "../services/walletService";

const { width } = Dimensions.get('window');
const ORANGE = "#FF5722";
const ORANGE_LIGHT = "#FF8A65";
const ORANGE_DARK = "#E64A19";
const DARK_BG = "#1A1A2E";
const CARD_BG = "#16213E";
const GREEN = "#4CAF50";

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function IconChevronLeft({ color = "#FFFFFF", size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 18l-6-6 6-6" />
    </Svg>
  );
}

function IconTrendingUp({ color = ORANGE, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <Polyline points="17 6 23 6 23 12" />
    </Svg>
  );
}

function IconLock({ color = ORANGE, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );
}

function IconShield({ color = "#666", size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );
}

function IconVault({ color = ORANGE, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="2" y="4" width="20" height="16" rx="2" />
      <Circle cx="12" cy="12" r="3" />
      <Path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
    </Svg>
  );
}

function IconArrowDown({ color = "#FFFFFF", size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="12" y1="5" x2="12" y2="19" />
      <Polyline points="19 12 12 19 5 12" />
    </Svg>
  );
}

function IconArrowUp({ color = "#FFFFFF", size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="12" y1="19" x2="12" y2="5" />
      <Polyline points="5 12 12 5 19 12" />
    </Svg>
  );
}

function IconDollarSign({ color = ORANGE, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="12" y1="1" x2="12" y2="23" />
      <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </Svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type VaultMode = "save" | "borrow";

// ── Component ─────────────────────────────────────────────────────────────────

export default function VaultScreen() {
  const [activeMode, setActiveMode] = useState<VaultMode>("save");
  const [loanAmount, setLoanAmount] = useState(500);
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [maxCredit, setMaxCredit] = useState(5000);
  const [vouchCount, setVouchCount] = useState(0);
  const navigation = useNavigation<any>();

  const apy = 4.5;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const chartAnim = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(20)).current;

  const chartData = [300, 310, 320, 325, 330, 340, 350];

  useEffect(() => {
    Animated.sequence([
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
      Animated.timing(chartAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.spring(contentSlide, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Fetch live trust data & balance
    (async () => {
      try {
        const ts = await getTrustScore();
        setMaxCredit(ts.credit_limit_kes || 5000);
        setVouchCount(ts.vouches);
      } catch {}

      try {
        const bal = await getBalance();
        setSavingsBalance(bal.kes_balance);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    // Re-animate chart when mode changes
    chartAnim.setValue(0);
    Animated.timing(chartAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [activeMode]);

  const calculateRepayment = (amount: number) => {
    const interest = amount * 0.05;
    const total = amount + interest;
    return {
      principal: amount,
      interest: interest,
      total: total,
      period: "30 days",
    };
  };

  const repayment = calculateRepayment(loanAmount);

  const ChartBar = ({ value, index, maxValue }: { value: number; index: number; maxValue: number }) => {
    const height = chartAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, (value / maxValue) * 100],
    });

    return (
      <View style={styles.chartBar}>
        <Animated.View style={[
          styles.chartBarFill,
          { height: height }
        ]}>
          <ExpoLinearGradient
            colors={[ORANGE, ORANGE_DARK]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.chartBarGradient}
          />
        </Animated.View>
      </View>
    );
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
        {/* Header */}
        <Animated.View style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backButtonPressed,
              ]}
            >
              <IconChevronLeft size={24} />
            </Pressable>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>REF-M-LINK Vault</Text>
              <Text style={styles.headerSubtitle}>
                Save & Borrow with trust
              </Text>
            </View>
            <View style={styles.vaultIcon}>
              <IconVault size={20} />
            </View>
          </View>
        </Animated.View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[
            styles.content,
            { opacity: fadeAnim }
          ]}>
            {/* Mode Toggle */}
            <View style={styles.toggleContainer}>
              <View style={styles.toggle}>
                <Pressable
                  onPress={() => setActiveMode("save")}
                  style={[
                    styles.toggleButton,
                    activeMode === "save" && styles.toggleButtonActive,
                  ]}
                >
                  <Text style={[
                    styles.toggleText,
                    activeMode === "save" && styles.toggleTextActive,
                  ]}>
                    SAVE
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveMode("borrow")}
                  style={[
                    styles.toggleButton,
                    activeMode === "borrow" && styles.toggleButtonActive,
                  ]}
                >
                  <Text style={[
                    styles.toggleText,
                    activeMode === "borrow" && styles.toggleTextActive,
                  ]}>
                    BORROW
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* SAVE State */}
            {activeMode === "save" && (
              <Animated.View style={[
                styles.modeContent,
                { transform: [{ translateY: contentSlide }] }
              ]}>
                {/* Savings Card */}
                <View style={styles.savingsCard}>
                  <ExpoLinearGradient
                    colors={[CARD_BG, '#1E2A4A']}
                    style={styles.savingsGradient}
                  >
                    <Text style={styles.cardLabel}>TOTAL SAVINGS (USDC/KEST)</Text>
                    
                    <View style={styles.savingsAmount}>
                      <Text style={styles.amountValue}>
                        {savingsBalance.toFixed(2)} USDC
                      </Text>
                      <View style={styles.apyBadge}>
                        <IconTrendingUp size={16} />
                        <Text style={styles.apyText}>+{apy}% APY</Text>
                      </View>
                    </View>

                    {/* Growth Chart */}
                    <View style={styles.chartSection}>
                      <View style={styles.chartDivider} />
                      <Text style={styles.chartTitle}>30-DAY GROWTH</Text>
                      <View style={styles.chart}>
                        {chartData.map((value, index) => (
                          <ChartBar
                            key={index}
                            value={value}
                            index={index}
                            maxValue={Math.max(...chartData)}
                          />
                        ))}
                      </View>
                      <View style={styles.chartLabels}>
                        <Text style={styles.chartLabel}>30 days ago</Text>
                        <Text style={styles.chartLabel}>Today</Text>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                      <Pressable
                        onPress={() => navigation.navigate("VaultDeposit")}
                        style={({ pressed }) => [
                          styles.primaryAction,
                          pressed && styles.primaryActionPressed,
                        ]}
                      >
                        <ExpoLinearGradient
                          colors={[ORANGE, ORANGE_DARK]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.primaryActionGradient}
                        >
                          <IconArrowDown size={16} />
                          <Text style={styles.primaryActionText}>Deposit</Text>
                        </ExpoLinearGradient>
                      </Pressable>
                      
                      <Pressable
                        onPress={() => navigation.navigate("VaultWithdraw")}
                        style={({ pressed }) => [
                          styles.secondaryAction,
                          pressed && styles.secondaryActionPressed,
                        ]}
                      >
                        <IconArrowUp size={16} />
                        <Text style={styles.secondaryActionText}>Withdraw</Text>
                      </Pressable>
                    </View>
                  </ExpoLinearGradient>
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                  <ExpoLinearGradient
                    colors={[CARD_BG, '#1E2A4A']}
                    style={styles.infoGradient}
                  >
                    <IconShield size={16} />
                    <Text style={styles.infoText}>
                      Your savings are secured on the Stellar blockchain and earn passive yield through decentralized protocols. Withdraw anytime to M-Pesa.
                    </Text>
                  </ExpoLinearGradient>
                </View>
              </Animated.View>
            )}

            {/* BORROW State */}
            {activeMode === "borrow" && (
              <Animated.View style={[
                styles.modeContent,
                { transform: [{ translateY: contentSlide }] }
              ]}>
                {/* Credit Card */}
                <View style={styles.creditCard}>
                  <ExpoLinearGradient
                    colors={[CARD_BG, '#1E2A4A']}
                    style={styles.creditGradient}
                  >
                    <Text style={styles.cardLabel}>AVAILABLE CREDIT LIMIT</Text>
                    
                    <Text style={styles.creditAmount}>
                      KES {maxCredit.toLocaleString()}.00
                    </Text>
                    
                    <View style={styles.vouchInfo}>
                      <IconLock size={14} />
                      <Text style={styles.vouchText}>
                        Unlocked by {vouchCount} Community Vouches
                      </Text>
                    </View>

                    <View style={styles.creditDivider} />

                    {/* Loan Amount Slider */}
                    <View style={styles.sliderSection}>
                      <View style={styles.sliderHeader}>
                        <Text style={styles.sliderLabel}>LOAN AMOUNT</Text>
                        <Text style={styles.sliderValue}>
                          KES {loanAmount.toLocaleString()}
                        </Text>
                      </View>

                      <Slider
                        style={styles.slider}
                        minimumValue={500}
                        maximumValue={maxCredit}
                        step={100}
                        value={loanAmount}
                        onValueChange={(value) => setLoanAmount(value)}
                        minimumTrackTintColor={ORANGE}
                        maximumTrackTintColor="#1A1A1A"
                        thumbTintColor={ORANGE}
                      />

                      <View style={styles.sliderRange}>
                        <Text style={styles.rangeText}>KES 500</Text>
                        <Text style={styles.rangeText}>KES {maxCredit.toLocaleString()}</Text>
                      </View>
                    </View>

                    {/* Repayment Terms */}
                    <View style={styles.repaymentSection}>
                      <Text style={styles.repaymentTitle}>REPAYMENT TERMS</Text>
                      
                      <View style={styles.repaymentRow}>
                        <Text style={styles.repaymentLabel}>Principal</Text>
                        <Text style={styles.repaymentValue}>
                          KES {repayment.principal.toLocaleString()}
                        </Text>
                      </View>
                      
                      <View style={styles.repaymentRow}>
                        <Text style={styles.repaymentLabel}>Interest (5%)</Text>
                        <Text style={styles.repaymentValue}>
                          KES {repayment.interest.toFixed(2)}
                        </Text>
                      </View>
                      
                      <View style={styles.repaymentDivider} />
                      
                      <View style={styles.repaymentRow}>
                        <Text style={styles.repaymentTotalLabel}>Total Repayment</Text>
                        <Text style={styles.repaymentTotalValue}>
                          KES {repayment.total.toFixed(2)}
                        </Text>
                      </View>
                      
                      <View style={styles.repaymentRow}>
                        <Text style={styles.repaymentLabel}>Repayment Period</Text>
                        <Text style={styles.repaymentValue}>{repayment.period}</Text>
                      </View>
                    </View>

                    {/* Request Loan Button */}
                    <Pressable
                      onPress={() => navigation.navigate("RequestLoan", { amount: loanAmount })}
                      style={({ pressed }) => [
                        styles.requestButton,
                        pressed && styles.requestButtonPressed,
                      ]}
                    >
                      <ExpoLinearGradient
                        colors={[ORANGE, ORANGE_DARK]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.requestButtonGradient}
                      >
                        <IconDollarSign size={18} />
                        <Text style={styles.requestButtonText}>Request Loan</Text>
                      </ExpoLinearGradient>
                    </Pressable>
                  </ExpoLinearGradient>
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                  <ExpoLinearGradient
                    colors={[CARD_BG, '#1E2A4A']}
                    style={styles.infoGradient}
                  >
                    <IconShield size={16} />
                    <Text style={styles.infoText}>
                      Credit is trust-based and powered by Soroban Smart Contracts. Your community vouches unlock borrowing capacity. All loans are recorded on-chain.
                    </Text>
                  </ExpoLinearGradient>
                </View>
              </Animated.View>
            )}
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
    top: -100,
    right: -100,
    opacity: 0.04,
  },
  bgCircle2: {
    width: 200,
    height: 200,
    bottom: 200,
    left: -80,
    opacity: 0.03,
  },
  safeArea: {
    flex: 1,
  },
  // Header
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  backButtonPressed: {
    backgroundColor: '#2A2A3E',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: '#666',
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  vaultIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ORANGE + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ORANGE + '20',
  },
  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  content: {
    gap: 20,
  },
  // Toggle
  toggleContainer: {
    paddingHorizontal: 4,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: CARD_BG,
    borderRadius: 14,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: ORANGE,
  },
  toggleText: {
    color: '#999',
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  // Mode Content
  modeContent: {
    gap: 20,
  },
  // Savings Card
  savingsCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  savingsGradient: {
    padding: 24,
    gap: 20,
  },
  cardLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
  },
  savingsAmount: {
    gap: 12,
  },
  amountValue: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: 1,
  },
  apyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ORANGE + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  apyText: {
    color: ORANGE,
    fontSize: 14,
    fontWeight: "700",
  },
  // Chart
  chartSection: {
    gap: 16,
  },
  chartDivider: {
    height: 1,
    backgroundColor: '#2A2A3E',
  },
  chartTitle: {
    color: '#666',
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
  },
  chart: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  chartBar: {
    flex: 1,
    height: 100,
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    backgroundColor: ORANGE,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 2,
    overflow: 'hidden',
  },
  chartBarGradient: {
    flex: 1,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    color: '#555',
    fontSize: 10,
    fontWeight: "500",
  },
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryAction: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  primaryActionPressed: {
    opacity: 0.9,
  },
  primaryActionGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  secondaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: ORANGE + '40',
  },
  secondaryActionPressed: {
    backgroundColor: ORANGE + '10',
  },
  secondaryActionText: {
    color: ORANGE,
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // Info Card
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  infoGradient: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    color: '#999',
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
    lineHeight: 18,
  },
  // Credit Card
  creditCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  creditGradient: {
    padding: 24,
    gap: 20,
  },
  creditAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: "800",
  },
  vouchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ORANGE + '10',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  vouchText: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: "600",
  },
  creditDivider: {
    height: 1,
    backgroundColor: '#2A2A3E',
  },
  // Slider
  sliderSection: {
    gap: 16,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
  },
  sliderValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: "700",
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeText: {
    color: '#666',
    fontSize: 11,
    fontWeight: "500",
  },
  // Repayment
  repaymentSection: {
    backgroundColor: '#2A2A3E',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  repaymentTitle: {
    color: '#666',
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
    marginBottom: 4,
  },
  repaymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  repaymentLabel: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
  },
  repaymentValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: "600",
  },
  repaymentDivider: {
    height: 1,
    backgroundColor: '#3A3A4E',
    marginVertical: 4,
  },
  repaymentTotalLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: "600",
  },
  repaymentTotalValue: {
    color: ORANGE,
    fontSize: 15,
    fontWeight: "800",
  },
  // Request Button
  requestButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  requestButtonPressed: {
    opacity: 0.9,
  },
  requestButtonGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});