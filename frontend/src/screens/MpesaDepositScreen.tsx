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
  Clipboard,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Line, Rect, Polyline } from "react-native-svg";

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

function IconSmartphone({ color = ORANGE, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <Line x1="12" y1="18" x2="12.01" y2="18" />
    </Svg>
  );
}

function IconCopy({ color = ORANGE, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </Svg>
  );
}

function IconCheckCircle({ color = GREEN, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Polyline points="22 4 12 14.01 9 11.01" />
    </Svg>
  );
}

function IconClock({ color = ORANGE, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Polyline points="12 6 12 12 16 14" />
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

function IconInfo({ color = "#666", size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="16" x2="12" y2="12" />
      <Line x1="12" y1="8" x2="12.01" y2="8" />
    </Svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MpesaDepositScreen() {
  const [waiting, setWaiting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const stepsAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const statusSlide = useRef(new Animated.Value(20)).current;

  // M-PESA details
  const paybillNumber = "123456";
  const accountNumber = "YOUR_RIN_NUMBER";

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
      Animated.timing(stepsAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (waiting) {
      // Pulse animation for waiting status
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Slide in waiting status
      Animated.spring(statusSlide, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      pulseAnim.setValue(1);
      statusSlide.setValue(20);
    }
  }, [waiting]);

  const handleCopy = (text: string, field: string) => {
    Clipboard.setString(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePaid = () => {
    setWaiting(true);
    setTimeout(() => {
      navigation.navigate("Dashboard");
    }, 3000);
  };

  const mpesaSteps = [
    {
      step: 1,
      text: "Go to M-PESA menu on your phone",
      icon: "📱",
    },
    {
      step: 2,
      text: "Select Lipa na M-PESA",
      icon: "💳",
    },
    {
      step: 3,
      text: "Choose Paybill",
      icon: "🏢",
    },
    {
      step: 4,
      text: "Enter Business Number",
      icon: "🔢",
    },
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
              <Text style={styles.headerTitle}>M-PESA Deposit</Text>
              <Text style={styles.headerSubtitle}>
                Deposit via Paybill
              </Text>
            </View>
            <View style={styles.mpesaIcon}>
              <IconSmartphone size={20} />
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
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            {/* Steps Card */}
            <View style={styles.stepsCard}>
              <ExpoLinearGradient
                colors={[CARD_BG, '#1E2A4A']}
                style={styles.stepsGradient}
              >
                <Text style={styles.stepsTitle}>Follow These Steps</Text>
                
                <View style={styles.stepsList}>
                  {mpesaSteps.map((item, index) => (
                    <Animated.View
                      key={item.step}
                      style={[
                        styles.stepItem,
                        {
                          opacity: stepsAnim,
                          transform: [{
                            translateX: stepsAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [50 - (index * 10), 0],
                            })
                          }]
                        }
                      ]}
                    >
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{item.step}</Text>
                      </View>
                      <Text style={styles.stepText}>{item.text}</Text>
                    </Animated.View>
                  ))}
                </View>
              </ExpoLinearGradient>
            </View>

            {/* M-PESA Details Card */}
            <View style={styles.detailsCard}>
              <ExpoLinearGradient
                colors={[CARD_BG, '#1E2A4A']}
                style={styles.detailsGradient}
              >
                <Text style={styles.detailsTitle}>Payment Details</Text>
                
                {/* Paybill Number */}
                <View style={styles.detailItem}>
                  <View style={styles.detailInfo}>
                    <IconDollarSign size={16} />
                    <Text style={styles.detailLabel}>Business Number</Text>
                  </View>
                  <Pressable
                    onPress={() => handleCopy(paybillNumber, 'paybill')}
                    style={styles.copyRow}
                  >
                    <Text style={styles.detailValue}>{paybillNumber}</Text>
                    <View style={styles.copyButton}>
                      <IconCopy size={14} />
                      <Text style={styles.copyText}>
                        {copiedField === 'paybill' ? 'Copied!' : 'Copy'}
                      </Text>
                    </View>
                  </Pressable>
                </View>

                <View style={styles.detailDivider} />

                {/* Account Number */}
                <View style={styles.detailItem}>
                  <View style={styles.detailInfo}>
                    <IconShield size={16} />
                    <Text style={styles.detailLabel}>Account Number</Text>
                  </View>
                  <Pressable
                    onPress={() => handleCopy(accountNumber, 'account')}
                    style={styles.copyRow}
                  >
                    <Text style={styles.detailValue}>{accountNumber}</Text>
                    <View style={styles.copyButton}>
                      <IconCopy size={14} />
                      <Text style={styles.copyText}>
                        {copiedField === 'account' ? 'Copied!' : 'Copy'}
                      </Text>
                    </View>
                  </Pressable>
                </View>

                {/* Note */}
                <View style={styles.noteRow}>
                  <IconInfo size={14} />
                  <Text style={styles.noteText}>
                    Use your RIN as the account number for automatic verification
                  </Text>
                </View>
              </ExpoLinearGradient>
            </View>

            {/* Waiting Status */}
            {waiting && (
              <Animated.View style={[
                styles.waitingCard,
                {
                  transform: [{ translateY: statusSlide }]
                }
              ]}>
                <ExpoLinearGradient
                  colors={[ORANGE + '10', ORANGE + '05']}
                  style={styles.waitingGradient}
                >
                  <View style={styles.waitingContent}>
                    <Animated.View style={[
                      styles.waitingDot,
                      { transform: [{ scale: pulseAnim }] }
                    ]} />
                    <View style={styles.waitingInfo}>
                      <Text style={styles.waitingTitle}>Confirming Payment</Text>
                      <Text style={styles.waitingText}>
                        Waiting for M-PESA confirmation...
                      </Text>
                    </View>
                  </View>
                  
                  {/* Processing steps */}
                  <View style={styles.processingSteps}>
                    <View style={styles.processingStep}>
                      <IconCheckCircle size={14} />
                      <Text style={styles.processingStepText}>Payment sent</Text>
                    </View>
                    <View style={styles.processingStep}>
                      <IconClock size={14} />
                      <Text style={styles.processingStepActive}>Verifying</Text>
                    </View>
                    <View style={styles.processingStep}>
                      <View style={styles.processingDotInactive} />
                      <Text style={styles.processingStepInactive}>Credited</Text>
                    </View>
                  </View>
                </ExpoLinearGradient>
              </Animated.View>
            )}

            {/* Tips Card */}
            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>Important Tips</Text>
              <View style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>
                  Enter the exact business number shown above
                </Text>
              </View>
              <View style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>
                  Your RIN must match your registered account
                </Text>
              </View>
              <View style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>
                  Deposits reflect within 1-2 minutes
                </Text>
              </View>
            </View>

            {/* Action Button */}
            <Pressable
              onPress={handlePaid}
              disabled={waiting}
              style={({ pressed }) => [
                styles.payButton,
                waiting && styles.payButtonDisabled,
                pressed && !waiting && styles.payButtonPressed,
              ]}
            >
              <ExpoLinearGradient
                colors={waiting ? ['#444', '#333'] : [ORANGE, ORANGE_DARK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.payButtonGradient}
              >
                {waiting ? (
                  <>
                    <Animated.View style={[
                      styles.payButtonDot,
                      { transform: [{ scale: pulseAnim }] }
                    ]} />
                    <Text style={styles.payButtonText}>Processing...</Text>
                  </>
                ) : (
                  <>
                    <IconCheckCircle color="#FFFFFF" size={18} />
                    <Text style={styles.payButtonText}>I Have Paid</Text>
                  </>
                )}
              </ExpoLinearGradient>
            </Pressable>

            {/* Security Note */}
            <View style={styles.securityNote}>
              <IconShield size={14} />
              <Text style={styles.securityText}>
                Your payment is secure and encrypted
              </Text>
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
  mpesaIcon: {
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
  // Steps Card
  stepsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  stepsGradient: {
    padding: 20,
    gap: 20,
  },
  stepsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: "800",
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  // Details Card
  detailsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  detailsGradient: {
    padding: 20,
    gap: 16,
  },
  detailsTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
  detailItem: {
    gap: 8,
  },
  detailInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    color: '#999',
    fontSize: 12,
    fontWeight: "600",
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DARK_BG,
    padding: 14,
    borderRadius: 14,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 2,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ORANGE + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyText: {
    color: ORANGE,
    fontSize: 11,
    fontWeight: "700",
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#2A2A3E',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#2A2A3E',
    padding: 12,
    borderRadius: 12,
  },
  noteText: {
    color: '#999',
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
    lineHeight: 16,
  },
  // Waiting Card
  waitingCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ORANGE + '20',
  },
  waitingGradient: {
    padding: 20,
    gap: 20,
  },
  waitingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  waitingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ORANGE,
  },
  waitingInfo: {
    flex: 1,
    gap: 4,
  },
  waitingTitle: {
    color: ORANGE,
    fontSize: 15,
    fontWeight: "700",
  },
  waitingText: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
  },
  processingSteps: {
    gap: 10,
    paddingLeft: 26,
  },
  processingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  processingStepText: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "600",
  },
  processingStepActive: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: "600",
  },
  processingStepInactive: {
    color: '#444',
    fontSize: 13,
    fontWeight: "500",
  },
  processingDotInactive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#444',
  },
  // Tips Card
  tipsCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    gap: 12,
  },
  tipsTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ORANGE,
    marginTop: 6,
  },
  tipText: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
    lineHeight: 18,
  },
  // Pay Button
  payButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  payButtonGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  payButtonDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
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