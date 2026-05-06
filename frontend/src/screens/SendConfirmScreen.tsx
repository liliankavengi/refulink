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
  Alert,
  Modal,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Line, Polyline, Rect, Polygon } from "react-native-svg";
import { sendToken, logTransaction } from "../services/transferService";

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

function IconAlertCircle({ color = "#FF9800", size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="8" x2="12" y2="12" />
      <Line x1="12" y1="16" x2="12.01" y2="16" />
    </Svg>
  );
}

function IconCheckCircle({ color = ORANGE, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Polyline points="22 4 12 14.01 9 11.01" />
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

function IconSend({ color = "#FFFFFF", size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="22" y1="2" x2="11" y2="13" />
      <Polygon points="22 2 15 22 11 13 2 9 22 2" />
    </Svg>
  );
}

function IconShield({ color = "#666", size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );
}

function IconClock({ color = "#666", size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Polyline points="12 6 12 12 16 14" />
    </Svg>
  );
}

function IconLock({ color = "#666", size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );
}

function IconX({ color = "#FFFFFF", size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="18" y1="6" x2="6" y2="18" />
      <Line x1="6" y1="6" x2="18" y2="18" />
    </Svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type RouteParams = {
  SendConfirm: {
    recipient: string;
    amount: string;
    recipientName?: string;
  };
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function SendConfirmScreen() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, "SendConfirm">>();
  
  const { recipient, amount, recipientName } = route.params || {};

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardScale = useRef(new Animated.Value(0.95)).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;
  const pinModalScale = useRef(new Animated.Value(0.8)).current;

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
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse button animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulse, {
          toValue: 1.03,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (showPinModal) {
      Animated.spring(pinModalScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      pinModalScale.setValue(0.8);
      setPin("");
    }
  }, [showPinModal]);

  const handleConfirm = () => {
    setShowPinModal(true);
  };

  const handlePinInput = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    
    if (newPin.length === 4) {
      // PIN entered — close modal and call the backend
      setTimeout(async () => {
        setShowPinModal(false);
        setIsProcessing(true);
        
        try {
          const result = await sendToken(recipient, amount);

          // Fire-and-forget audit log
          logTransaction(
            result.tx_hash,
            "outgoing",
            result.amount_kes,
            result.destination,
          );

          setIsProcessing(false);
          navigation.navigate("SendSuccess", { 
            amount,
            recipientName: recipientName || "Recipient",
            txHash: result.tx_hash,
          });
        } catch (error: any) {
          setIsProcessing(false);
          const msg =
            error?.response?.data?.detail ||
            error?.message ||
            "Transaction failed. Please try again.";
          Alert.alert("Transaction Failed", msg);
        }
      }, 500);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  // Calculate fee (free for now)
  const fee = 0;
  const total = parseFloat(amount || "0") + fee;

  const numpadKeys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "⌫"],
  ];

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
              <Text style={styles.headerTitle}>Confirm Send</Text>
              <Text style={styles.headerSubtitle}>
                Review your transaction
              </Text>
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
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: cardScale }
              ]
            }
          ]}>
            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <ExpoLinearGradient
                colors={[CARD_BG, '#1E2A4A']}
                style={styles.summaryGradient}
              >
                {/* Recipient Section */}
                <View style={styles.summarySection}>
                  <Text style={styles.sectionLabel}>RECIPIENT</Text>
                  <View style={styles.recipientInfo}>
                    <View style={styles.recipientAvatar}>
                      <IconUser size={22} />
                    </View>
                    <View style={styles.recipientDetails}>
                      <Text style={styles.recipientName}>
                        {recipientName || "Amina Hassan"}
                      </Text>
                      <View style={styles.recipientMeta}>
                        <IconShield size={12} />
                        <Text style={styles.recipientMetaText}>
                          Verified account
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.recipientId}>
                    <Text style={styles.idLabel}>ID</Text>
                    <Text style={styles.idValue}>{recipient}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Amount Section */}
                <View style={styles.summarySection}>
                  <Text style={styles.sectionLabel}>AMOUNT</Text>
                  <Text style={styles.amountValue}>
                    KES {parseFloat(amount || "0").toLocaleString()}
                  </Text>
                </View>

                <View style={styles.divider} />

                {/* Breakdown */}
                <View style={styles.breakdownSection}>
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Subtotal</Text>
                    <Text style={styles.breakdownValue}>
                      KES {parseFloat(amount || "0").toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.breakdownRow}>
                    <View style={styles.feeRow}>
                      <Text style={styles.breakdownLabel}>Transaction Fee</Text>
                      <View style={styles.freeBadge}>
                        <Text style={styles.freeText}>FREE</Text>
                      </View>
                    </View>
                    <Text style={styles.feeValue}>KES 0.00</Text>
                  </View>
                  <View style={[styles.breakdownRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>
                      KES {total.toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Processing Time */}
                <View style={styles.processingInfo}>
                  <IconClock size={14} />
                  <Text style={styles.processingText}>
                    Usually processed instantly
                  </Text>
                </View>
              </ExpoLinearGradient>
            </View>

            {/* Warning Card */}
            <View style={styles.warningCard}>
              <View style={styles.warningIcon}>
                <IconAlertCircle size={20} />
              </View>
              <View style={styles.warningContent}>
                <Text style={styles.warningTitle}>Important</Text>
                <Text style={styles.warningText}>
                  Transactions cannot be reversed. Please verify all recipient details before confirming.
                </Text>
              </View>
            </View>

            {/* Confirm Button */}
            <Animated.View style={{ transform: [{ scale: buttonPulse }] }}>
              <Pressable
                onPress={handleConfirm}
                disabled={isProcessing}
                style={({ pressed }) => [
                  styles.confirmButton,
                  isProcessing && styles.confirmButtonDisabled,
                  pressed && !isProcessing && styles.confirmButtonPressed,
                ]}
              >
                <ExpoLinearGradient
                  colors={isProcessing ? ['#666', '#444'] : [ORANGE, ORANGE_DARK]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.confirmGradient}
                >
                  {isProcessing ? (
                    <>
                      <View style={styles.processingDot} />
                      <Text style={styles.confirmButtonText}>Processing...</Text>
                    </>
                  ) : (
                    <>
                      <IconSend size={18} />
                      <Text style={styles.confirmButtonText}>Confirm & Send</Text>
                    </>
                  )}
                </ExpoLinearGradient>
              </Pressable>
            </Animated.View>

            {/* Security Notes */}
            <View style={styles.securityNotes}>
              <View style={styles.securityItem}>
                <IconLock size={14} />
                <Text style={styles.securityText}>
                  End-to-end encrypted
                </Text>
              </View>
              <View style={styles.securityItem}>
                <IconCheckCircle size={14} />
                <Text style={styles.securityText}>
                  Protected by Stellar blockchain
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* PIN Modal */}
        <Modal
          visible={showPinModal}
          transparent={true}
          animationType="none"
          onRequestClose={() => setShowPinModal(false)}
        >
          <View style={styles.pinModal}>
            <Animated.View style={[
              styles.pinContent,
              { transform: [{ scale: pinModalScale }] }
            ]}>
              <ExpoLinearGradient
                colors={[CARD_BG, '#1E2A4A']}
                style={styles.pinGradient}
              >
                {/* Close Button */}
                <Pressable
                  onPress={() => setShowPinModal(false)}
                  style={styles.pinCloseButton}
                >
                  <IconX size={20} />
                </Pressable>

                <Text style={styles.pinTitle}>Enter PIN</Text>
                <Text style={styles.pinSubtitle}>
                  Confirm your transaction with your 4-digit PIN
                </Text>

                {/* PIN Dots */}
                <View style={styles.pinDots}>
                  {[0, 1, 2, 3].map((i) => (
                    <View
                      key={i}
                      style={[
                        styles.pinDot,
                        pin.length > i && styles.pinDotFilled,
                      ]}
                    >
                      {pin.length > i && <View style={styles.pinDotInner} />}
                    </View>
                  ))}
                </View>

                {/* Number Pad */}
                <View style={styles.numpad}>
                  {numpadKeys.map((row, rowIdx) => (
                    <View key={rowIdx} style={styles.numpadRow}>
                      {row.map((key, colIdx) => {
                        if (key === "") {
                          return <View key={colIdx} style={styles.numpadCell} />;
                        }
                        const isBackspace = key === "⌫";
                        return (
                          <Pressable
                            key={colIdx}
                            onPress={() =>
                              isBackspace ? handleBackspace() : handlePinInput(key)
                            }
                            style={({ pressed }) => [
                              styles.numpadCell,
                              styles.numpadButton,
                              pressed && styles.numpadButtonPressed,
                            ]}
                          >
                            {isBackspace ? (
                              <Text style={styles.backspaceText}>⌫</Text>
                            ) : (
                              <Text style={styles.numpadText}>{key}</Text>
                            )}
                          </Pressable>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </ExpoLinearGradient>
            </Animated.View>
          </View>
        </Modal>
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
  // Summary Card
  summaryCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  summaryGradient: {
    padding: 24,
    gap: 20,
  },
  summarySection: {
    gap: 12,
  },
  sectionLabel: {
    color: '#666',
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
  },
  recipientInfo: {
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
  recipientDetails: {
    flex: 1,
    gap: 4,
  },
  recipientName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: "700",
  },
  recipientMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recipientMetaText: {
    color: '#999',
    fontSize: 12,
    fontWeight: "500",
  },
  recipientId: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2A2A3E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  idLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  idValue: {
    color: '#999',
    fontSize: 12,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A3E',
  },
  amountValue: {
    color: ORANGE,
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: 1,
  },
  // Breakdown
  breakdownSection: {
    gap: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    color: '#999',
    fontSize: 14,
    fontWeight: "500",
  },
  breakdownValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "600",
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  freeBadge: {
    backgroundColor: GREEN + '15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  freeText: {
    color: GREEN,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  feeValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "500",
  },
  totalRow: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#2A2A3E',
  },
  totalLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: "700",
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: "800",
  },
  processingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  processingText: {
    color: '#666',
    fontSize: 12,
    fontWeight: "500",
  },
  // Warning Card
  warningCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FF9800' + '10',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FF9800' + '20',
  },
  warningIcon: {
    marginTop: 2,
  },
  warningContent: {
    flex: 1,
    gap: 4,
  },
  warningTitle: {
    color: '#FF9800',
    fontSize: 13,
    fontWeight: "700",
  },
  warningText: {
    color: '#999',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  // Confirm Button
  confirmButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  confirmButtonDisabled: {
    opacity: 0.7,
  },
  confirmButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  confirmGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  processingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    opacity: 0.6,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // Security Notes
  securityNotes: {
    gap: 8,
    alignItems: 'center',
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  securityText: {
    color: '#666',
    fontSize: 12,
    fontWeight: "500",
  },
  // PIN Modal
  pinModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  pinContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
  },
  pinGradient: {
    padding: 28,
    alignItems: 'center',
    gap: 24,
  },
  pinCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#2A2A3E',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  pinTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
  },
  pinSubtitle: {
    color: '#999',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: "500",
  },
  pinDots: {
    flexDirection: 'row',
    gap: 16,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDotFilled: {
    borderColor: ORANGE,
  },
  pinDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
  },
  numpad: {
    width: '100%',
    gap: 10,
  },
  numpadRow: {
    flexDirection: 'row',
    gap: 10,
  },
  numpadCell: {
    flex: 1,
    aspectRatio: 1.5,
    borderRadius: 12,
    maxWidth: 90,
  },
  numpadButton: {
    backgroundColor: '#2A2A3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numpadButtonPressed: {
    backgroundColor: ORANGE + '20',
  },
  numpadText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: "700",
  },
  backspaceText: {
    color: '#999',
    fontSize: 22,
    fontWeight: "600",
  },
});