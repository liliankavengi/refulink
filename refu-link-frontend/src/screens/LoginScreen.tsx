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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Rect, Line, Defs, LinearGradient, Stop } from "react-native-svg";
import * as LocalAuthentication from 'expo-local-authentication';
import React from "react";

const ORANGE = "#FF5722";
const ORANGE_LIGHT = "#FF8A65";
const ORANGE_DARK = "#E64A19";
const DARK_BG = "#1A1A2E";
const CARD_BG = "#16213E";

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function FingerprintIcon({ color = ORANGE, size = 64, opacity = 0.6 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
      <Path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
      <Path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
      <Path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
      <Path d="M2 12a10 10 0 0 1 18-6" />
      <Path d="M2 17c1 .5 2.23 1 3.5 1" />
      <Path d="M20 12c-.14 3-.8 5.4-2 7" />
      <Path d="M4.31 15.71A10 10 0 0 1 2 12" />
      <Path d="M6.5 10a6 6 0 0 1 11.5 2c0 1.5-.29 4-.29 4" />
      <Path d="M8 10.4A5 5 0 0 1 12 8" />
    </Svg>
  );
}

function IconAlertCircle({ color = ORANGE, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="8" x2="12" y2="12" />
      <Line x1="12" y1="16" x2="12.01" y2="16" />
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

function IconShield({ color = "#666", size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );
}

// Logo component
function LogoIcon({ size = 80 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Defs>
        <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={ORANGE} stopOpacity="1" />
          <Stop offset="100%" stopColor={ORANGE_LIGHT} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Circle cx="60" cy="60" r="55" stroke="url(#logoGradient)" strokeWidth="4" />
      <Path
        d="M40 40H80C85 40 90 45 90 50V63C90 70 85 75 80 75H40C35 75 30 70 30 65V50C30 45 35 40 40 40Z"
        stroke="url(#logoGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M75 55H85"
        stroke="url(#logoGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState("");
  const [attempts, setAttempts] = useState(0);
  const navigation = useNavigation<any>();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const dotScaleAnims = useRef([...Array(4)].map(() => new Animated.Value(1))).current;
  const errorSlide = useRef(new Animated.Value(-10)).current;
  const errorOpacity = useRef(new Animated.Value(0)).current;
  const biometricPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    checkBiometrics();
    
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(contentSlide, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Biometric pulse animation
    if (biometricAvailable) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(biometricPulse, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(biometricPulse, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [biometricAvailable]);

  useEffect(() => {
    if (error) {
      // Shake animation
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();

      // Show error
      Animated.parallel([
        Animated.spring(errorSlide, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(errorOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      Vibration.vibrate(100);
    } else {
      errorSlide.setValue(-10);
      errorOpacity.setValue(0);
    }
  }, [error]);

  const checkBiometrics = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      setBiometricAvailable(compatible && enrolled);
      
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType("Face ID");
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType("Fingerprint");
      }
    } catch (error) {
      setBiometricAvailable(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Log in with ${biometricType}`,
        fallbackLabel: 'Use PIN',
      });

      if (result.success) {
        setVerifying(true);
        setTimeout(() => {
          navigation.navigate("MainTabs");
        }, 500);
      }
    } catch (error) {
      console.log('Biometric error:', error);
    }
  };

  const handlePinInput = (digit: string) => {
    if (verifying) return;
    
    const newPin = pin + digit;
    if (newPin.length <= 4) {
      setPin(newPin);
      setError("");
      
      // Animate dot
      if (newPin.length > 0 && newPin.length <= 4) {
        Animated.sequence([
          Animated.spring(dotScaleAnims[newPin.length - 1], {
            toValue: 1.5,
            friction: 3,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.spring(dotScaleAnims[newPin.length - 1], {
            toValue: 1.1,
            friction: 3,
            tension: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }
      
      // Auto-verify when 4 digits
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const verifyPin = (enteredPin: string) => {
    setVerifying(true);
    setError("");

    setTimeout(() => {
      // Demo: accept any 4-digit PIN
      // Production: verify against stored PIN hash
      if (enteredPin === "1234" || enteredPin === "0000" || enteredPin.length === 4) {
        navigation.navigate("MainTabs");
      } else {
        setAttempts(prev => prev + 1);
        setError(
          attempts >= 2 
            ? "Too many attempts. Use biometrics or contact support."
            : "Invalid PIN. Please try again."
        );
        setPin("");
        setVerifying(false);
        
        // Reset dot animations
        dotScaleAnims.forEach(anim => anim.setValue(1));
      }
    }, 800);
  };

  const handleBackspace = () => {
    if (verifying) return;
    const newPin = pin.slice(0, -1);
    setPin(newPin);
    setError("");
    
    // Reset last dot
    if (newPin.length < 4 && newPin.length >= 0) {
      dotScaleAnims[newPin.length].setValue(1);
    }
  };

  const handleForgotPin = () => {
    setError("Please contact support to reset your PIN");
    setPin("");
    dotScaleAnims.forEach(anim => anim.setValue(1));
  };

  const PinDots = () => (
    <Animated.View style={[
      styles.dotsRow,
      { transform: [{ translateX: shakeAnim }] }
    ]}>
      {[0, 1, 2, 3].map((i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            pin.length > i && styles.dotFilled,
            { transform: [{ scale: dotScaleAnims[i] }] }
          ]}
        >
          {pin.length > i && <View style={styles.dotInner} />}
        </Animated.View>
      ))}
    </Animated.View>
  );

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
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.content}>
            {/* Logo Section */}
            <Animated.View style={[
              styles.logoSection,
              {
                opacity: fadeAnim,
                transform: [{ scale: logoScale }]
              }
            ]}>
              <View style={styles.logoContainer}>
                <LogoIcon size={80} />
              </View>
              <Text style={styles.appName}>REF-M-LINK</Text>
              <Text style={styles.welcomeText}>Welcome back</Text>
            </Animated.View>

            {/* Main Section */}
            <Animated.View style={[
              styles.mainSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: contentSlide }]
              }
            ]}>
              {/* Biometric Icon */}
              {biometricAvailable && (
                <Pressable
                  onPress={handleBiometricLogin}
                  style={styles.biometricContainer}
                >
                  <Text style={styles.biometricText}>
                    Tap for {biometricType}
                  </Text>
                </Pressable>
              )}

              {/* PIN Entry Label */}
              <Text style={styles.instructionText}>
                {biometricAvailable 
                  ? "Or enter your PIN to unlock"
                  : "Enter your PIN to unlock"
                }
              </Text>

              {/* PIN Dots */}
              {PinDots()}

              {/* Error Message */}
              {error !== "" && (
                <Animated.View style={[
                  styles.errorCard,
                  {
                    opacity: errorOpacity,
                    transform: [{ translateY: errorSlide }]
                  }
                ]}>
                  <IconAlertCircle size={18} />
                  <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
              )}

              {/* Verifying State */}
              {verifying && (
                <Text style={styles.verifyingText}>Verifying...</Text>
              )}

              {/* Number Pad */}
              <View style={styles.numpad}>
                {numpadKeys.map((row, rowIdx) => (
                  <View key={rowIdx} style={styles.numpadRow}>
                    {row.map((key, colIdx) => {
                      if (key === "") {
                        return <View key={colIdx} style={styles.numpadCell} />;
                      }
                      const isBackspace = key === "⌫";
                      const isDisabled = verifying || (attempts >= 3 && !isBackspace);
                      
                      return (
                        <Pressable
                          key={colIdx}
                          onPress={() =>
                            isBackspace ? handleBackspace() : handlePinInput(key)
                          }
                          disabled={isDisabled}
                          style={({ pressed }) => [
                            styles.numpadCell,
                            styles.numpadButton,
                            isBackspace && styles.backspaceButton,
                            isDisabled && !isBackspace && styles.numpadButtonDisabled,
                            pressed && !isDisabled && styles.numpadButtonPressed,
                          ]}
                        >
                          <Text style={[
                            styles.numpadText,
                            isBackspace && styles.backspaceText,
                            isDisabled && !isBackspace && styles.numpadTextDisabled,
                          ]}>
                            {key}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ))}
              </View>

              {/* Bottom Links */}
              <View style={styles.bottomLinks}>
                <Pressable
                  onPress={() => navigation.navigate("Onboarding")}
                  style={styles.linkButton}
                >
                  <Text style={styles.linkTextPrimary}>New User? Create Account</Text>
                </Pressable>
                <Pressable
                  onPress={handleForgotPin}
                  style={styles.linkButton}
                >
                  <Text style={styles.linkTextSecondary}>Forgot PIN?</Text>
                </Pressable>
              </View>

              {/* Security Note */}
              <View style={styles.securityNote}>
                <IconShield size={14} />
                <Text style={styles.securityText}>
                  Secure login protected by encryption
                </Text>
              </View>
            </Animated.View>
          </View>
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
    width: 300,
    height: 300,
    top: -100,
    right: -100,
    opacity: 0.04,
  },
  bgCircle2: {
    width: 200,
    height: 200,
    bottom: 150,
    left: -80,
    opacity: 0.03,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 40,
  },
  // Logo Section
  logoSection: {
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  appName: {
    color: ORANGE,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 6,
  },
  welcomeText: {
    color: '#999',
    fontSize: 14,
    fontWeight: "500",
  },
  // Main Section
  mainSection: {
    alignItems: 'center',
    gap: 15,
  },
  // Biometric
  biometricContainer: {
    alignItems: 'center',
    gap: 8,
  },
  biometricIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ORANGE + '10',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ORANGE + '20',
  },
  biometricText: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: "600",
  },
  // Instruction
  instructionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: "600",
  },
  // PIN Dots
  dotsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2A2A3E',
    borderWidth: 2,
    borderColor: '#3A3A4E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotFilled: {
    backgroundColor: ORANGE + '20',
    borderColor: ORANGE,
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
  },
  // Error
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: ORANGE + '10',
    borderRadius: 14,
    padding: 14,
    width: '100%',
    borderWidth: 1,
    borderColor: ORANGE + '20',
  },
  errorText: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  // Verifying
  verifyingText: {
    color: ORANGE,
    fontSize: 11,
    fontWeight: "600",
    textAlign: 'center',
  },
  // Number Pad
  numpad: {
    width: '100%',
    maxWidth: 320,
    gap: 10,
  },
  numpadRow: {
    flexDirection: 'row',
    gap: 10,
  },
  numpadCell: {
    flex: 1,
    aspectRatio: 1.5,
    borderRadius: 14,
  },
  numpadButton: {
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  numpadButtonDisabled: {
    opacity: 0.4,
  },
  numpadButtonPressed: {
    backgroundColor: ORANGE + '15',
    borderColor: ORANGE + '30',
  },
  backspaceButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  numpadText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: "700",
  },
  numpadTextDisabled: {
    opacity: 0.3,
  },
  backspaceText: {
    color: '#999',
    fontSize: 20,
    fontWeight: "600",
  },
  // Bottom Links
  bottomLinks: {
    gap: 12,
    alignItems: 'center',
  },
  linkButton: {
    padding: 8,
  },
  linkTextPrimary: {
    color: ORANGE,
    fontSize: 14,
    fontWeight: "600",
  },
  linkTextSecondary: {
    color: '#999',
    fontSize: 14,
    fontWeight: "600",
  },
  // Security Note
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  securityText: {
    color: '#666',
    fontSize: 11,
    fontWeight: "500",
  },
});