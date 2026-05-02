import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import { useLanguage } from "../context/LanguageContext";

const LANGUAGES = [
  { code: "en", label: "English",  native: "English",   flag: "🇬🇧" },
  { code: "sw", label: "Swahili",  native: "Kiswahili", flag: "🇰🇪" },
  { code: "so", label: "Somali",   native: "Soomaali",  flag: "🇸🇴" },
  { code: "ar", label: "Arabic",   native: "العربية",   flag: "🇸🇦" },
];

LanguageSelectionScreen.propTypes = {
  navigation: PropTypes.shape({ replace: PropTypes.func.isRequired }).isRequired,
};

export default function LanguageSelectionScreen({ navigation }) {
  const { setLanguage, t } = useLanguage();

  const handleSelect = async (code) => {
    await setLanguage(code);
    navigation.replace("Landing");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24 }}>

        <View style={{ alignItems: "center", marginBottom: 44 }}>
          <Text style={{ color: "#FF6600", fontSize: 40, fontWeight: "900", letterSpacing: 7 }}>
            REFULINK
          </Text>
          <View style={{ width: 32, height: 2, backgroundColor: "#FF6600", marginTop: 14, marginBottom: 14 }} />
          <Text style={{ color: "#52525B", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase" }}>
            {t("selectLanguage")}
          </Text>
        </View>

        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            onPress={() => handleSelect(lang.code)}
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#111",
              borderWidth: 1,
              borderColor: "#222",
              borderRadius: 16,
              paddingHorizontal: 20,
              paddingVertical: 18,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 26, marginRight: 16 }}>{lang.flag}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "600" }}>{lang.native}</Text>
              <Text style={{ color: "#52525B", fontSize: 12, marginTop: 3 }}>{lang.label}</Text>
            </View>
            <Text style={{ color: "#FF6600", fontSize: 20, fontWeight: "300" }}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
