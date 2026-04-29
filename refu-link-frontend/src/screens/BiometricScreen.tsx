import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";

const ORANGE = "#FF5722";

// Fingerprint SVG path (matches Lucide's Fingerprint icon)
function FingerprintIcon({ size = 120, color = ORANGE }) {
  const scale = size / 24;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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

export default function BiometricScreen() {
  const [scanning, setScanning] = useState(false);
  const navigation = useNavigation<any>();

  // Pulse animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // Spinner rotation
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (scanning) {
      // Pulse the fingerprint icon
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 750,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Spin the ring
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      pulseAnim.setValue(1);
      spinAnim.setValue(0);
    }
  }, [scanning]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      navigation.navigate("ChangePin", { fromOnboarding: true });
    }, 2000);
  };

  const handleSkip = () => {
    navigation.navigate("ChangePin", { fromOnboarding: true });
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.inner}>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: "75%" }]} />
        </View>

        {/* Header */}
        <Text style={styles.title}>Secure Your Wallet</Text>

        {/* Instructions */}
        <View style={styles.instructionBlock}>
          <Text style={styles.instructionPrimary}>
            Scan your face or fingerprint to lock your identity to your device.
          </Text>
          <Text style={styles.instructionSecondary}>
            You'll create a 4-digit PIN next for quick access.
          </Text>
        </View>

        {/* Biometric Icon */}
        <View style={styles.iconWrapper}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <FingerprintIcon size={120} color={ORANGE} />
          </Animated.View>

          {scanning && (
            <Animated.View
              style={[styles.spinner, { transform: [{ rotate: spin }] }]}
            />
          )}
        </View>

        {/* Buttons */}
        <View style={styles.buttonBlock}>
          <Pressable
            onPress={handleScan}
            disabled={scanning}
            style={({ pressed }) => [
              styles.primaryButton,
              scanning && styles.buttonDisabled,
              pressed && !scanning && styles.buttonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {scanning ? "Scanning..." : "Scan Now"}
            </Text>
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
            <Text style={styles.secondaryButtonText}>Skip for Now</Text>
          </Pressable>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingVertical: 48,
    alignItems: "center",
  },
  inner: {
    width: "100%",
    maxWidth: 400,
    gap: 32,
  },
  progressTrack: {
    width: "100%",
    height: 8,
    backgroundColor: "#1A1A1A",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: ORANGE,
    borderRadius: 99,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  instructionBlock: {
    gap: 8,
  },
  instructionPrimary: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
  },
  instructionSecondary: {
    color: "#B0B0B0",
    fontSize: 14,
    lineHeight: 20,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  spinner: {
    position: "absolute",
    width: 148,
    height: 148,
    borderRadius: 74,
    borderWidth: 4,
    borderColor: ORANGE,
    borderTopColor: "transparent",
  },
  buttonBlock: {
    gap: 16,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: ORANGE,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  secondaryButtonText: {
    color: ORANGE,
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});