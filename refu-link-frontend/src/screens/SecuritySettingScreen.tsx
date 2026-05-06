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
  Switch,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Line, Rect, Polyline } from "react-native-svg";
import * as LocalAuthentication from 'expo-local-authentication';
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

function IconChevronRight({ color = "#666", size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 18l6-6-6-6" />
    </Svg>
  );
}

function IconShield({ color = ORANGE, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );
}

function IconLock({ color = ORANGE, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );
}

function IconFingerprint({ color = ORANGE, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
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

function IconCheckCircle({ color = ORANGE, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Polyline points="16 10 11 15 8 12" />
    </Svg>
  );
}

function IconDeviceMobile({ color = ORANGE, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <Line x1="12" y1="18" x2="12.01" y2="18" />
    </Svg>
  );
}

function IconAlertTriangle({ color = "#FF9800", size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <Line x1="12" y1="9" x2="12" y2="13" />
      <Line x1="12" y1="17" x2="12.01" y2="17" />
    </Svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SecuritySettingsScreen() {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>("");
  const [isCheckingBiometrics, setIsCheckingBiometrics] = useState(true);
  const navigation = useNavigation<any>();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const listItemAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    checkBiometricAvailability();
    
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
      Animated.spring(listItemAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const checkBiometricAvailability = async () => {
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
    } finally {
      setIsCheckingBiometrics(false);
    }
  };

  const handleBiometricToggle = async () => {
    if (!biometricEnabled) {
      // Attempt to authenticate before enabling
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: `Authenticate to enable ${biometricType}`,
          fallbackLabel: 'Use PIN',
        });

        if (result.success) {
          setBiometricEnabled(true);
        } else {
          Alert.alert(
            "Authentication Failed",
            "Could not verify your identity. Please try again."
          );
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "An error occurred while setting up biometrics."
        );
      }
    } else {
      Alert.alert(
        "Disable Biometrics",
        "Are you sure you want to disable biometric authentication? You'll need to use your PIN instead.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Disable", 
            style: "destructive",
            onPress: () => setBiometricEnabled(false)
          },
        ]
      );
    }
  };

  const securityScore = 85; // Could be calculated based on enabled features

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
              <Text style={styles.headerTitle}>Security</Text>
              <Text style={styles.headerSubtitle}>
                Manage your account security
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
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            {/* Security Score Card */}
            <View style={styles.scoreCard}>
              <ExpoLinearGradient
                colors={[CARD_BG, '#1E2A4A']}
                style={styles.scoreGradient}
              >
                <View style={styles.scoreHeader}>
                  <IconShield size={28} />
                  <View style={styles.scoreInfo}>
                    <Text style={styles.scoreTitle}>Security Score</Text>
                    <Text style={styles.scoreValue}>{securityScore}%</Text>
                  </View>
                </View>
                
                {/* Score Bar */}
                <View style={styles.scoreBar}>
                  <View style={styles.scoreTrack}>
                    <Animated.View style={[
                      styles.scoreFill,
                      { width: `${securityScore}%` }
                    ]}>
                      <ExpoLinearGradient
                        colors={[ORANGE, ORANGE_LIGHT]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.scoreFillGradient}
                      />
                    </Animated.View>
                  </View>
                </View>

                <Text style={styles.scoreDescription}>
                  Your account is well protected. Enable all features for maximum security.
                </Text>
              </ExpoLinearGradient>
            </View>

            {/* Settings List */}
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>SECURITY OPTIONS</Text>
              
              <View style={styles.settingsList}>
                {/* Change PIN */}
                <Animated.View style={{
                  transform: [{ translateY: listItemAnim }]
                }}>
                  <Pressable
                    onPress={() => navigation.navigate("ChangePin", { fromOnboarding: false })}
                    style={({ pressed }) => [
                      styles.settingItem,
                      styles.settingItemFirst,
                      pressed && styles.settingItemPressed,
                    ]}
                  >
                    <View style={styles.settingLeft}>
                      <View style={[styles.settingIcon, styles.settingIconOrange]}>
                        <IconLock size={18} />
                      </View>
                      <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Change PIN</Text>
                        <Text style={styles.settingDescription}>
                          Update your 4-digit security PIN
                        </Text>
                      </View>
                    </View>
                    <View style={styles.settingRight}>
                      <Text style={styles.lastChanged}>2 months ago</Text>
                      <IconChevronRight size={18} />
                    </View>
                  </Pressable>
                </Animated.View>

                {/* Biometric Lock */}
                <Animated.View style={{
                  transform: [{ translateY: listItemAnim }]
                }}>
                  <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                      <View style={[styles.settingIcon, styles.settingIconOrange]}>
                        <IconFingerprint size={18} />
                      </View>
                      <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>
                          {biometricType || "Biometric Lock"}
                        </Text>
                        <Text style={styles.settingDescription}>
                          {biometricAvailable 
                            ? `Unlock with ${biometricType || "biometrics"}`
                            : "Biometrics not available on this device"
                          }
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={biometricEnabled}
                      onValueChange={handleBiometricToggle}
                      disabled={!biometricAvailable || isCheckingBiometrics}
                      trackColor={{ 
                        false: '#2A2A3E', 
                        true: ORANGE + '40' 
                      }}
                      thumbColor={biometricEnabled ? ORANGE : '#666'}
                      ios_backgroundColor="#2A2A3E"
                    />
                  </View>
                </Animated.View>

                {/* Device Management */}
                <Animated.View style={{
                  transform: [{ translateY: listItemAnim }]
                }}>
                  <Pressable
                    onPress={() => navigation.navigate("DeviceManagement")}
                    style={({ pressed }) => [
                      styles.settingItem,
                      pressed && styles.settingItemPressed,
                    ]}
                  >
                    <View style={styles.settingLeft}>
                      <View style={[styles.settingIcon, styles.settingIconBlue]}>
                        <IconDeviceMobile size={18} />
                      </View>
                      <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Device Management</Text>
                        <Text style={styles.settingDescription}>
                          Manage trusted devices
                        </Text>
                      </View>
                    </View>
                    <View style={styles.settingRight}>
                      <View style={styles.deviceCount}>
                        <Text style={styles.deviceCountText}>1</Text>
                      </View>
                      <IconChevronRight size={18} />
                    </View>
                  </Pressable>
                </Animated.View>

                {/* Recovery Options */}
                <Animated.View style={{
                  transform: [{ translateY: listItemAnim }]
                }}>
                  <Pressable
                    onPress={() => navigation.navigate("RecoveryOptions")}
                    style={({ pressed }) => [
                      styles.settingItem,
                      styles.settingItemLast,
                      pressed && styles.settingItemPressed,
                    ]}
                  >
                    <View style={styles.settingLeft}>
                      <View style={[styles.settingIcon, styles.settingIconGreen]}>
                        <IconAlertTriangle size={18} />
                      </View>
                      <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Recovery Options</Text>
                        <Text style={styles.settingDescription}>
                          Set up account recovery methods
                        </Text>
                      </View>
                    </View>
                    <IconChevronRight size={18} />
                  </Pressable>
                </Animated.View>
              </View>
            </View>

            {/* Device Status */}
            <Animated.View style={{
              transform: [{ translateY: listItemAnim }]
            }}>
              <View style={styles.statusCard}>
                <ExpoLinearGradient
                  colors={[GREEN + '10', GREEN + '05']}
                  style={styles.statusGradient}
                >
                  <View style={styles.statusContent}>
                    <View style={styles.statusIcon}>
                      <IconCheckCircle size={24} />
                    </View>
                    <View style={styles.statusInfo}>
                      <Text style={styles.statusTitle}>This device is secured</Text>
                      <Text style={styles.statusDescription}>
                        Your wallet is protected on this device with encryption and secure storage.
                      </Text>
                    </View>
                  </View>
                  
                  {/* Security Details */}
                  <View style={styles.securityDetails}>
                    <View style={styles.detailItem}>
                      <View style={styles.detailDot} />
                      <Text style={styles.detailText}>End-to-end encrypted</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <View style={styles.detailDot} />
                      <Text style={styles.detailText}>Secure enclave storage</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <View style={styles.detailDot} />
                      <Text style={styles.detailText}>Anti-tamper protection</Text>
                    </View>
                  </View>
                </ExpoLinearGradient>
              </View>
            </Animated.View>

            {/* Security Tips */}
            <Animated.View style={{
              transform: [{ translateY: listItemAnim }]
            }}>
              <View style={styles.tipsCard}>
                <Text style={styles.tipsTitle}>Security Tips</Text>
                <View style={styles.tipItem}>
                  <View style={styles.tipNumber}>
                    <Text style={styles.tipNumberText}>1</Text>
                  </View>
                  <Text style={styles.tipText}>
                    Never share your PIN or recovery phrase with anyone
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <View style={styles.tipNumber}>
                    <Text style={styles.tipNumberText}>2</Text>
                  </View>
                  <Text style={styles.tipText}>
                    Enable biometric lock for faster and secure access
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <View style={styles.tipNumber}>
                    <Text style={styles.tipNumberText}>3</Text>
                  </View>
                  <Text style={styles.tipText}>
                    Regularly update your PIN to maintain security
                  </Text>
                </View>
              </View>
            </Animated.View>
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
    gap: 24,
  },
  // Score Card
  scoreCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  scoreGradient: {
    padding: 20,
    gap: 16,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },
  scoreValue: {
    color: ORANGE,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
  },
  scoreBar: {
    gap: 8,
  },
  scoreTrack: {
    height: 6,
    backgroundColor: '#2A2A3E',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 3,
  },
  scoreFillGradient: {
    flex: 1,
  },
  scoreDescription: {
    color: '#666',
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 18,
  },
  // Settings Section
  settingsSection: {
    gap: 12,
  },
  sectionTitle: {
    color: '#666',
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
    paddingHorizontal: 4,
  },
  settingsList: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
  },
  settingItemFirst: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  settingItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  settingItemPressed: {
    backgroundColor: '#2A2A3E',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIconOrange: {
    backgroundColor: ORANGE + '15',
  },
  settingIconBlue: {
    backgroundColor: '#2196F3' + '15',
  },
  settingIconGreen: {
    backgroundColor: '#FF9800' + '15',
  },
  settingInfo: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  settingDescription: {
    color: '#666',
    fontSize: 12,
    fontWeight: "500",
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lastChanged: {
    color: '#555',
    fontSize: 11,
    fontWeight: "500",
  },
  deviceCount: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: ORANGE + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceCountText: {
    color: ORANGE,
    fontSize: 11,
    fontWeight: "800",
  },
  // Status Card
  statusCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: GREEN + '20',
  },
  statusGradient: {
    padding: 20,
    gap: 16,
  },
  statusContent: {
    flexDirection: 'row',
    gap: 14,
  },
  statusIcon: {
    marginTop: 2,
  },
  statusInfo: {
    flex: 1,
    gap: 4,
  },
  statusTitle: {
    color: GREEN,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  statusDescription: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  securityDetails: {
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2A2A3E',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GREEN,
  },
  detailText: {
    color: '#999',
    fontSize: 12,
    fontWeight: "500",
  },
  // Tips Card
  tipsCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    gap: 14,
  },
  tipsTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: ORANGE + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  tipNumberText: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: "800",
  },
  tipText: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
    lineHeight: 18,
  },
});