import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const ORANGE = "#FF5722";

export default function IdentificationScreen() {
  const [rin, setRin] = useState("");
  const navigation = useNavigation<any>();

  const handleContinue = () => {
    if (rin.trim()) {
      navigation.navigate("Biometric");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>

          {/* Header */}
          <View style={styles.headerBlock}>
            <Text style={styles.title}>Verify Your Identity</Text>

            {/* Progress Bar */}
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
          </View>

          {/* Input Section */}
          <View style={styles.inputBlock}>
            <TextInput
              value={rin}
              onChangeText={setRin}
              placeholder="ENTER YOUR RIN NUMBER"
              placeholderTextColor="#B0B0B0"
              autoCapitalize="characters"
              style={styles.input}
            />
            <Text style={styles.hint}>
              Your RIN is verified securely against the government register.
            </Text>
          </View>

          {/* Continue Button */}
          <Pressable
            onPress={handleContinue}
            disabled={!rin.trim()}
            style={({ pressed }) => [
              styles.button,
              !rin.trim() && styles.buttonDisabled,
              pressed && rin.trim() && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
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
    gap: 48,
  },
  headerBlock: {
    gap: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
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
  progressFill: {
    width: "33.33%",
    height: "100%",
    backgroundColor: ORANGE,
    borderRadius: 99,
  },
  inputBlock: {
    gap: 12,
  },
  input: {
    width: "100%",
    backgroundColor: "#000000",
    color: "#FFFFFF",
    borderWidth: 2,
    borderColor: ORANGE,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 15,
    fontWeight: "500",
  },
  hint: {
    color: "#B0B0B0",
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    width: "100%",
    backgroundColor: ORANGE,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});