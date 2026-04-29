import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

const ORANGE = "#FF5722";

type RouteParams = {
  ChangePin: { fromOnboarding?: boolean };
};

export default function ChangePinScreen() {
  const [step, setStep] = useState<"enter" | "confirm">("enter");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");

  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, "ChangePin">>();
  const fromOnboarding = route.params?.fromOnboarding ?? false;

  const handlePinInput = (digit: string) => {
    if (step === "enter") {
      if (pin.length >= 4) return;
      const next = pin + digit;
      setPin(next);
      if (next.length === 4) {
        setTimeout(() => setStep("confirm"), 300);
      }
    } else {
      if (confirmPin.length >= 4) return;
      setConfirmPin(confirmPin + digit);
      setError("");
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
      if (fromOnboarding) {
        navigation.navigate("Dashboard");
      } else {
        navigation.navigate("Security");
      }
    } else {
      setError("PINs do not match");
      setConfirmPin("");
    }
  };

  const currentPin = step === "enter" ? pin : confirmPin;

  const PinDots = () => (
    <View style={styles.dotsRow}>
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={[
            styles.dot,
            currentPin.length > i && styles.dotFilled,
          ]}
        />
      ))}
    </View>
  );

  const numpadKeys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "⌫"],
  ];

  return (
    <View style={styles.screen}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          {!fromOnboarding && (
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [
                styles.backButton,
                pressed && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.backArrow}>‹</Text>
            </Pressable>
          )}
          <Text style={styles.headerTitle}>
            {step === "enter" ? "Set Your PIN" : "Confirm PIN"}
          </Text>
        </View>

        {fromOnboarding && (
          <View style={styles.progressTrack}>
            <View style={styles.progressFull} />
          </View>
        )}
      </View>

      {/* Body */}
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>

          {/* Instruction */}
          <Text style={styles.instruction}>
            {step === "enter"
              ? fromOnboarding
                ? "Create a 4-digit PIN to secure your wallet"
                : "Enter a new 4-digit PIN"
              : "Confirm your PIN"}
          </Text>

          {/* PIN Dots */}
          <PinDots />

          {/* Error */}
          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorIcon}>⚠</Text>
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
                      <Text
                        style={[
                          styles.numpadText,
                          isBackspace && styles.numpadBackspace,
                        ]}
                      >
                        {key}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Confirm Button */}
          {step === "confirm" && confirmPin.length === 4 && (
            <Pressable
              onPress={handleConfirm}
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text style={styles.confirmButtonText}>Confirm PIN</Text>
            </Pressable>
          )}

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  backArrow: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 32,
    fontWeight: "300",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  progressTrack: {
    width: "100%",
    height: 8,
    backgroundColor: "#1A1A1A",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFull: {
    width: "100%",
    height: "100%",
    backgroundColor: ORANGE,
    borderRadius: 99,
  },
  body: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  inner: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    gap: 32,
  },
  instruction: {
    color: "#B0B0B0",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#404040",
  },
  dotFilled: {
    backgroundColor: ORANGE,
    transform: [{ scale: 1.1 }],
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    width: "100%",
  },
  errorIcon: {
    color: "#B0B0B0",
    fontSize: 18,
  },
  errorText: {
    color: "#B0B0B0",
    fontSize: 14,
    flex: 1,
  },
  numpad: {
    width: "100%",
    gap: 12,
  },
  numpadRow: {
    flexDirection: "row",
    gap: 12,
  },
  numpadCell: {
    flex: 1,
    height: 64,
    borderRadius: 12,
  },
  numpadButton: {
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  numpadButtonPressed: {
    backgroundColor: "#2A2A2A",
  },
  numpadText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  numpadBackspace: {
    color: "#B0B0B0",
    fontSize: 20,
  },
  confirmButton: {
    width: "100%",
    backgroundColor: ORANGE,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});