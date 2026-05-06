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
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Line, Polyline } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ORANGE = "#FF5722";
const ORANGE_LIGHT = "#FF8A65";
const ORANGE_DARK = "#E64A19";
const DARK_BG = "#1A1A2E";
const CARD_BG = "#16213E";

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function IconChevronLeft({ color = "#FFFFFF", size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 18l-6-6 6-6" />
    </Svg>
  );
}

function IconCheck({ color = ORANGE, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="20 6 9 17 4 12" />
    </Svg>
  );
}

function IconGlobe({ color = ORANGE, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Line x1="2" y1="12" x2="22" y2="12" />
      <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Svg>
  );
}

function IconFlag({ code, size = 32 }: { code: string; size?: number }) {
  const flags: Record<string, { emoji: string; colors: string[] }> = {
    en: { emoji: "🇬🇧", colors: ["#012169", "#C8102E", "#FFFFFF"] },
    sw: { emoji: "🇰🇪", colors: ["#000000", "#BB0000", "#006600"] },
    so: { emoji: "🇸🇴", colors: ["#4189DD", "#FFFFFF"] },
    ar: { emoji: "🇸🇦", colors: ["#006C35", "#FFFFFF"] },
    fr: { emoji: "🇫🇷", colors: ["#002395", "#FFFFFF", "#ED2939"] },
  };

  const flag = flags[code] || flags.en;

  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Circle cx="16" cy="16" r="15" fill={flag.colors[0]} />
      {flag.colors.length > 1 && (
        <>
          <Circle cx="16" cy="16" r="15" fill="none" stroke={flag.colors[1]} strokeWidth="1" />
          {flag.colors[2] && (
            <Line x1="2" y1="16" x2="30" y2="16" stroke={flag.colors[2]} strokeWidth="2" />
          )}
        </>
      )}
    </Svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: "ltr" | "rtl";
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function LanguageSettingsScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isSaving, setIsSaving] = useState(false);
  const [savedLanguage, setSavedLanguage] = useState("en");
  const navigation = useNavigation<any>();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const listItemAnims = useRef([...Array(5)].map(() => new Animated.Value(50))).current;

  useEffect(() => {
    loadSavedLanguage();
    
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
      // Staggered list animation
      Animated.stagger(80,
        listItemAnims.map(anim =>
          Animated.spring(anim, {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem("appLanguage");
      if (saved) {
        setSelectedLanguage(saved);
        setSavedLanguage(saved);
      }
    } catch (error) {
      console.log("Error loading language:", error);
    }
  };

  const languages: Language[] = [
    { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", direction: "ltr" },
    { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪", direction: "ltr" },
    { code: "so", name: "Somali", nativeName: "Soomaali", flag: "🇸🇴", direction: "ltr" },
    { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", direction: "rtl" },
    { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", direction: "ltr" },
  ];

  const handleLanguageSelect = async (code: string) => {
    if (code === selectedLanguage) return;
    
    setIsSaving(true);
    setSelectedLanguage(code);
    
    try {
      // Save to storage
      await AsyncStorage.setItem("appLanguage", code);
      
      // Simulate language change
      setTimeout(() => {
        setIsSaving(false);
        setSavedLanguage(code);
        
        Alert.alert(
          "Language Changed",
          `The app language has been changed to ${languages.find(l => l.code === code)?.name}.`,
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }, 500);
    } catch (error) {
      setIsSaving(false);
      setSelectedLanguage(savedLanguage);
      Alert.alert("Error", "Failed to change language. Please try again.");
    }
  };

  const getLanguageStatus = (code: string) => {
    if (code === selectedLanguage && isSaving) return "saving";
    if (code === selectedLanguage) return "selected";
    return "default";
  };

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
              <Text style={styles.headerTitle}>Language</Text>
              <Text style={styles.headerSubtitle}>
                Choose your preferred language
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
            { opacity: fadeAnim }
          ]}>
            {/* Current Language Info */}
            <View style={styles.infoCard}>
              <ExpoLinearGradient
                colors={[CARD_BG, '#1E2A4A']}
                style={styles.infoGradient}
              >
                <View style={styles.infoContent}>
                  <IconGlobe size={24} />
                  <View style={styles.infoText}>
                    <Text style={styles.infoTitle}>App Language</Text>
                    <Text style={styles.infoDescription}>
                      Changing the language will update all text in the app immediately.
                    </Text>
                  </View>
                </View>
              </ExpoLinearGradient>
            </View>

            {/* Language List */}
            <View style={styles.languageSection}>
              <Text style={styles.sectionTitle}>SELECT LANGUAGE</Text>
              
              <View style={styles.languageList}>
                {languages.map((language, index) => {
                  const status = getLanguageStatus(language.code);
                  
                  return (
                    <Animated.View
                      key={language.code}
                      style={{
                        transform: [{ translateY: listItemAnims[index] }],
                      }}
                    >
                      <Pressable
                        onPress={() => handleLanguageSelect(language.code)}
                        disabled={isSaving}
                        style={({ pressed }) => [
                          styles.languageItem,
                          index === 0 && styles.languageItemFirst,
                          index === languages.length - 1 && styles.languageItemLast,
                          status === "selected" && styles.languageItemSelected,
                          status === "saving" && styles.languageItemSaving,
                          pressed && !isSaving && styles.languageItemPressed,
                        ]}
                      >
                        {/* Flag Emoji */}
                        <View style={styles.flagContainer}>
                          <Text style={styles.flagEmoji}>{language.flag}</Text>
                        </View>

                        {/* Language Info */}
                        <View style={styles.languageInfo}>
                          <Text style={[
                            styles.languageName,
                            status === "selected" && styles.languageNameSelected,
                          ]}>
                            {language.name}
                          </Text>
                          <Text style={styles.languageNative}>
                            {language.nativeName}
                          </Text>
                          
                          {/* Direction indicator */}
                          <View style={styles.languageMeta}>
                            <View style={[
                              styles.directionBadge,
                              language.direction === "rtl" && styles.directionBadgeRTL,
                            ]}>
                              <Text style={styles.directionText}>
                                {language.direction === "rtl" ? "RTL" : "LTR"}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/* Selection Indicator */}
                        <View style={styles.selectionIndicator}>
                          {status === "selected" && (
                            <View style={styles.checkContainer}>
                              <IconCheck size={22} />
                            </View>
                          )}
                          {status === "saving" && (
                            <View style={styles.savingContainer}>
                              <View style={styles.savingDot} />
                            </View>
                          )}
                          {status === "default" && (
                            <View style={styles.radioOuter}>
                              <View style={styles.radioDot} />
                            </View>
                          )}
                        </View>
                      </Pressable>
                    </Animated.View>
                  );
                })}
              </View>
            </View>

            {/* Language Note */}
            <View style={styles.noteCard}>
              <View style={styles.noteContent}>
                <Text style={styles.noteTitle}>Need another language?</Text>
                <Text style={styles.noteText}>
                  We're working on adding more languages. Contact support to request your language.
                </Text>
                <Pressable style={styles.requestButton}>
                  <Text style={styles.requestButtonText}>Request Language</Text>
                </Pressable>
              </View>
            </View>
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
  // Info Card
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  infoGradient: {
    padding: 16,
  },
  infoContent: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "700",
  },
  infoDescription: {
    color: '#999',
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 18,
  },
  // Language Section
  languageSection: {
    gap: 12,
  },
  sectionTitle: {
    color: '#666',
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
    paddingHorizontal: 4,
  },
  languageList: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    overflow: 'hidden',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
    gap: 14,
  },
  languageItemFirst: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  languageItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  languageItemSelected: {
    backgroundColor: ORANGE + '10',
    borderColor: ORANGE + '30',
  },
  languageItemSaving: {
    opacity: 0.7,
  },
  languageItemPressed: {
    backgroundColor: '#2A2A3E',
  },
  flagContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#2A2A3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagEmoji: {
    fontSize: 28,
  },
  languageInfo: {
    flex: 1,
    gap: 3,
  },
  languageName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  languageNameSelected: {
    color: ORANGE,
  },
  languageNative: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
  },
  languageMeta: {
    flexDirection: 'row',
    marginTop: 4,
  },
  directionBadge: {
    backgroundColor: '#2196F3' + '15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  directionBadgeRTL: {
    backgroundColor: '#FF9800' + '15',
  },
  directionText: {
    fontSize: 9,
    fontWeight: "800",
    color: '#2196F3',
    letterSpacing: 1,
  },
  selectionIndicator: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ORANGE + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ORANGE + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  // Note Card
  noteCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  noteContent: {
    alignItems: 'center',
    gap: 12,
  },
  noteTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "700",
  },
  noteText: {
    color: '#666',
    fontSize: 13,
    fontWeight: "500",
    textAlign: 'center',
    lineHeight: 18,
  },
  requestButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: ORANGE + '15',
    borderWidth: 1,
    borderColor: ORANGE + '30',
  },
  requestButtonText: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: "700",
  },
});