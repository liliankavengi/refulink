import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import { useLanguage } from "../context/LanguageContext";

const HERO_FEATURES = [
  { symbol: "◈", label: "WALLET",  key: "wallet" },
  { symbol: "◎", label: "VERIFY",  key: "verify" },
  { symbol: "◇", label: "BORROW",  key: "borrow" },
];

export default function LandingScreen({ navigation }) {
  const { t } = useLanguage();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={{ flex: 1, justifyContent: "space-between", paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 }}>

        {/* Hero */}
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#FF6600", fontSize: 46, fontWeight: "900", letterSpacing: 8 }}>
            REFULINK
          </Text>
          <View style={{ width: 48, height: 2, backgroundColor: "#FF6600", marginVertical: 20 }} />
          <Text style={{ color: "#A1A1AA", fontSize: 14, textAlign: "center", lineHeight: 22, paddingHorizontal: 16 }}>
            {t("tagline")}
          </Text>

          <View style={{ flexDirection: "row", marginTop: 44, gap: 12 }}>
            {HERO_FEATURES.map(({ symbol, label, key }) => (
              <View
                key={key}
                style={{
                  backgroundColor: "#111",
                  borderWidth: 1,
                  borderColor: "#222",
                  borderRadius: 16,
                  width: 88,
                  height: 88,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Text style={{ color: "#FF6600", fontSize: 26 }}>{symbol}</Text>
                <Text style={{ color: "#52525B", fontSize: 9, fontWeight: "700", letterSpacing: 1.5 }}>
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTAs */}
        <View style={{ gap: 12 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#FF6600",
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: "center",
            }}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={{ color: "#000", fontSize: 15, fontWeight: "700", letterSpacing: 0.5 }}>
              {t("login")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#FF6600",
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: "center",
            }}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={{ color: "#FF6600", fontSize: 15, fontWeight: "700", letterSpacing: 0.5 }}>
              {t("signup")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("LanguageSelection")}
            style={{ paddingVertical: 12, alignItems: "center" }}
          >
            <Text style={{ color: "#52525B", fontSize: 12, letterSpacing: 0.5 }}>
              {t("selectLanguage")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

LandingScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};
