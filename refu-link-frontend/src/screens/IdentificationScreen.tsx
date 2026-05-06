import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle } from "react-native-svg";
import React from "react";

const { width } = Dimensions.get('window');
const ORANGE = "#FF5722";
const ORANGE_LIGHT = "#FF8A65";
const ORANGE_DARK = "#E64A19";
const DARK_BG = "#1A1A2E";
const CARD_BG = "#16213E";

export default function IdentificationScreen() {
  const [rin, setRin] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation<any>();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  
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
      // Progress bar animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      // Icon pop in
      Animated.spring(iconScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    if (rin.trim()) {
      // Success animation
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigation.navigate("Biometric");
      });
    } else {
      // Shake animation for invalid input
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  };

  const formatRIN = (text: string) => {
    // Auto-format RIN (example format)
    return text.toUpperCase();
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '5%'],
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

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[
            styles.inner,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            {/* Header with Icon */}
            <View style={styles.headerBlock}>
              <Animated.View style={[
                styles.iconContainer,
                { transform: [{ scale: iconScale }] }
              ]}>
                <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
                    fill={ORANGE}
                  />
                </Svg>
              </Animated.View>
              
              <View style={styles.headerText}>
                <Text style={styles.stepIndicator}>STEP 1 OF 3</Text>
                <Text style={styles.title}>Verify Identity</Text>
                <Text style={styles.subtitle}>Enter your RIN to continue</Text>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabel}>Identity</Text>
                  <Text style={styles.progressPercent}>5%</Text>
                </View>
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
                  <View style={[styles.progressDot, styles.progressDotActive]} />
                  <View style={styles.progressDotLine} />
                  <View style={styles.progressDot} />
                  <View style={styles.progressDotLine} />
                  <View style={styles.progressDot} />
                </View>
              </View>
            </View>

            {/* RIN Input Card */}
            <Animated.View style={[
              styles.inputCard,
              { transform: [{ translateX: shakeAnim }] }
            ]}>
              <View style={styles.inputHeader}>
                <Text style={styles.inputLabel}>RIN NUMBER</Text>
                <View style={[
                  styles.inputStatus,
                  rin.trim() ? styles.inputStatusValid : styles.inputStatusEmpty
                ]}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>
                    {rin.trim() ? 'Valid format' : 'Required'}
                  </Text>
                </View>
              </View>
              
              <View style={[
                styles.inputWrapper,
                isFocused && styles.inputWrapperFocused,
                rin.trim() && styles.inputWrapperFilled
              ]}>
                <Svg width={20} height={20} viewBox="0 0 24 24" style={styles.inputIcon}>
                  <Path
                    d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H20V18ZM4 0H20V2H4V0ZM4 22H20V24H4V22ZM12 12C13.38 12 14.5 10.88 14.5 9.5C14.5 8.12 13.38 7 12 7C10.62 7 9.5 8.12 9.5 9.5C9.5 10.88 10.62 12 12 12ZM17 17H7V16.5C7 14.83 10.33 14 12 14C13.67 14 17 14.83 17 16.5V17Z"
                    fill={isFocused ? ORANGE : '#666'}
                  />
                </Svg>
                
                <TextInput
                  value={rin}
                  onChangeText={(text) => setRin(formatRIN(text))}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter your RIN"
                  placeholderTextColor="#666"
                  autoCapitalize="characters"
                  maxLength={15}
                  style={styles.input}
                />
                
                {rin.trim() && (
                  <Animated.View style={styles.clearButton}>
                    <Pressable onPress={() => setRin("")}>
                      <Svg width={20} height={20} viewBox="0 0 24 24">
                        <Circle cx="12" cy="12" r="10" fill="#FF5722" opacity="0.2" />
                        <Path d="M15 9L9 15M9 9L15 15" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" />
                      </Svg>
                    </Pressable>
                  </Animated.View>
                )}
              </View>
              
              <Text style={styles.hint}>
                Your RIN is verified securely against the government register. 
                Your data is encrypted and protected.
              </Text>
              
              {/* Security badges */}
              <View style={styles.securityBadges}>
                <View style={styles.badge}>
                  <Svg width={16} height={16} viewBox="0 0 24 24">
                    <Path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill={ORANGE}
                      opacity={0.5}
                    />
                  </Svg>
                  <Text style={styles.badgeText}>Encrypted</Text>
                </View>
                <View style={styles.badge}>
                  <Svg width={16} height={16} viewBox="0 0 24 24">
                    <Path
                      d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z"
                      fill={ORANGE}
                      opacity={0.5}
                    />
                  </Svg>
                  <Text style={styles.badgeText}>Verified</Text>
                </View>
              </View>
            </Animated.View>

            {/* Action Button */}
            <View style={styles.buttonContainer}>
              <Pressable
                onPress={handleContinue}
                style={({ pressed }) => [
                  styles.buttonWrapper,
                  pressed && styles.buttonPressed,
                ]}
              >
                <ExpoLinearGradient
                  colors={rin.trim() ? [ORANGE, ORANGE_DARK] : ['#333', '#222']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.button}
                >
                  <Text style={[
                    styles.buttonText,
                    !rin.trim() && styles.buttonTextDisabled
                  ]}>
                    Continue
                  </Text>
                  <Text style={styles.buttonArrow}>→</Text>
                </ExpoLinearGradient>
              </Pressable>
              
              <Pressable 
                style={styles.helpButton}
                onPress={() => {/* Show help modal */}}
              >
                <Text style={styles.helpText}>
                  Don't know your RIN? <Text style={styles.helpLink}>Get Help</Text>
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  // Header Styles
  headerBlock: {
    gap: 24,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: ORANGE + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ORANGE + '30',
  },
  headerText: {
    gap: 4,
  },
  stepIndicator: {
    color: ORANGE_LIGHT,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 4,
    opacity: 0.8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 1,
  },
  subtitle: {
    color: '#999',
    fontSize: 15,
    marginTop: 4,
  },
  // Progress Styles
  progressContainer: {
    gap: 12,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    color: '#999',
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: 'uppercase',
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
    paddingHorizontal: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2A2A3E',
  },
  progressDotActive: {
    backgroundColor: ORANGE,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  progressDotLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2A2A3E',
    marginHorizontal: 4,
  },
  // Input Card Styles
  inputCard: {
    backgroundColor: CARD_BG,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    gap: 16,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    color: ORANGE_LIGHT,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 3,
  },
  inputStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inputStatusEmpty: {
    opacity: 0.5,
  },
  inputStatusValid: {
    opacity: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ORANGE,
  },
  statusText: {
    color: '#999',
    fontSize: 12,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DARK_BG,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#2A2A3E',
    gap: 12,
  },
  inputWrapperFocused: {
    borderColor: ORANGE,
  },
  inputWrapperFilled: {
    borderColor: ORANGE + '50',
  },
  inputIcon: {
    opacity: 0.7,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
    paddingVertical: 16,
  },
  clearButton: {
    padding: 4,
  },
  hint: {
    color: '#666',
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  securityBadges: {
    flexDirection: 'row',
    gap: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: DARK_BG,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: '#999',
    fontSize: 11,
    fontWeight: "600",
  },
  // Button Styles
  buttonContainer: {
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
  button: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: "800",
    fontSize: 17,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  buttonTextDisabled: {
    opacity: 0.5,
  },
  buttonArrow: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: "300",
  },
  helpButton: {
    alignItems: 'center',
  },
  helpText: {
    color: '#666',
    fontSize: 13,
    fontWeight: "500",
  },
  helpLink: {
    color: ORANGE,
    fontWeight: "700",
  },
});
