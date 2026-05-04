import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Vibration,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Line, Polyline, Rect } from "react-native-svg";
import * as LocalAuthentication from 'expo-local-authentication';

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

function FingerprintIcon({ color = ORANGE, size = 80, opacity = 1 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none" opacity={opacity}>
      {/* Outer arc */}
      <Path
        d="M15 55 C15 30 35 12 50 12 C65 12 85 30 85 55"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Second arc */}
      <Path
        d="M22 62 C22 38 34 20 50 20 C66 20 78 38 78 62"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Third arc */}
      <Path
        d="M30 68 C30 46 38 28 50 28 C62 28 70 46 70 68"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Fourth arc */}
      <Path
        d="M38 72 C38 54 43 38 50 38 C57 38 62 54 62 72"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Center loop */}
      <Path
        d="M45 72 C45 62 47 50 50 50 C53 50 55 62 55 72"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Bottom curve connecting lines */}
      <Path
        d="M15 55 C15 75 25 88 35 88"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M85 55 C85 75 75 88 65 88"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M22 68 C22 80 30 88 38 88"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M78 68 C78 80 70 88 62 88"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

function IconCheckCircle({ color = ORANGE, size = 100, strokeWidth = 1.5 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" opacity={0.1} fill={color} />
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Polyline points="22 4 12 14.01 9 11.01" />
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

function IconLock({ color = ORANGE, size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );
}

function IconCalendar({ color = "#666", size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <Line x1="16" y1="2" x2="16" y2="6" />
      <Line x1="8" y1="2" x2="8" y2="6" />
      <Line x1="3" y1="10" x2="21" y2="10" />
    </Svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type RouteParams = {
  RequestLoan: {
    amount: number;
  };
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function RequestLoanScreen() {
  const [scanning, setScanning] = useState(false);
  const [approved, setApproved] = useState(false);
  const [biometricType, setBiometricType] = useState("Biometrics");
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, "RequestLoan">>();
  const { amount } = route.params || { amount: 0 };

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const processingDots = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkBiometrics();
    
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
  }, []);

  useEffect(() => {
    if (scanning) {
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Ripple animations
      Animated.loop(
        Animated.sequence([
          Animated.timing(ripple1, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(ripple1, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();

      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(ripple2, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(ripple2, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, 1000);

      // Processing dots
      Animated.loop(
        Animated.timing(processingDots, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [scanning]);

  useEffect(() => {
    if (approved) {
      Animated.parallel([
        Animated.spring(successScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(successOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [approved]);

  const checkBiometrics = async () => {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType("Face ID");
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType("Fingerprint");
      }
    } catch (error) {
      console.log('Error checking biometrics:', error);
    }
  };

  const handleBiometricConfirm = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Confirm loan of KES ${amount.toLocaleString()}`,
        fallbackLabel: 'Use PIN',
      });

      if (result.success) {
        setScanning(true);
        Vibration.vibrate(100);
        
        // Simulate processing
        setTimeout(() => {
          setScanning(false);
          setApproved(true);
          
          setTimeout(() => {
            navigation.navigate("LoanSuccess", { amount });
          }, 2000);
        }, 2500);
      }
    } catch (error) {
      console.log('Biometric error:', error);
    }
  };

  const totalRepayment = amount * 1.05;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  const rippleScale1 = ripple1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 2],
  });

  const rippleOpacity1 = ripple1.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.3, 0.1, 0],
  });

  const rippleScale2 = ripple2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1.5],
  });

  const rippleOpacity2 = ripple2.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.2, 0.08, 0],
  });

  const dotsOpacity = processingDots.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

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
              <Text style={styles.headerTitle}>Confirm Loan</Text>
              <Text style={styles.headerSubtitle}>
                Review and approve your loan
              </Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.mainContent}>
          <Animated.View style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            {!approved ? (
              <>
                {/* Loan Summary Card */}
                <Animated.View style={[
                  styles.summaryCard,
                  { transform: [{ scale: cardScale }] }
                ]}>
                  <ExpoLinearGradient
                    colors={[CARD_BG, '#1E2A4A']}
                    style={styles.summaryGradient}
                  >
                    <Text style={styles.summaryLabel}>LOAN AMOUNT</Text>
                    <Text style={styles.summaryAmount}>
                      KES {amount.toLocaleString()}
                    </Text>

                    <View style={styles.summaryDivider} />

                    <View style={styles.summaryRow}>
                      <View style={styles.summaryDetail}>
                        <IconLock size={14} />
                        <Text style={styles.summaryDetailLabel}>
                          Total Repayment
                        </Text>
                      </View>
                      <Text style={styles.summaryDetailValue}>
                        KES {totalRepayment.toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.summaryRow}>
                      <View style={styles.summaryDetail}>
                        <IconCalendar size={14} />
                        <Text style={styles.summaryDetailLabel}>
                          Due Date
                        </Text>
                      </View>
                      <Text style={styles.summaryDetailValue}>
                        30 days
                      </Text>
                    </View>

                    <View style={styles.summaryRow}>
                      <View style={styles.summaryDetail}>
                        <IconShield size={14} />
                        <Text style={styles.summaryDetailLabel}>
                          Interest Rate
                        </Text>
                      </View>
                      <Text style={styles.summaryDetailValue}>
                        5%
                      </Text>
                    </View>
                  </ExpoLinearGradient>
                </Animated.View>

                {/* Biometric Section */}
                <View style={styles.biometricSection}>
                  {/* Animated Rings */}
                  {scanning && (
                    <View style={styles.ringsContainer}>
                      <Animated.View style={[
                        styles.ring,
                        {
                          transform: [{ scale: rippleScale1 }],
                          opacity: rippleOpacity1,
                        }
                      ]} />
                      <Animated.View style={[
                        styles.ring,
                        {
                          transform: [{ scale: rippleScale2 }],
                          opacity: rippleOpacity2,
                        }
                      ]} />
                    </View>
                  )}

                  {/* Fingerprint Icon */}
                  <Animated.View style={[
                    styles.fingerprintContainer,
                    { transform: [{ scale: scanning ? pulseAnim : 1 }] }
                  ]}>
                    <View style={styles.fingerprintIcon}>
                      <FingerprintIcon 
                        size={80} 
                        opacity={scanning ? 0.9 : 0.6} 
                      />
                    </View>
                  </Animated.View>

                  {/* Status Text */}
                  <View style={styles.statusTextContainer}>
                    {!scanning ? (
                      <>
                        <Text style={styles.statusTitle}>
                          Confirm with {biometricType}
                        </Text>
                        <Text style={styles.statusDescription}>
                          Scan your {biometricType.toLowerCase()} to approve the loan
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.scanningTitle}>
                          Verifying identity...
                        </Text>
                        <Text style={styles.scanningDescription}>
                          Processing via Soroban Smart Contract
                        </Text>
                        <Animated.View style={[
                          styles.processingDots,
                          { opacity: dotsOpacity }
                        ]}>
                          <Text style={styles.dotText}>...</Text>
                        </Animated.View>
                      </>
                    )}
                  </View>
                </View>

                {/* Confirm Button */}
                {!scanning && (
                  <Pressable
                    onPress={handleBiometricConfirm}
                    style={({ pressed }) => [
                      styles.confirmButton,
                      pressed && styles.confirmButtonPressed,
                    ]}
                  >
                    <ExpoLinearGradient
                      colors={[ORANGE, ORANGE_DARK]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.confirmGradient}
                    >
                      <IconLock color="#FFFFFF" size={18} />
                      <Text style={styles.confirmButtonText}>Confirm Loan</Text>
                    </ExpoLinearGradient>
                  </Pressable>
                )}

                {/* Security Note */}
                <View style={styles.securityNote}>
                  <IconShield size={14} />
                  <Text style={styles.securityText}>
                    Loan agreement secured by Stellar blockchain
                  </Text>
                </View>
              </>
            ) : (
              /* Success State */
              <Animated.View style={[
                styles.successSection,
                {
                  opacity: successOpacity,
                  transform: [{ scale: successScale }]
                }
              ]}>
                <View style={styles.successIcon}>
                  <IconCheckCircle size={100} />
                </View>
                <Text style={styles.successTitle}>LOAN APPROVED</Text>
                <Text style={styles.successSubtitle}>
                  KES {amount.toLocaleString()} released to your wallet
                </Text>
                
                <View style={styles.successDetails}>
                  <View style={styles.successRow}>
                    <Text style={styles.successLabel}>Transaction ID</Text>
                    <Text style={styles.successValue}>
                      LN-{Date.now().toString(36).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.successRow}>
                    <Text style={styles.successLabel}>Expected in wallet</Text>
                    <Text style={styles.successValue}>Within minutes</Text>
                  </View>
                </View>
              </Animated.View>
            )}
          </Animated.View>
        </View>
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
  // Main Content
  mainContent: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 32,
  },
  // Summary Card
  summaryCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ORANGE + '30',
  },
  summaryGradient: {
    padding: 24,
    gap: 20,
  },
  summaryLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
    textAlign: 'center',
  },
  summaryAmount: {
    color: ORANGE,
    fontSize: 42,
    fontWeight: "800",
    textAlign: 'center',
    letterSpacing: 1,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#2A2A3E',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryDetailLabel: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
  },
  summaryDetailValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: "600",
  },
  // Biometric Section
  biometricSection: {
    alignItems: 'center',
    gap: 20,
  },
  ringsContainer: {
    position: 'absolute',
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: ORANGE,
  },
  fingerprintContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerprintIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: ORANGE + '10',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ORANGE + '20',
  },
  statusTextContainer: {
    alignItems: 'center',
    gap: 8,
  },
  statusTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  statusDescription: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
    textAlign: 'center',
  },
  scanningTitle: {
    color: ORANGE,
    fontSize: 16,
    fontWeight: "700",
  },
  scanningDescription: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
    textAlign: 'center',
  },
  processingDots: {
    marginTop: 4,
  },
  dotText: {
    color: ORANGE,
    fontSize: 24,
    letterSpacing: 4,
  },
  // Confirm Button
  confirmButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  confirmGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  confirmButtonText: {
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
  },
  securityText: {
    color: '#666',
    fontSize: 12,
    fontWeight: "500",
  },
  // Success Section
  successSection: {
    alignItems: 'center',
    gap: 20,
  },
  successIcon: {
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 2,
  },
  successSubtitle: {
    color: ORANGE,
    fontSize: 16,
    fontWeight: "600",
    textAlign: 'center',
  },
  successDetails: {
    width: '100%',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  successLabel: {
    color: '#999',
    fontSize: 12,
    fontWeight: "500",
  },
  successValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: "600",
  },
});