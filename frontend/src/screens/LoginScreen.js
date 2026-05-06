import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PropTypes from "prop-types";
import * as LocalAuthentication from "expo-local-authentication";
import { useLanguage } from "../context/LanguageContext";
import { verifyRIN, registerIdentity, isLoggedIn } from "../services/authService";

export default function LoginScreen({ navigation }) {
  const { t } = useLanguage();
  const [rin, setRin] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleVerify = async (identifier) => {
    if (!identifier.trim()) { Alert.alert("", t("enterRIN")); return; }
    setLoading(true);
    try {
      const result = await verifyRIN(identifier.trim());
      if (!result.verified) { Alert.alert("", t("verifiedFail")); return; }
      
      const fullName = result.user_info?.full_name || "User";

      try {
        const identity = await registerIdentity();
        if (identity.stellar_private_key) {
          const msg = `${t("privateKeyWarning")}\n\n${identity.stellar_private_key}`;
          if (Platform.OS === "web") {
            window.alert(`Welcome, ${fullName}\n\n${msg}`);
            navigation.replace("Main");
          } else {
            Alert.alert(
              "Welcome, " + fullName,
              msg,
              [{ text: "OK", onPress: () => navigation.replace("Main") }]
            );
          }
          return;
        }
      } catch { 
        // Already registered
      }
      
      if (Platform.OS === "web") {
        window.alert(`Welcome! Successfully verified as ${fullName}.`);
        navigation.replace("Main");
      } else {
        Alert.alert("Welcome", `Successfully verified as ${fullName}.`, [
          { text: "OK", onPress: () => navigation.replace("Main") }
        ]);
      }
    } catch {
      Alert.alert("", t("networkError"));
    } finally {
      setLoading(false);
    }
  };

  const handleBiometric = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHardware || !isEnrolled) { Alert.alert("", t("biometricFail")); return; }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: t("biometricPrompt"),
      fallbackLabel: t("enterRIN"),
    });
    if (result.success) {
      const loggedIn = await isLoggedIn();
      if (loggedIn) { navigation.replace("Main"); }
      else { Alert.alert("", t("biometricFail")); }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24 }}>
          <Text style={{ color: "#FF6600", fontSize: 28, fontWeight: "900", marginBottom: 6 }}>
            {t("login")}
          </Text>
          <Text style={{ color: "#52525B", fontSize: 14, marginBottom: 32 }}>
            {t("enterRIN")}
          </Text>

          <TextInput
            style={{
              backgroundColor: "#111",
              borderWidth: 1,
              borderColor: focused ? "#FF6600" : "#222",
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 16,
              color: "#FFF",
              fontSize: 16,
              letterSpacing: 2,
              marginBottom: 12,
            }}
            placeholder={t("rinPlaceholder")}
            placeholderTextColor="#52525B"
            value={rin}
            onChangeText={setRin}
            autoCapitalize="characters"
            returnKeyType="done"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onSubmitEditing={() => handleVerify(rin)}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#FF6600",
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: "center",
              marginBottom: 12,
              opacity: loading ? 0.7 : 1,
            }}
            activeOpacity={0.85}
            onPress={() => handleVerify(rin)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={{ color: "#000", fontWeight: "700", fontSize: 15 }}>{t("verify")}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#222",
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: "center",
            }}
            activeOpacity={0.85}
            onPress={handleBiometric}
          >
            <Text style={{ color: "#A1A1AA", fontWeight: "600", fontSize: 15 }}>
              {t("useBiometric")}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.shape({ replace: PropTypes.func.isRequired }).isRequired,
};