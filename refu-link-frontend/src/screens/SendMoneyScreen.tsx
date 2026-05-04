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
import Svg, { Path, Circle, Line, Polyline, Rect, Polygon } from "react-native-svg";

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

function IconCheckCircle({ color = ORANGE, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Polyline points="22 4 12 14.01 9 11.01" />
    </Svg>
  );
}

function IconSend({ color = "#FFFFFF", size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="22" y1="2" x2="11" y2="13" />
      <Polygon points="22 2 15 22 11 13 2 9 22 2" />
    </Svg>
  );
}

function IconUser({ color = ORANGE, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

function IconSearch({ color = "#666", size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="11" cy="11" r="8" />
      <Line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Svg>
  );
}

function IconStar({ color = ORANGE, size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Svg>
  );
}

function IconArrowRight({ color = "#FFFFFF", size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="5" y1="12" x2="19" y2="12" />
      <Polyline points="12 5 19 12 12 19" />
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

function IconRefreshCw({ color = "#666", size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="23 4 23 10 17 10" />
      <Polyline points="1 20 1 14 7 14" />
      <Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </Svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type RecipientInfo = {
  name: string;
  verified: boolean;
  vouchScore: number;
  recentTransactions: number;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function SendMoneyScreen() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [recipientFound, setRecipientFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [recipientInfo, setRecipientInfo] = useState<RecipientInfo | null>(null);
  const navigation = useNavigation<any>();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const recipientSlide = useRef(new Animated.Value(20)).current;
  const recipientOpacity = useRef(new Animated.Value(0)).current;

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
  }, []);

  useEffect(() => {
    if (recipientFound) {
      Animated.parallel([
        Animated.spring(recipientSlide, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(recipientOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      recipientSlide.setValue(20);
      recipientOpacity.setValue(0);
    }
  }, [recipientFound]);

  const handleRecipientChange = (value: string) => {
    setRecipient(value);
    
    if (value.length >= 8) {
      setIsSearching(true);
      
      // Simulate API call to find recipient
      setTimeout(() => {
        setRecipientFound(true);
        setIsSearching(false);
        setRecipientInfo({
          name: "Amina Hassan",
          verified: true,
          vouchScore: 4,
          recentTransactions: 12,
        });
      }, 800);
    } else {
      setRecipientFound(false);
      setRecipientInfo(null);
      setIsSearching(false);
    }
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal
    const cleaned = value.replace(/[^0-9.]/g, '');
    setAmount(cleaned);
  };

  const handleContinue = () => {
    if (!recipient || !amount || !recipientFound) return;
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount to send.");
      return;
    }
    
    navigation.navigate("SendConfirm", { 
      recipient: recipient,
      amount: amount,
      recipientName: recipientInfo?.name,
    });
  };

  const handleScanQR = () => {
    navigation.navigate("MainTabs", { screen: "Scan" });
  };

  const isValid = recipient && amount && recipientFound && parseFloat(amount) > 0;

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
              <Text style={styles.headerTitle}>Send Money</Text>
              <Text style={styles.headerSubtitle}>
                Transfer funds to another wallet
              </Text>
            </View>
            <Pressable
              onPress={handleScanQR}
              style={({ pressed }) => [
                styles.scanButton,
                pressed && styles.scanButtonPressed,
              ]}
            >
              <Text style={styles.scanButtonText}>QR</Text>
            </Pressable>
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
              styles.form,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}>
              {/* Recipient Input */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>RECIPIENT</Text>
                <View style={[
                  styles.inputWrapper,
                  focusedField === 'recipient' && styles.inputWrapperFocused,
                  recipientFound && styles.inputWrapperSuccess,
                ]}>
                  <View style={styles.inputIcon}>
                    {isSearching ? (
                      <IconRefreshCw size={18} />
                    ) : recipientFound ? (
                      <IconCheckCircle color={GREEN} size={18} />
                    ) : (
                      <IconSearch size={18} />
                    )}
                  </View>
                  <TextInput
                    value={recipient}
                    onChangeText={handleRecipientChange}
                    onFocus={() => setFocusedField('recipient')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter RIN or phone number"
                    placeholderTextColor="#666"
                    style={styles.input}
                    autoCapitalize="characters"
                    returnKeyType="next"
                  />
                  {recipient.length > 0 && (
                    <Pressable
                      onPress={() => handleRecipientChange("")}
                      style={styles.clearButton}
                    >
                      <Text style={styles.clearButtonText}>✕</Text>
                    </Pressable>
                  )}
                </View>
                
                {/* Search hint */}
                {recipient.length > 0 && recipient.length < 8 && (
                  <Text style={styles.hint}>
                    Keep typing to find recipient...
                  </Text>
                )}
              </View>

              {/* Recipient Found Card */}
              {recipientFound && recipientInfo && (
                <Animated.View style={{
                  opacity: recipientOpacity,
                  transform: [{ translateY: recipientSlide }]
                }}>
                  <View style={styles.recipientCard}>
                    <ExpoLinearGradient
                      colors={[CARD_BG, '#1E2A4A']}
                      style={styles.recipientGradient}
                    >
                      <View style={styles.recipientHeader}>
                        <View style={styles.recipientAvatar}>
                          <IconUser size={24} />
                        </View>
                        <View style={styles.recipientInfo}>
                          <Text style={styles.recipientName}>
                            {recipientInfo.name}
                          </Text>
                          <View style={styles.verifiedBadge}>
                            <IconCheckCircle color={GREEN} size={12} />
                            <Text style={styles.verifiedText}>Verified</Text>
                          </View>
                        </View>
                        <View style={styles.vouchScore}>
                          <IconStar size={16} />
                          <Text style={styles.vouchText}>
                            {recipientInfo.vouchScore}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.recipientDivider} />
                      
                      <View style={styles.recipientStats}>
                        <View style={styles.statItem}>
                          <IconShield size={12} />
                          <Text style={styles.statText}>
                            Trusted member
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statValue}>
                            {recipientInfo.recentTransactions}
                          </Text>
                          <Text style={styles.statLabel}>
                            recent transfers
                          </Text>
                        </View>
                      </View>
                    </ExpoLinearGradient>
                  </View>
                </Animated.View>
              )}

              {/* Amount Input */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>AMOUNT</Text>
                <View style={[
                  styles.inputWrapper,
                  styles.amountWrapper,
                  focusedField === 'amount' && styles.inputWrapperFocused,
                ]}>
                  <View style={styles.currencyBadge}>
                    <Text style={styles.currencyText}>KES</Text>
                  </View>
                  <TextInput
                    value={amount}
                    onChangeText={handleAmountChange}
                    onFocus={() => setFocusedField('amount')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="0.00"
                    placeholderTextColor="#444"
                    style={styles.amountInput}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                  />
                </View>
                
                {/* Quick amounts */}
                <View style={styles.quickAmounts}>
                  {["100", "500", "1000", "5000"].map((quickAmount) => (
                    <Pressable
                      key={quickAmount}
                      onPress={() => setAmount(quickAmount)}
                      style={[
                        styles.quickAmountButton,
                        amount === quickAmount && styles.quickAmountActive,
                      ]}
                    >
                      <Text style={[
                        styles.quickAmountText,
                        amount === quickAmount && styles.quickAmountTextActive,
                      ]}>
                        {quickAmount}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Transaction Summary */}
              {isValid && (
                <View style={styles.summaryCard}>
                  <ExpoLinearGradient
                    colors={[CARD_BG, '#1E2A4A']}
                    style={styles.summaryGradient}
                  >
                    <Text style={styles.summaryTitle}>Transaction Summary</Text>
                    
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>To</Text>
                      <Text style={styles.summaryValue}>{recipientInfo?.name}</Text>
                    </View>
                    
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Amount</Text>
                      <Text style={styles.summaryAmount}>
                        KES {parseFloat(amount).toLocaleString()}
                      </Text>
                    </View>
                    
                    <View style={styles.summaryDivider} />
                    
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Fee</Text>
                      <Text style={styles.summaryFee}>KES 0.00</Text>
                    </View>
                    
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryTotalLabel}>Total</Text>
                      <Text style={styles.summaryTotalValue}>
                        KES {parseFloat(amount).toLocaleString()}
                      </Text>
                    </View>
                  </ExpoLinearGradient>
                </View>
              )}

              {/* Continue Button */}
              <Pressable
                onPress={handleContinue}
                disabled={!isValid}
                style={({ pressed }) => [
                  styles.continueButton,
                  !isValid && styles.continueButtonDisabled,
                  pressed && isValid && styles.continueButtonPressed,
                ]}
              >
                <ExpoLinearGradient
                  colors={isValid ? [ORANGE, ORANGE_DARK] : ['#444', '#333']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.continueGradient}
                >
                  <IconSend size={18} />
                  <Text style={[
                    styles.continueButtonText,
                    !isValid && styles.continueButtonTextDisabled,
                  ]}>
                    Continue to Send
                  </Text>
                  <IconArrowRight size={18} />
                </ExpoLinearGradient>
              </Pressable>

              {/* Security note */}
              <View style={styles.securityNote}>
                <IconShield size={14} />
                <Text style={styles.securityText}>
                  Your transaction is protected with end-to-end encryption
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
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: '#666',
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  scanButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: ORANGE + '15',
    borderWidth: 1,
    borderColor: ORANGE + '30',
  },
  scanButtonPressed: {
    backgroundColor: ORANGE + '25',
  },
  scanButtonText: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
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
  form: {
    gap: 24,
  },
  // Field Container
  fieldContainer: {
    gap: 10,
  },
  fieldLabel: {
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
    paddingHorizontal: 16,
    gap: 12,
  },
  inputWrapperFocused: {
    borderColor: ORANGE,
  },
  inputWrapperSuccess: {
    borderColor: GREEN + '40',
  },
  inputIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2A2A3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: 16,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2A2A3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#999',
    fontSize: 12,
    fontWeight: "700",
  },
  hint: {
    color: '#666',
    fontSize: 11,
    fontWeight: "500",
    paddingHorizontal: 4,
    marginTop: 4,
  },
  // Amount Input
  amountWrapper: {
    paddingLeft: 0,
    gap: 8,
  },
  currencyBadge: {
    backgroundColor: ORANGE + '15',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
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
    fontSize: 28,
    fontWeight: "800",
    paddingVertical: 12,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  quickAmountButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    alignItems: 'center',
  },
  quickAmountActive: {
    borderColor: ORANGE,
    backgroundColor: ORANGE + '10',
  },
  quickAmountText: {
    color: '#999',
    fontSize: 13,
    fontWeight: "700",
  },
  quickAmountTextActive: {
    color: ORANGE,
  },
  // Recipient Card
  recipientCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: GREEN + '20',
  },
  recipientGradient: {
    padding: 20,
    gap: 16,
  },
  recipientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  recipientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: ORANGE + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipientInfo: {
    flex: 1,
    gap: 4,
  },
  recipientName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "700",
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "600",
  },
  vouchScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ORANGE + '15',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  vouchText: {
    color: ORANGE,
    fontSize: 16,
    fontWeight: "800",
  },
  recipientDivider: {
    height: 1,
    backgroundColor: '#2A2A3E',
  },
  recipientStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#999',
    fontSize: 12,
    fontWeight: "500",
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "700",
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: "500",
  },
  // Summary Card
  summaryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  summaryGradient: {
    padding: 20,
    gap: 12,
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#999',
    fontSize: 13,
    fontWeight: "600",
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: "600",
  },
  summaryAmount: {
    color: ORANGE,
    fontSize: 16,
    fontWeight: "800",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#2A2A3E',
  },
  summaryFee: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
  },
  summaryTotalLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "700",
  },
  summaryTotalValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: "800",
  },
  // Continue Button
  continueButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  continueGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  continueButtonTextDisabled: {
    opacity: 0.5,
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
    fontSize: 12,
    fontWeight: "500",
  },
});