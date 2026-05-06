import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Line, Rect, Polyline } from "react-native-svg";
import { CameraView, useCameraPermissions } from "expo-camera";
import React from "react";

const { width, height } = Dimensions.get('window');
const ORANGE = "#FF5722";
const ORANGE_DARK = "#E64A19";
const DARK_BG = "#1A1A2E";
const CARD_BG = "#16213E";
const GREEN = "#4CAF50";

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function IconX({ color = "#FFFFFF", size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="18" y1="6" x2="6" y2="18" />
      <Line x1="6" y1="6" x2="18" y2="18" />
    </Svg>
  );
}

function IconScanLine({ color = ORANGE, size = 48 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <Path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <Path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <Path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <Line x1="7" y1="12" x2="17" y2="12" />
    </Svg>
  );
}

function IconCheckCircle({ color = ORANGE, size = 120, strokeWidth = 1.5 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Polyline points="22 4 12 14.01 9 11.01" />
    </Svg>
  );
}

function IconCheckCircleSmall({ color = ORANGE, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Polyline points="22 4 12 14.01 9 11.01" />
    </Svg>
  );
}

function IconFlashlight({ color = "#666", size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <Path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
      <Path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <Path d="M18 8a2 2 0 0 1 2 2v4a8 8 0 0 1-8 8h-1a7.96 7.96 0 0 1-5.66-2.34" />
      <Line x1="12" y1="22" x2="12" y2="14" />
    </Svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ScanToPayScreen() {
  const [scanned, setScanned] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigation = useNavigation<any>();

  // New State
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();


  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scanLineAnim = useRef(new Animated.Value(-100)).current;
  const confirmationScale = useRef(new Animated.Value(0.8)).current;
  const confirmationOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    // Entrance animation
    Animated.spring(fadeAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 100,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: -100,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (showConfirmation) {
      Animated.parallel([
        Animated.spring(confirmationScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(confirmationOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      confirmationScale.setValue(0.8);
      confirmationOpacity.setValue(0);
    }
  }, [showConfirmation]);

  useEffect(() => {
    if (showSuccess) {
      Animated.parallel([
        Animated.spring(successScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(successOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Ripple effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(rippleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(rippleAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [showSuccess]);

  const handleConfirm = () => {
    setShowConfirmation(false);
    setShowSuccess(true);
    setTimeout(() => {
      navigation.navigate("MainTabs", { screen: "Home" });
    }, 2000);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 2],
  });

  const rippleOpacity = rippleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.4, 0.2, 0],
  });

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <ExpoLinearGradient colors={[DARK_BG, '#16213E']} style={styles.background} />
        <SafeAreaView style={[styles.safeArea, { alignItems: 'center', justifyContent: 'center', gap: 20 }]}>
          <Text style={{ color: '#FFF', fontSize: 16, textAlign: 'center', paddingHorizontal: 32 }}>
            Camera access is required to scan QR codes
          </Text>
          <Pressable onPress={requestPermission} style={{ backgroundColor: ORANGE, padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#FFF', fontWeight: '700' }}>Grant Permission</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Background */}
      <View style={styles.background} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View style={[
          styles.header,
          { opacity: fadeAnim }
        ]}>
          <Text style={styles.headerTitle}>Scan to Pay</Text>
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.closeButtonPressed,
            ]}
          >
            <IconX size={24} />
          </Pressable>
        </Animated.View>

        {/* Camera Viewfinder */}
        <View style={styles.viewfinder}>
          {/* Live Camera Feed */}
          {permission?.granted && !scanned && (
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={() => {
                if (!scanned) {
                  setScanned(true);
                  setTimeout(() => setShowConfirmation(true), 500);
                }
              }}
              enableTorch={flashlightOn}
            />
          )}

          {/* Dark overlay */}
          <View style={styles.overlay}>
            {/* Top section */}
            <View style={styles.overlayTop}>
              {!scanned && (
                <View style={styles.helperTextContainer}>
                  <Text style={styles.helperText}>
                    Align QR code within frame
                  </Text>
                </View>
              )}
            </View>

            {/* Middle section with frame */}
            <View style={styles.overlayMiddle}>
              <View style={styles.overlaySide} />

              {/* Scanning Frame */}
              <View style={styles.scanFrame}>
                <View style={styles.frameContent}>
                  {/* Corner accents */}
                  <View style={[styles.corner, styles.cornerTL]} />
                  <View style={[styles.corner, styles.cornerTR]} />
                  <View style={[styles.corner, styles.cornerBL]} />
                  <View style={[styles.corner, styles.cornerBR]} />

                  {/* Scan line animation */}
                  {!scanned && (
                    <Animated.View style={[
                      styles.scanLine,
                      { transform: [{ translateY: scanLineAnim }] }
                    ]} />
                  )}

                  {/* Center icon */}
                  {!scanned && (
                    <View style={styles.centerIcon}>
                      <IconScanLine size={48} />
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.overlaySide} />
            </View>

            {/* Bottom section */}
            <View style={styles.overlayBottom} />
          </View>

          {/* Flashlight toggle */}
          {!scanned && (
            <View style={styles.flashlightContainer}>
              <Pressable 
                style={styles.flashlightButton}
                onPress={() => setFlashlightOn(prev => !prev)}
              >
                <IconFlashlight size={20} color={flashlightOn ? ORANGE : "#666"} />
              </Pressable>
            </View>
          )}

          {/* Detected Merchant Info */}
          {scanned && !showConfirmation && (
            <Animated.View style={[
              styles.merchantCard,
              { opacity: fadeAnim }
            ]}>
              <View style={styles.merchantContent}>
                <ExpoLinearGradient
                  colors={[CARD_BG, '#1E2A4A']}
                  style={styles.merchantGradient}
                >
                  <Text style={styles.merchantTitle}>Mama Amina Kiosk</Text>
                  <View style={styles.merchantVerified}>
                    <IconCheckCircleSmall color={GREEN} size={14} />
                    <Text style={styles.merchantVerifiedText}>Verified Merchant</Text>
                  </View>
                  <View style={styles.merchantAmount}>
                    <Text style={styles.amountLabel}>Amount</Text>
                    <Text style={styles.amountValue}>KES 250.00</Text>
                  </View>
                </ExpoLinearGradient>
              </View>
            </Animated.View>
          )}
        </View>

        {/* Confirmation Modal */}
        <Modal
          visible={showConfirmation}
          transparent={true}
          animationType="none"
          onRequestClose={() => setShowConfirmation(false)}
        >
          <Animated.View style={[
            styles.modalOverlay,
            { opacity: confirmationOpacity }
          ]}>
            <Animated.View style={[
              styles.modalContent,
              { transform: [{ scale: confirmationScale }] }
            ]}>
              <ExpoLinearGradient
                colors={[CARD_BG, '#1E2A4A']}
                style={styles.modalGradient}
              >
                <Text style={styles.modalTitle}>Confirm Payment</Text>

                <View style={styles.modalDetails}>
                  <Text style={styles.modalLabel}>AMOUNT</Text>
                  <Text style={styles.modalAmount}>KES 250.00</Text>
                  
                  <View style={styles.modalDivider} />
                  
                  <View style={styles.modalToRow}>
                    <Text style={styles.modalToLabel}>To:</Text>
                    <Text style={styles.modalToName}>Mama Amina Kiosk</Text>
                  </View>
                  
                  <View style={styles.modalVerified}>
                    <IconCheckCircleSmall color={GREEN} size={14} />
                    <Text style={styles.modalVerifiedText}>Verified Merchant</Text>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <Pressable
                    onPress={() => setShowConfirmation(false)}
                    style={({ pressed }) => [
                      styles.modalButton,
                      styles.modalCancelButton,
                      pressed && styles.modalCancelButtonPressed,
                    ]}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleConfirm}
                    style={({ pressed }) => [
                      styles.modalButton,
                      styles.modalConfirmButton,
                      pressed && styles.modalConfirmButtonPressed,
                    ]}
                  >
                    <ExpoLinearGradient
                      colors={[ORANGE, ORANGE_DARK]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.modalConfirmGradient}
                    >
                      <Text style={styles.modalConfirmText}>Confirm</Text>
                    </ExpoLinearGradient>
                  </Pressable>
                </View>
              </ExpoLinearGradient>
            </Animated.View>
          </Animated.View>
        </Modal>

        {/* Success Animation */}
        <Modal
          visible={showSuccess}
          transparent={true}
          animationType="none"
        >
          <Animated.View style={[
            styles.successOverlay,
            { opacity: successOpacity }
          ]}>
            <Animated.View style={[
              styles.successContent,
              { transform: [{ scale: successScale }] }
            ]}>
              <View style={styles.successIconContainer}>
                <IconCheckCircle color={ORANGE} size={100} strokeWidth={1.5} />
                
                {/* Ripple effect */}
                <Animated.View style={[
                  styles.ripple,
                  {
                    transform: [{ scale: rippleScale }],
                    opacity: rippleOpacity,
                  }
                ]} />
              </View>
              
              <Text style={styles.successTitle}>Payment Complete!</Text>
              <Text style={styles.successSubtitle}>
                Transaction successful
              </Text>
            </Animated.View>
          </Animated.View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    backgroundColor: '#000000',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonPressed: {
    backgroundColor: '#2A2A2A',
  },
  // Viewfinder
  viewfinder: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    flex: 1,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
  },
  helperTextContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  helperText: {
    color: '#999',
    fontSize: 13,
    fontWeight: "600",
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: 250,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scanFrame: {
    width: 200,
    height: 250,
  },
  frameContent: {
    flex: 1,
    borderWidth: 2,
    borderColor: ORANGE + '60',
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  // Corner accents
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
  },
  cornerTL: {
    top: -1,
    left: -1,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: ORANGE,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    top: -1,
    right: -1,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: ORANGE,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    bottom: -1,
    left: -1,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: ORANGE,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    bottom: -1,
    right: -1,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: ORANGE,
    borderBottomRightRadius: 12,
  },
  // Scan line
  scanLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: ORANGE,
    top: '50%',
    marginTop: -1,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  centerIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -24,
    marginTop: -24,
    opacity: 0.4,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  // Flashlight
  flashlightContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
  flashlightButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  // Merchant Card
  merchantCard: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ORANGE + '40',
  },
  merchantContent: {
    borderRadius: 20,
  },
  merchantGradient: {
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  merchantTitle: {
    color: ORANGE,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  merchantVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: GREEN + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  merchantVerifiedText: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "600",
  },
  merchantAmount: {
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  amountLabel: {
    color: '#666',
    fontSize: 11,
    fontWeight: "600",
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  amountValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: "800",
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ORANGE + '30',
  },
  modalGradient: {
    padding: 28,
    gap: 24,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: "800",
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  modalDetails: {
    alignItems: 'center',
    gap: 12,
  },
  modalLabel: {
    color: '#666',
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
  },
  modalAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: 1,
  },
  modalDivider: {
    width: '60%',
    height: 1,
    backgroundColor: '#2A2A3E',
    marginVertical: 8,
  },
  modalToRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalToLabel: {
    color: '#999',
    fontSize: 14,
    fontWeight: "600",
  },
  modalToName: {
    color: ORANGE,
    fontSize: 16,
    fontWeight: "700",
  },
  modalVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: GREEN + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  modalVerifiedText: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalCancelButton: {
    backgroundColor: '#2A2A3E',
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A4E',
  },
  modalCancelButtonPressed: {
    backgroundColor: '#3A3A4E',
  },
  modalCancelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  modalConfirmButton: {
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalConfirmButtonPressed: {
    opacity: 0.9,
  },
  modalConfirmGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  // Success
  successOverlay: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successContent: {
    alignItems: 'center',
    gap: 20,
  },
  successIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: ORANGE,
  },
  successTitle: {
    color: ORANGE,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  successSubtitle: {
    color: '#999',
    fontSize: 14,
    fontWeight: "600",
  },
});