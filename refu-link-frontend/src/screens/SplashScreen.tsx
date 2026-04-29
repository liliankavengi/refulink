import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import Svg, { Circle, Path } from "react-native-svg";
import { cssInterop } from "nativewind";

// Wire up NativeWind interop for core components
cssInterop(View, { className: "style" });
cssInterop(Text, { className: "style" });
cssInterop(Pressable, { className: "style" });

const ORANGE = "#FF5722";

export default function SplashScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const navigation = useNavigation<any>();

  const handleGetStarted = () => {
    navigation.navigate("Identification");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inner}>

        {/* Logo */}
        <View style={styles.logoWrapper}>
          <Svg width={120} height={120} viewBox="0 0 120 120" fill="none">
            <Circle cx="60" cy="60" r="55" stroke={ORANGE} strokeWidth="4" />
            <Path
              d="M40 60L55 75L80 45"
              stroke={ORANGE}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        {/* Title */}
        <Text style={styles.title}>REFULINK</Text>

        {/* Language Selector */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(value) => setSelectedLanguage(value)}
            style={styles.picker}
            dropdownIconColor={ORANGE}
          >
            <Picker.Item label="English" value="en" color="#fff" />
            <Picker.Item label="Kiswahili" value="sw" color="#fff" />
            <Picker.Item label="العربية (Arabic)" value="ar" color="#fff" />
            <Picker.Item label="Soomaali (Somali)" value="so" color="#fff" />
            <Picker.Item label="Français" value="fr" color="#fff" />
          </Picker>
        </View>

        {/* Get Started Button */}
        <Pressable
          onPress={handleGetStarted}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  inner: {
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    gap: 40,
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: ORANGE,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  pickerWrapper: {
    width: "100%",
    borderWidth: 2,
    borderColor: ORANGE,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000000",
  },
  picker: {
    color: "#FFFFFF",
    backgroundColor: "#000000",
    width: "100%",
  },
  button: {
    width: "100%",
    backgroundColor: ORANGE,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
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