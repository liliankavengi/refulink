import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
  StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import * as LocalAuthentication from "expo-local-authentication";
import React from "react";

const { width } = Dimensions.get('window');
const ORANGE = "#FF5722";
const ORANGE_LIGHT = "#FF8A65";
const ORANGE_DARK = "#E64A19";
const DARK_BG = "#1A1A2E";
const CARD_BG = "#16213E";

// Enhanced Fingerprint SVG with gradient
function FingerprintIcon({ size = 140, progress = 1 }) {
  const scale = size / 24;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="url(#fingerprintGradient)"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="100"
      strokeDashoffset={100 * (1 - progress)}
    >
      <Defs>
        <LinearGradient id="fingerprintGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={ORANGE} stopOpacity="1" />
          <Stop offset="50%" stopColor={ORANGE_LIGHT} stopOpacity="1" />
          <Stop offset="100%" stopColor={ORANGE} stopOpacity="1" />
        </LinearGradient>
      </Defs>
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

// Shield icon for security
function ShieldIcon({ size = 24, color = ORANGE }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L3 7V12C3 17.55 7.84 22.74 12 24C16.16 22.74 21 17.55 21 12V7L12 2Z"
        fill={color}
        opacity="0.2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <Path
        d="M12 8V13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="12" cy="16" r="1" fill={color} />
    </Svg>
  );
}

export default function BiometricScreen() {
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanFailed, setScanFailed] = useState(false);
  const navigation = useNavigation<any>();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const drawProgress = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
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
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const handleScan = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      setScanFailed(true);
      return;
    }

    setScanning(true);
    setScanFailed(false);

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Verify your identity",
      fallbackLabel: "Use PIN instead",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });

    if (result.success) {
      setScanning(false);
      setScanComplete(true);
      Animated.sequence([
        Animated.spring(successScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
      ]).start(() => {
        navigation.navigate("ChangePin", { fromOnboarding: true });
      });
    } else {
      setScanning(false);
      setScanFailed(true);
    }
  };

  const handleSkip = () => {
    navigation.navigate("ChangePin", { fromOnboarding: true });
  };

  const spin = ringRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '50%'],
  });

  const dotsOpacity = dotsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const scanLinePosition = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 50],
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

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[
          styles.inner,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          {/* Step Indicator */}
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepIndicator}>STEP 2 OF 3</Text>
              <Text style={styles.progressPercent}>50%</Text>
            </View>
            
            {/* Progress Bar */}
            <View style={styles.progressTrack}>
              <Animated.View style={[
                styles.progressFill,
                { width: progressWidth }
              ]}>
                <ExpoLinearGradient
                  colors={[ORANGE, ORANGE_LIGHT]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.progressGradient}
                />
              </Animated.View>
            </View>
            
            <View style={styles.progressSteps}>
              <View style={styles.progressDotComplete} />
              <View style={styles.progressDotLineComplete} />
              <View style={styles.progressDotActive} />
              <View style={styles.progressDotLine} />
              <View style={styles.progressDot} />
            </View>
          </View>

          {/* Header */}
          <View style={styles.headerBlock}>
            <View style={styles.shieldIconContainer}>
              <ShieldIcon size={32} />
            </View>
            <Text style={styles.title}>Secure Your Wallet</Text>
            <Text style={styles.subtitle}>
              Add biometric protection to keep your assets safe
            </Text>
          </View>

          {/* Instructions Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoDot} />
              <Text style={styles.infoText}>
                Use face or fingerprint to lock your identity
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <View style={styles.infoDot} />
              <Text style={styles.infoText}>
                Create a 4-digit PIN for quick access
              </Text>
            </View>
          </View>

          {/* Biometric Scanner */}
          <View style={styles.scannerContainer}>
            <View style={styles.scannerWrapper}>
              {/* Outer rotating ring */}
              {scanning && (
                <Animated.View style={[
                  styles.outerRing,
                  {
                    transform: [
                      { rotate: spin },
                      { scale: ringScale }
                    ]
                  }
                ]}>
                  <ExpoLinearGradient
                    colors={[ORANGE + '00', ORANGE, ORANGE + '00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.ringGradient}
                  />
                </Animated.View>
              )}
              
              {/* Success ring */}
              {scanComplete && (
                <Animated.View style={[
                  styles.successRing,
                  { transform: [{ scale: successScale }] }
                ]}>
                  <View style={styles.successCheckmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                </Animated.View>
              )}
              
              {/* Fingerprint icon */}
              <Animated.View style={[
                styles.fingerprintContainer,
                { transform: [{ scale: pulseAnim }] }
              ]}>
                <FingerprintIcon 
                  size={140} 
                  progress={scanning ? 1 : 0}
                />
                
                {/* Scanning dots */}
                {scanning && (
                  <View style={styles.scanningDots}>
                    <Animated.View style={[styles.scanDot, { opacity: dotsOpacity }]} />
                    <Animated.View style={[styles.scanDot, styles.scanDotCenter, { opacity: dotsAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }]} />
                    <Animated.View style={[styles.scanDot, { opacity: dotsOpacity }]} />
                  </View>
                )}
              </Animated.View>
            </View>
            
            {/* Scan status */}
            <View style={styles.statusContainer}>
              {!scanning && !scanComplete && !scanFailed && (
                <Text style={styles.statusText}>Ready to scan</Text>
              )}
              {scanning && (
                <View style={styles.scanningStatus}>
                  <View style={styles.scanningDot} />
                  <Text style={styles.scanningText}>Scanning...</Text>
                </View>
              )}
              {scanComplete && (
                <View style={styles.successStatus}>
                  <Text style={styles.successText}>Verified ✓</Text>
                </View>
              )}
              {scanFailed && (
                <View style={styles.failedStatus}>
                  <Text style={styles.failedText}>Try again</Text>
                </View>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonBlock}>
            <Pressable
              onPress={handleScan}
              disabled={scanning || scanComplete}
              style={({ pressed }) => [
                styles.buttonWrapper,
                (scanning || scanComplete) && styles.buttonDisabled,
                pressed && !scanning && !scanComplete && styles.buttonPressed,
              ]}
            >
              <ExpoLinearGradient
                colors={
                  scanComplete 
                    ? ['#4CAF50', '#2E7D32']
                    : [ORANGE, ORANGE_DARK]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>
                  {scanning ? "Scanning..." : scanComplete ? "Verified!" : "Scan Now"}
                </Text>
                <Text style={styles.buttonIcon}>
                  {scanComplete ? "✓" : "→"}
                </Text>
              </ExpoLinearGradient>
            </Pressable>

            <Pressable
              onPress={handleSkip}
              disabled={scanning}
              style={({ pressed }) => [
                styles.secondaryButton,
                scanning && styles.buttonDisabled,
                pressed && !scanning && styles.buttonPressed,
              ]}
            >
              <Text style={styles.secondaryButtonText}>
                Set up later
              </Text>
            </Pressable>
          </View>

          {/* Security Notice */}
          <View style={styles.securityNotice}>
            <ShieldIcon size={16} />
            <Text style={styles.securityText}>
              Your biometric data never leaves your device
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

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
    top: -100,
    right: -100,
    opacity: 0.05,
  },
  bgCircle2: {
    width: 180,
    height: 180,
    bottom: 150,
    left: -80,
    opacity: 0.03,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  inner: {
    width: "100%",
    maxWidth: 420,
    alignSelf: 'center',
    gap: 32,
  },
  // Step Progress
  stepContainer: {
    gap: 12,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepIndicator: {
    color: ORANGE_LIGHT,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 4,
  },
  progressPercent: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: "700",
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#2A2A3E',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressGradient: {
    height: '100%',
    width: '100%',
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2A2A3E',
  },
  progressDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  progressDotComplete: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE + '60',
  },
  progressDotLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2A2A3E',
    marginHorizontal: 4,
  },
  progressDotLineComplete: {
    flex: 1,
    height: 1,
    backgroundColor: ORANGE + '30',
    marginHorizontal: 4,
  },
  // Header
  headerBlock: {
    gap: 8,
  },
  shieldIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: ORANGE + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ORANGE + '30',
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 1,
  },
  subtitle: {
    color: '#999',
    fontSize: 15,
    lineHeight: 22,
  },
  // Info Card
  infoCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
    opacity: 0.6,
  },
  infoText: {
    color: '#CCC',
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#2A2A3E',
  },
  // Scanner
  scannerContainer: {
    alignItems: 'center',
    gap: 24,
  },
  scannerWrapper: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: ORANGE + '40',
  },
  ringGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 90,
  },
  successRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#4CAF50' + '20',
    borderWidth: 3,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCheckmark: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: "bold",
  },
  fingerprintContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  scanDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
  },
  scanDotCenter: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  // Status
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    color: '#666',
    fontSize: 14,
    fontWeight: "600",
  },
  scanningStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scanningDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ORANGE,
  },
  scanningText: {
    color: ORANGE,
    fontSize: 14,
    fontWeight: "600",
  },
  successStatus: {
    backgroundColor: '#4CAF50' + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: "700",
  },
  failedStatus: {
    backgroundColor: ORANGE + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  failedText: {
    color: ORANGE,
    fontSize: 14,
    fontWeight: "700",
  },
  // Buttons
  buttonBlock: {
    gap: 16,
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  primaryButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: "800",
    fontSize: 17,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  buttonIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: "300",
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  secondaryButtonText: {
    color: ORANGE,
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 1,
  },
  // Security Notice
  securityNotice: {
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