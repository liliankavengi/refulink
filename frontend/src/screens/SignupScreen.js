import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PropTypes from "prop-types";
import { useLanguage } from "../context/LanguageContext";
import { verifyRIN, registerIdentity } from "../services/authService";

export default function SignupScreen({ navigation }) {
  const { t } = useLanguage();
  const [rin, setRin] = useState("");
  const [step, setStep] = useState("rin"); // "rin" | "key"
  const [loading, setLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleVerifyAndRegister = async () => {
    if (!rin.trim()) { Alert.alert("", t("enterRIN")); return; }
    setLoading(true);
    try {
      const verifyResult = await verifyRIN(rin.trim());
      if (!verifyResult.verified) { Alert.alert("", t("verifiedFail")); return; }
      const identity = await registerIdentity();
      if (identity.stellar_private_key) {
        setPrivateKey(identity.stellar_private_key);
        setStep("key");
      } else {
        navigation.replace("Main");
      }
    } catch (err) {
      Alert.alert("", err?.response?.data?.detail ?? t("networkError"));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyKey = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === "key") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 }}
        >
          <Text style={{ color: "#FF6600", fontSize: 24, fontWeight: "900", marginBottom: 8 }}>
            {t("saveKey")}
          </Text>
          <Text style={{ color: "#A1A1AA", fontSize: 14, marginBottom: 24, lineHeight: 22 }}>
            {t("privateKeyWarning")}
          </Text>

          <View style={{
            backgroundColor: "#111",
            borderWidth: 1,
            borderColor: "#FF6600",
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
          }}>
            <Text
              style={{ color: "#FF6600", fontSize: 12, fontFamily: "monospace", lineHeight: 22 }}
              selectable
            >
              {privateKey}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#222",
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: "center",
              marginBottom: 24,
            }}
            onPress={handleCopyKey}
          >
            <Text style={{ color: copied ? "#FF6600" : "#A1A1AA", fontWeight: "600", fontSize: 14 }}>
              {copied ? t("copied") : "Copy Key"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: "#FF6600", borderRadius: 16, paddingVertical: 18, alignItems: "center" }}
            activeOpacity={0.85}
            onPress={() => navigation.replace("Main")}
          >
            <Text style={{ color: "#000", fontWeight: "700", fontSize: 15 }}>
              {t("continueBtn")}  →
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24 }}>
          <Text style={{ color: "#FF6600", fontSize: 28, fontWeight: "900", marginBottom: 6 }}>
            {t("signup")}
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
            onSubmitEditing={handleVerifyAndRegister}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#FF6600",
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: "center",
              marginBottom: 16,
              opacity: loading ? 0.7 : 1,
            }}
            activeOpacity={0.85}
            onPress={handleVerifyAndRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={{ color: "#000", fontWeight: "700", fontSize: 15 }}>
                {t("registerIdentity")}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={{ alignItems: "center", paddingVertical: 12 }}
          >
            <Text style={{ color: "#52525B", fontSize: 14 }}>
              Already registered?{"  "}
              <Text style={{ color: "#FF6600", fontWeight: "600" }}>{t("login")}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

SignupScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
