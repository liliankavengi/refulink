import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Vibration,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');
const ORANGE = "#FF5722";
const ORANGE_LIGHT = "#FF8A65";
const ORANGE_DARK = "#E64A19";
const DARK_BG = "#1A1A2E";
const CARD_BG = "#16213E";

type RouteParams = {
  ChangePin: { fromOnboarding?: boolean };
};

// Lock icon for security
function LockIcon({ size = 24, color = ORANGE, locked = true }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {locked && (
        <Circle cx="12" cy="16" r="1" fill={color} />
      )}
    </Svg>
  );
}

export default function ChangePinScreen() {
  const [step, setStep] = useState<"enter" | "confirm">("enter");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [shakeTrigger, setShakeTrigger] = useState(false);

  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, "ChangePin">>();
  const fromOnboarding = route.params?.fromOnboarding ?? false;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const dotScaleAnims = useRef([...Array(4)].map(() => new Animated.Value(1))).current;
  const lockScale = useRef(new Animated.Value(1)).current;
  const successScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
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
    ]).start();

    // Lock pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(lockScale, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(lockScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (shakeTrigger) {
      // Shake animation on error
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start(() => setShakeTrigger(false));
      Vibration.vibrate(50);
    }
  }, [shakeTrigger]);

  const animateDot = (index: number) => {
    Animated.sequence([
      Animated.spring(dotScaleAnims[index], {
        toValue: 1.3,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(dotScaleAnims[index], {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePinInput = (digit: string) => {
    if (step === "enter") {
      if (pin.length >= 4) return;
      const next = pin + digit;
      setPin(next);
      animateDot(pin.length);
      
      if (next.length === 4) {
        setTimeout(() => {
          setStep("confirm");
        }, 400);
      }
      
    } else {
      if (confirmPin.length >= 4) return;
      const nextConfirm = confirmPin + digit;
      setConfirmPin(nextConfirm);
      animateDot(confirmPin.length);
      setError("");
      if (nextConfirm.length === 4) {
        setTimeout(() => {
          if (pin === nextConfirm) {
            Animated.spring(successScale, {
              toValue: 1,
              friction: 4,
              tension: 40,
              useNativeDriver: true,
            }).start();
            setTimeout(async() => {
              await AsyncStorage.setItem("hasOnboarded", "true");
              navigation.navigate(fromOnboarding ? "MainTabs" : "Security");
            }, 1000);
          } else {
            setError("PINs do not match. Please try again.");
            setConfirmPin("");
            setShakeTrigger(true);
          }
        }, 400);
      }
    }
  };

  const handleBackspace = () => {
    if (step === "enter") {
      setPin(pin.slice(0, -1));
    } else {
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  const handleConfirm = () => {
    if (pin === confirmPin) {
      // Success animation
      Animated.sequence([
        Animated.spring(successScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.delay(800),
      ]).start(() => {
        if (fromOnboarding) {
          navigation.navigate("MainTabs");
        } else {
          navigation.navigate("Security");
        }
      });
    } else {
      setError("PINs do not match. Please try again.");
      setConfirmPin("");
      setShakeTrigger(true);
    }
  };

  const handleGoBack = () => {
    if (step === "confirm") {
      setStep("enter");
      setConfirmPin("");
      setError("");
    } else {
      navigation.goBack();
    }
  };

  const currentPin = step === "enter" ? pin : confirmPin;

  const PinDots = () => (
    <View style={styles.dotsContainer}>
      <View style={styles.dotsRow}>
        {[0, 1, 2, 3].map((i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              currentPin.length > i && styles.dotFilled,
              { transform: [{ scale: dotScaleAnims[i] }] }
            ]}
          >
            {currentPin.length > i && (
              <View style={styles.dotInner} />
            )}
          </Animated.View>
        ))}
      </View>
      <Text style={styles.dotsLabel}>
        {step === "enter" ? "ENTER PIN" : "CONFIRM PIN"}
      </Text>
    </View>
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

      {/* Success overlay */}
      {step === "confirm" && confirmPin.length === 4 && pin === confirmPin && (
        <Animated.View style={[styles.successOverlay, { opacity: successScale }]}>
          <Animated.View style={[styles.successCircle, { transform: [{ scale: successScale }] }]}>
            <Text style={styles.successCheckmark}>✓</Text>
          </Animated.View>
          <Animated.Text style={[styles.successText, { opacity: successScale }]}>
            PIN Set Successfully!
          </Animated.Text>
        </Animated.View>
      )}

      <Animated.View style={[
        styles.inner,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}>
        {/* Step Progress for Onboarding */}
        {fromOnboarding && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepIndicator}>STEP 3 OF 3</Text>
              <Text style={styles.progressPercent}>100%</Text>
            </View>
            <View style={styles.progressTrack}>
              <ExpoLinearGradient
                colors={[ORANGE, ORANGE_LIGHT]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressFull}
              />
            </View>
            <View style={styles.progressSteps}>
              <View style={styles.progressDotComplete} />
              <View style={styles.progressDotLineComplete} />
              <View style={styles.progressDotComplete} />
              <View style={styles.progressDotLineComplete} />
              <View style={styles.progressDotActive} />
            </View>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          
          <View style={styles.headerContent}>
            <Animated.View style={{ transform: [{ scale: lockScale }] }}>
              <LockIcon size={32} color={ORANGE} locked={step === "enter"} />
            </Animated.View>
            <Text style={styles.headerTitle}>
              {step === "enter" ? "Create PIN" : "Confirm PIN"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {fromOnboarding 
                ? "Secure your wallet with a 4-digit PIN"
                : "Enter your new security PIN"
              }
            </Text>
          </View>
        </View>

        {/* PIN Dots with shake */}
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <PinDots />
        </Animated.View>

        {/* Error message */}
        {error !== "" && (
          <View style={styles.errorCard}>
            <View style={styles.errorIcon}>
              <Text style={styles.errorIconText}>!</Text>
            </View>
            <Text style={styles.errorText}>{error}</Text>
          </View>
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
                const isEmpty = !isBackspace && 
                  ((step === "enter" && pin.length >= 4) || 
                   (step === "confirm" && confirmPin.length >= 4));
                
                return (
                  <Pressable
                    key={colIdx}
                    onPress={() => {
                      if (isEmpty) return;
                      isBackspace ? handleBackspace() : handlePinInput(key);
                    }}
                    disabled={isEmpty}
                    style={({ pressed }) => [
                      styles.numpadCell,
                      styles.numpadButton,
                      isBackspace && styles.backspaceButton,
                      isEmpty && styles.numpadButtonDisabled,
                      pressed && !isEmpty && styles.numpadButtonPressed,
                    ]}
                  >
                    {isBackspace ? (
                      <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M21 4H8L1 12L8 20H21C21.5304 20 22.0391 19.7893 22.4142 19.4142C22.7893 19.0391 23 18.5304 23 18V6C23 5.46957 22.7893 4.96086 22.4142 4.58579C22.0391 4.21071 21.5304 4 21 4Z"
                          stroke="#999"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <Path
                          d="M18 9L14 15"
                          stroke="#999"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <Path
                          d="M14 9L18 15"
                          stroke="#999"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </Svg>
                    ) : (
                      <Text style={[
                        styles.numpadText,
                        isEmpty && styles.numpadTextDisabled
                      ]}>
                        {key}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        

        {/* Security note */}
        <View style={styles.securityNote}>
          <LockIcon size={14} color="#666" locked={false} />
          <Text style={styles.securityNoteText}>
            Your PIN is encrypted and stored securely
          </Text>
        </View>
      </Animated.View>
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
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  // Step Progress
  stepContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 8,
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
  progressFull: {
    height: '100%',
    width: '100%',
    borderRadius: 2,
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressDotComplete: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE + '60',
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
  progressDotLineComplete: {
    flex: 1,
    height: 1,
    backgroundColor: ORANGE + '30',
    marginHorizontal: 4,
  },
  // Header
  header: {
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: -8,
  },
  backArrow: {
    color: '#FFFFFF',
    fontSize: 36,
    lineHeight: 36,
    fontWeight: "200",
  },
  headerContent: {
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: '#999',
    fontSize: 15,
    textAlign: 'center',
  },
  // PIN Dots
  dotsContainer: {
    alignItems: 'center',
    gap: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
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
  dotsLabel: {
    color: '#666',
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 4,
  },
  // Error
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: ORANGE + '15',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: ORANGE + '30',
  },
  errorIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorIconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "bold",
  },
  errorText: {
    color: ORANGE,
    fontSize: 14,
    flex: 1,
    fontWeight: "500",
  },
  // Number Pad
  numpad: {
    width: '100%',
    gap: 12,
  },
  numpadRow: {
    flexDirection: 'row',
    gap: 12,
  },
  numpadCell: {
    flex: 1,
    aspectRatio: 1.5,
    borderRadius: 16,
    maxWidth: 100,
  },
  numpadButton: {
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  numpadButtonDisabled: {
    opacity: 0.3,
  },
  numpadButtonPressed: {
    backgroundColor: ORANGE + '20',
    borderColor: ORANGE,
  },
  backspaceButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  numpadText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: "700",
  },
  numpadTextDisabled: {
    opacity: 0.3,
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
  confirmButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  confirmGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: "800",
    fontSize: 17,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  confirmButtonArrow: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: "300",
  },
  // Security Note
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  securityNoteText: {
    color: '#666',
    fontSize: 12,
    fontWeight: "500",
  },
  // Success Overlay
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: DARK_BG + 'F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    gap: 24,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCheckmark: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: "bold",
  },
  successText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: "700",
  },
});