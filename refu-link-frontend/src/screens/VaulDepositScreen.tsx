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
import React from "react";

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

function IconArrowRight({ color = ORANGE, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="5" y1="12" x2="19" y2="12" />
      <Polyline points="12 5 19 12 12 19" />
    </Svg>
  );
}

function IconArrowDown({ color = "#FFFFFF", size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="12" y1="5" x2="12" y2="19" />
      <Polyline points="19 12 12 19 5 12" />
    </Svg>
  );
}

function IconTrendingUp({ color = ORANGE, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <Polyline points="17 6 23 6 23 12" />
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

function IconDollarSign({ color = ORANGE, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="12" y1="1" x2="12" y2="23" />
      <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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

// ── Component ─────────────────────────────────────────────────────────────────

export default function VaultDepositScreen() {
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [focusedField, setFocusedField] = useState(false);
  const navigation = useNavigation<any>();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const bridgeAnim = useRef(new Animated.Value(0)).current;
  const arrowPulse = useRef(new Animated.Value(1)).current;

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
      Animated.timing(bridgeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Arrow pulse animation
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

  const handleDeposit = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount to deposit.");
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      navigation.navigate("VaultDepositSuccess", { amount });
    }, 2500);
  };

  const quickAmounts = ["500", "1000", "2500", "5000"];

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
              <Text style={styles.headerTitle}>Deposit to Vault</Text>
              <Text style={styles.headerSubtitle}>
                Earn 4.5% APY on savings
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
              {/* Amount Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>AMOUNT (KES)</Text>
                <View style={[
                  styles.inputWrapper,
                  focusedField && styles.inputWrapperFocused,
                  amount.length > 0 && styles.inputWrapperFilled,
                ]}>
                  <View style={styles.currencyBadge}>
                    <Text style={styles.currencyText}>KES</Text>
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
                </View>

                {/* Quick Amounts */}
                <View style={styles.quickAmounts}>
                  {quickAmounts.map((quickAmount) => (
                    <Pressable
                      key={quickAmount}
                      onPress={() => setAmount(quickAmount)}
                      style={[
                        styles.quickButton,
                        amount === quickAmount && styles.quickButtonActive,
                      ]}
                    >
                      <Text style={[
                        styles.quickButtonText,
                        amount === quickAmount && styles.quickButtonTextActive,
                      ]}>
                        {quickAmount}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Bridge Info Card */}
              <Animated.View style={[
                styles.bridgeCard,
                { opacity: bridgeAnim }
              ]}>
                <ExpoLinearGradient
                  colors={[CARD_BG, '#1E2A4A']}
                  style={styles.bridgeGradient}
                >
                  <Text style={styles.bridgeTitle}>HOW IT WORKS</Text>

                  {/* Bridge Visual */}
                  <View style={styles.bridgeVisual}>
                    {/* Wallet */}
                    <View style={styles.bridgeStep}>
                      <View style={styles.bridgeCircle}>
                        <IconSmartphone size={20} />
                      </View>
                      <Text style={styles.bridgeLabel}>Wallet</Text>
                      <Text style={styles.bridgeSubLabel}>KES</Text>
                    </View>

                    {/* Arrow */}
                    <Animated.View style={[
                      styles.bridgeArrow,
                      { transform: [{ scale: arrowPulse }] }
                    ]}>
                      <IconArrowRight size={28} />
                    </Animated.View>

                    {/* Vault */}
                    <View style={styles.bridgeStep}>
                      <View style={[styles.bridgeCircle, styles.bridgeCircleOrange]}>
                        <IconVault size={20} />
                      </View>
                      <Text style={styles.bridgeLabel}>Stellar Vault</Text>
                      <Text style={styles.bridgeSubLabel}>USDC</Text>
                    </View>
                  </View>

                  {/* Description */}
                  <View style={styles.bridgeDescription}>
                    <IconDollarSign size={14} />
                    <Text style={styles.bridgeText}>
                      Your KES will be converted to USDC and deposited on the Stellar blockchain. Earn{' '}
                      <Text style={styles.apyText}>4.5% APY</Text> on your savings with automatic compounding.
                    </Text>
                  </View>

                  {/* Features */}
                  <View style={styles.featuresRow}>
                    <View style={styles.featureItem}>
                      <IconShield size={12} />
                      <Text style={styles.featureText}>Secured</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <IconTrendingUp size={12} />
                      <Text style={styles.featureText}>4.5% APY</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <IconArrowDown size={12} />
                      <Text style={styles.featureText}>Instant</Text>
                    </View>
                  </View>
                </ExpoLinearGradient>
              </Animated.View>

              {/* Deposit Button */}
              <Pressable
                onPress={handleDeposit}
                disabled={!amount || processing}
                style={({ pressed }) => [
                  styles.depositButton,
                  (!amount || processing) && styles.depositButtonDisabled,
                  pressed && amount && !processing && styles.depositButtonPressed,
                ]}
              >
                <ExpoLinearGradient
                  colors={
                    !amount || processing
                      ? ['#444', '#333']
                      : [ORANGE, ORANGE_DARK]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.depositGradient}
                >
                  {processing ? (
                    <>
                      <View style={styles.processingDot} />
                      <Text style={styles.depositButtonText}>Processing...</Text>
                    </>
                  ) : (
                    <>
                      <IconArrowDown size={18} />
                      <Text style={styles.depositButtonText}>
                        Deposit to Vault
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
                    <View style={styles.processingContent}>
                      <View style={styles.processingDotLarge} />
                      <View style={styles.processingInfo}>
                        <Text style={styles.processingTitle}>
                          Bridging to Stellar
                        </Text>
                        <Text style={styles.processingText}>
                          Converting KES to USDC via Wallet bridge...
                        </Text>
                      </View>
                    </View>
                    
                    {/* Progress Steps */}
                    <View style={styles.progressSteps}>
                      <View style={styles.progressStep}>
                        <View style={[styles.progressDot, styles.progressDotDone]} />
                        <Text style={styles.progressStepText}>Initiated</Text>
                      </View>
                      <View style={styles.progressLine}>
                        <ExpoLinearGradient
                          colors={[ORANGE, '#2A2A3E']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.progressLineFill}
                        />
                      </View>
                      <View style={styles.progressStep}>
                        <View style={[styles.progressDot, styles.progressDotActive]} />
                        <Text style={styles.progressStepTextActive}>Bridging</Text>
                      </View>
                      <View style={styles.progressLine}>
                        <View style={styles.progressLineEmpty} />
                      </View>
                      <View style={styles.progressStep}>
                        <View style={styles.progressDot} />
                        <Text style={styles.progressStepTextInactive}>Complete</Text>
                      </View>
                    </View>
                  </ExpoLinearGradient>
                </View>
              )}

              {/* Security Note */}
              <View style={styles.securityNote}>
                <IconShield size={14} />
                <Text style={styles.securityText}>
                  Deposits are secured by Stellar blockchain and Soroban smart contracts
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
  inputWrapperFilled: {
    borderColor: ORANGE + '40',
  },
  currencyBadge: {
    backgroundColor: ORANGE + '15',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRightWidth: 1,
    borderRightColor: '#2A2A3E',
  },
  currencyText: {
    color: ORANGE,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },
  amountInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: "800",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  quickButton: {
    flex: 1,
    paddingVertical: 10,
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
  quickButtonText: {
    color: '#999',
    fontSize: 13,
    fontWeight: "700",
  },
  quickButtonTextActive: {
    color: ORANGE,
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
  apyText: {
    color: ORANGE,
    fontWeight: "700",
  },
  featuresRow: {
    flexDirection: 'row',
    gap: 12,
  },
  featureItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2A2A3E',
    paddingVertical: 10,
    borderRadius: 10,
  },
  featureText: {
    color: '#999',
    fontSize: 11,
    fontWeight: "600",
  },
  // Deposit Button
  depositButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  depositButtonDisabled: {
    opacity: 0.5,
  },
  depositButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  depositGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  depositButtonText: {
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
    gap: 20,
  },
  processingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  processingDotLarge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: ORANGE,
  },
  processingInfo: {
    flex: 1,
    gap: 4,
  },
  processingTitle: {
    color: ORANGE,
    fontSize: 15,
    fontWeight: "700",
  },
  processingText: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressStep: {
    alignItems: 'center',
    gap: 6,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2A2A3E',
    borderWidth: 2,
    borderColor: '#3A3A4E',
  },
  progressDotDone: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  progressDotActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  progressLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
  },
  progressLineFill: {
    flex: 1,
    borderRadius: 1,
  },
  progressLineEmpty: {
    flex: 1,
    backgroundColor: '#2A2A3E',
    borderRadius: 1,
  },
  progressStepText: {
    color: ORANGE,
    fontSize: 10,
    fontWeight: "600",
  },
  progressStepTextActive: {
    color: ORANGE,
    fontSize: 10,
    fontWeight: "600",
  },
  progressStepTextInactive: {
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