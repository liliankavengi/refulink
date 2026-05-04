import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Line, Rect, Polyline, Polygon } from "react-native-svg";

const ORANGE = "#FF5722";
const ORANGE_LIGHT = "#FF8A65";
const ORANGE_DARK = "#E64A19";
const DARK_BG = "#1A1A2E";
const CARD_BG = "#16213E";
const GREEN = "#4CAF50";
const RED = "#EF4444";

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function IconChevronLeft({ color = "#FFFFFF", size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 18l-6-6 6-6" />
    </Svg>
  );
}

function IconArrowRight({ color = ORANGE, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="5" y1="12" x2="19" y2="12" />
      <Polyline points="12 5 19 12 12 19" />
    </Svg>
  );
}

function IconArrowUp({ color = "#FFFFFF", size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="12" y1="19" x2="12" y2="5" />
      <Polyline points="5 12 12 5 19 12" />
    </Svg>
  );
}

function IconAlertCircle({ color = RED, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="8" x2="12" y2="12" />
      <Line x1="12" y1="16" x2="12.01" y2="16" />
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

function IconSmartphone({ color = ORANGE, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <Line x1="12" y1="18" x2="12.01" y2="18" />
    </Svg>
  );
}

function IconVault({ color = ORANGE, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="2" y="4" width="20" height="16" rx="2" />
      <Circle cx="12" cy="12" r="3" />
      <Path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
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

// ── Component ─────────────────────────────────────────────────────────────────

export default function VaultWithdrawScreen() {
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [focusedField, setFocusedField] = useState(false);
  const navigation = useNavigation<any>();

  const availableBalance = 350.0;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const balancePulse = useRef(new Animated.Value(1)).current;
  const arrowPulse = useRef(new Animated.Value(1)).current;
  const errorShake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
    ]).start();

    // Arrow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(arrowPulse, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(arrowPulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleAmountChange = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    setAmount(cleaned);
  };

  const isInsufficientBalance = Number(amount) > availableBalance;

  const handleWithdraw = () => {
    const amountNum = parseFloat(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount to withdraw.");
      return;
    }

    if (amountNum > availableBalance) {
      // Shake animation
      Animated.sequence([
        Animated.timing(errorShake, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(errorShake, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(errorShake, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(errorShake, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(errorShake, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      navigation.navigate("VaultWithdrawSuccess", { amount });
    }, 2500);
  };

  const quickAmounts = [25, 50, 100];

  const kesAmount = Number(amount || "0") * 128; // Mock conversion rate

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DARK_BG} />
      
      <ExpoLinearGradient
        colors={[DARK_BG, '#16213E', '#0F3460']}
        style={styles.background}
      />
      
      <View style={styles.bgDecor}>
        <View style={[styles.bgCircle, styles.bgCircle1]} />
        <View style={[styles.bgCircle, styles.bgCircle2]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
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
              <Text style={styles.headerTitle}>Withdraw</Text>
              <Text style={styles.headerSubtitle}>
                From Vault to Wallet
              </Text>
            </View>
            <View style={styles.vaultIcon}>
              <IconVault size={20} />
            </View>
          </View>
        </Animated.View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={[
              styles.content,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}>
              {/* Available Balance */}
              <View style={styles.balanceCard}>
                <ExpoLinearGradient
                  colors={[CARD_BG, '#1E2A4A']}
                  style={styles.balanceGradient}
                >
                  <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
                  <View style={styles.balanceRow}>
                    <Text style={styles.balanceValue}>
                      {availableBalance.toFixed(2)} USDC
                    </Text>
                    <Text style={styles.balanceKes}>
                      ≈ KES {(availableBalance * 128).toLocaleString()}
                    </Text>
                  </View>
                  
                  {/* Balance Bar */}
                  {amount && !isInsufficientBalance && (
                    <View style={styles.balanceBar}>
                      <View style={styles.balanceTrack}>
                        <View style={[
                          styles.balanceFill,
                          { width: `${Math.min((Number(amount) / availableBalance) * 100, 100)}%` }
                        ]}>
                          <ExpoLinearGradient
                            colors={[ORANGE, ORANGE_LIGHT]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.balanceFillGradient}
                          />
                        </View>
                      </View>
                      <Text style={styles.balancePercent}>
                        {((Number(amount) / availableBalance) * 100).toFixed(0)}%
                      </Text>
                    </View>
                  )}
                </ExpoLinearGradient>
              </View>

              {/* Amount Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>AMOUNT (USDC)</Text>
                <Animated.View style={[
                  styles.inputWrapper,
                  focusedField && !isInsufficientBalance && styles.inputWrapperFocused,
                  isInsufficientBalance && amount && styles.inputWrapperError,
                  { transform: [{ translateX: errorShake }] }
                ]}>
                  <View style={[
                    styles.currencyBadge,
                    isInsufficientBalance && amount && styles.currencyBadgeError,
                  ]}>
                    <Text style={[
                      styles.currencyText,
                      isInsufficientBalance && amount && styles.currencyTextError,
                    ]}>
                      USDC
                    </Text>
                  </View>
                  <TextInput
                    value={amount}
                    onChangeText={handleAmountChange}
                    onFocus={() => setFocusedField(true)}
                    onBlur={() => setFocusedField(false)}
                    placeholder="0.00"
                    placeholderTextColor="#444"
                    style={styles.amountInput}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                  />
                </Animated.View>

                {/* Error Message */}
                {isInsufficientBalance && amount && (
                  <View style={styles.errorRow}>
                    <IconAlertCircle size={14} />
                    <Text style={styles.errorText}>Insufficient balance</Text>
                  </View>
                )}

                {/* KES Conversion */}
                {amount && !isInsufficientBalance && (
                  <View style={styles.conversionRow}>
                    <IconDollarSign size={14} />
                    <Text style={styles.conversionText}>
                      ≈ KES {kesAmount.toLocaleString()}
                    </Text>
                  </View>
                )}

                {/* Quick Amounts */}
                <View style={styles.quickAmounts}>
                  {quickAmounts.map((preset) => (
                    <Pressable
                      key={preset}
                      onPress={() => setAmount(preset.toString())}
                      style={[
                        styles.quickButton,
                        amount === preset.toString() && styles.quickButtonActive,
                        preset > availableBalance && styles.quickButtonDisabled,
                      ]}
                      disabled={preset > availableBalance}
                    >
                      <Text style={[
                        styles.quickButtonText,
                        amount === preset.toString() && styles.quickButtonTextActive,
                        preset > availableBalance && styles.quickButtonTextDisabled,
                      ]}>
                        {preset} USDC
                      </Text>
                    </Pressable>
                  ))}
                  
                  {/* Max Button */}
                  <Pressable
                    onPress={() => setAmount(availableBalance.toString())}
                    style={[
                      styles.quickButton,
                      styles.maxButton,
                    ]}
                  >
                    <Text style={styles.maxButtonText}>MAX</Text>
                  </Pressable>
                </View>
              </View>

              {/* Bridge Info */}
              <View style={styles.bridgeCard}>
                <ExpoLinearGradient
                  colors={[CARD_BG, '#1E2A4A']}
                  style={styles.bridgeGradient}
                >
                  <Text style={styles.bridgeTitle}>HOW IT WORKS</Text>

                  <View style={styles.bridgeVisual}>
                    <View style={styles.bridgeStep}>
                      <View style={[styles.bridgeCircle, styles.bridgeCircleOrange]}>
                        <IconVault size={20} />
                      </View>
                      <Text style={styles.bridgeLabel}>Stellar Vault</Text>
                      <Text style={styles.bridgeSubLabel}>USDC</Text>
                    </View>

                    <Animated.View style={[
                      styles.bridgeArrow,
                      { transform: [{ scale: arrowPulse }] }
                    ]}>
                      <IconArrowRight size={28} />
                    </Animated.View>

                    <View style={styles.bridgeStep}>
                      <View style={styles.bridgeCircle}>
                        <IconSmartphone size={20} />
                      </View>
                      <Text style={styles.bridgeLabel}>Wallet</Text>
                      <Text style={styles.bridgeSubLabel}>KES</Text>
                    </View>
                  </View>

                  <View style={styles.bridgeDescription}>
                    <IconShield size={14} />
                    <Text style={styles.bridgeText}>
                      Your USDC will be converted to KES and sent to your Wallet account. Funds typically arrive within 2-3 minutes.
                    </Text>
                  </View>
                </ExpoLinearGradient>
              </View>

              {/* Withdraw Button */}
              <Pressable
                onPress={handleWithdraw}
                disabled={!amount || processing || isInsufficientBalance}
                style={({ pressed }) => [
                  styles.withdrawButton,
                  (!amount || processing || isInsufficientBalance) && styles.withdrawButtonDisabled,
                  pressed && amount && !processing && !isInsufficientBalance && styles.withdrawButtonPressed,
                ]}
              >
                <ExpoLinearGradient
                  colors={
                    !amount || processing || isInsufficientBalance
                      ? ['#444', '#333']
                      : [ORANGE, ORANGE_DARK]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.withdrawGradient}
                >
                  {processing ? (
                    <>
                      <View style={styles.processingDot} />
                      <Text style={styles.withdrawButtonText}>Processing...</Text>
                    </>
                  ) : (
                    <>
                      <IconArrowUp size={18} />
                      <Text style={styles.withdrawButtonText}>
                        Withdraw to Wallet
                      </Text>
                    </>
                  )}
                </ExpoLinearGradient>
              </Pressable>

              {/* Processing Status */}
              {processing && (
                <View style={styles.processingCard}>
                  <ExpoLinearGradient
                    colors={[CARD_BG, '#1E2A4A']}
                    style={styles.processingGradient}
                  >
                    <Text style={styles.processingTitle}>
                      Bridging from Stellar to Wallet...
                    </Text>
                    <View style={styles.processingSteps}>
                      <View style={styles.processingStep}>
                        <View style={[styles.stepDot, styles.stepDotDone]} />
                        <Text style={styles.stepTextDone}>Converting</Text>
                      </View>
                      <View style={styles.stepLine}>
                        <ExpoLinearGradient
                          colors={[ORANGE, '#2A2A3E']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.stepLineFill}
                        />
                      </View>
                      <View style={styles.processingStep}>
                        <View style={[styles.stepDot, styles.stepDotActive]} />
                        <Text style={styles.stepTextActive}>Bridging</Text>
                      </View>
                      <View style={styles.stepLine}>
                        <View style={styles.stepLineEmpty} />
                      </View>
                      <View style={styles.processingStep}>
                        <View style={styles.stepDot} />
                        <Text style={styles.stepTextInactive}>Sent</Text>
                      </View>
                    </View>
                  </ExpoLinearGradient>
                </View>
              )}

              {/* Security Note */}
              <View style={styles.securityNote}>
                <IconShield size={14} />
                <Text style={styles.securityText}>
                  Withdrawals are secured by Stellar blockchain and Soroban smart contracts
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    width: 250,
    height: 250,
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
  flex: {
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
    paddingTop: 24,
    paddingBottom: 40,
  },
  content: {
    gap: 24,
  },
  // Balance Card
  balanceCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  balanceGradient: {
    padding: 20,
    gap: 12,
  },
  balanceLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: "800",
  },
  balanceKes: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
  },
  balanceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  balanceTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#2A2A3E',
    borderRadius: 3,
    overflow: 'hidden',
  },
  balanceFill: {
    height: '100%',
    borderRadius: 3,
  },
  balanceFillGradient: {
    flex: 1,
  },
  balancePercent: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: "700",
    width: 36,
    textAlign: 'right',
  },
  // Input Section
  inputSection: {
    gap: 12,
  },
  inputLabel: {
    color: '#999',
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    paddingHorizontal: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#2A2A3E',
    overflow: 'hidden',
  },
  inputWrapperFocused: {
    borderColor: ORANGE,
  },
  inputWrapperError: {
    borderColor: RED,
  },
  currencyBadge: {
    backgroundColor: ORANGE + '15',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRightWidth: 1,
    borderRightColor: '#2A2A3E',
  },
  currencyBadgeError: {
    backgroundColor: RED + '15',
    borderRightColor: RED + '30',
  },
  currencyText: {
    color: ORANGE,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },
  currencyTextError: {
    color: RED,
  },
  amountInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: "800",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    color: RED,
    fontSize: 12,
    fontWeight: "600",
  },
  conversionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  conversionText: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  quickButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    alignItems: 'center',
  },
  quickButtonActive: {
    borderColor: ORANGE,
    backgroundColor: ORANGE + '10',
  },
  quickButtonDisabled: {
    opacity: 0.3,
  },
  quickButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: "600",
  },
  quickButtonTextActive: {
    color: ORANGE,
  },
  quickButtonTextDisabled: {
    color: '#555',
  },
  maxButton: {
    backgroundColor: ORANGE + '10',
    borderColor: ORANGE + '30',
  },
  maxButtonText: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  // Bridge Card
  bridgeCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  bridgeGradient: {
    padding: 20,
    gap: 20,
  },
  bridgeTitle: {
    color: '#666',
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
  },
  bridgeVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  bridgeStep: {
    alignItems: 'center',
    gap: 8,
  },
  bridgeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2A2A3E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3A3A4E',
  },
  bridgeCircleOrange: {
    backgroundColor: ORANGE + '15',
    borderColor: ORANGE + '30',
  },
  bridgeArrow: {
    marginTop: -16,
  },
  bridgeLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: "700",
  },
  bridgeSubLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: "600",
  },
  bridgeDescription: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#2A2A3E',
    padding: 14,
    borderRadius: 14,
  },
  bridgeText: {
    color: '#999',
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
    lineHeight: 18,
  },
  // Withdraw Button
  withdrawButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  withdrawButtonDisabled: {
    opacity: 0.5,
  },
  withdrawButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  withdrawGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  withdrawButtonText: {
    color: '#FFFFFF',
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  processingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
  },
  // Processing Card
  processingCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ORANGE + '20',
  },
  processingGradient: {
    padding: 20,
    gap: 16,
    alignItems: 'center',
  },
  processingTitle: {
    color: ORANGE,
    fontSize: 14,
    fontWeight: "600",
  },
  processingSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  processingStep: {
    alignItems: 'center',
    gap: 6,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2A2A3E',
    borderWidth: 2,
    borderColor: '#3A3A4E',
  },
  stepDotDone: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  stepDotActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
  },
  stepLineFill: {
    flex: 1,
    borderRadius: 1,
  },
  stepLineEmpty: {
    flex: 1,
    backgroundColor: '#2A2A3E',
    borderRadius: 1,
  },
  stepTextDone: {
    color: ORANGE,
    fontSize: 10,
    fontWeight: "600",
  },
  stepTextActive: {
    color: ORANGE,
    fontSize: 10,
    fontWeight: "600",
  },
  stepTextInactive: {
    color: '#555',
    fontSize: 10,
    fontWeight: "500",
  },
  // Security Note
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  securityText: {
    color: '#666',
    fontSize: 11,
    fontWeight: "500",
    flex: 1,
    textAlign: 'center',
  },
});