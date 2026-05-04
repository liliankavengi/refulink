import { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Modal, 
  FlatList, 
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { cssInterop } from "nativewind";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";

// Wire up NativeWind interop for core components
cssInterop(View, { className: "style" });
cssInterop(Text, { className: "style" });
cssInterop(Pressable, { className: "style" });

const { width, height } = Dimensions.get('window');
const ORANGE = "#FF5722";
const ORANGE_LIGHT = "#FF8A65";
const ORANGE_DARK = "#E64A19";
const DARK_BG = "#1A1A2E";
const CARD_BG = "#16213E";

const LANGUAGES = [
  { label: "English", value: "en", flag: "🇬🇧", native: "English" },
  { label: "Kiswahili", value: "sw", flag: "🇰🇪", native: "Kiswahili" },
  { label: "العربية", value: "ar", flag: "🇸🇦", native: "العربية" },
  { label: "Soomaali", value: "so", flag: "🇸🇴", native: "Soomaali" },
  { label: "Français", value: "fr", flag: "🇫🇷", native: "Français" },
];

export default function OnboardingScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<any>();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleGetStarted = () => {
    navigation.navigate("Identification");
  };

  const selectedLang = LANGUAGES.find(lang => lang.value === selectedLanguage);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DARK_BG} />
      
      {/* Background Gradient */}
      <ExpoLinearGradient
        colors={[DARK_BG, '#16213E', '#0F3460']}
        style={styles.background}
      />
      
      {/* Decorative background elements */}
      <View style={styles.bgDecor}>
        <View style={[styles.bgCircle, styles.bgCircle1]} />
        <View style={[styles.bgCircle, styles.bgCircle2]} />
      </View>

      <View style={styles.inner}>
        {/* Logo Section with Glow */}
        <Animated.View style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          <View style={styles.logoGlow}>
            <View style={styles.logoWrapper}>
              <Svg width={140} height={140} viewBox="0 0 120 120" fill="none">
                <Defs>
                  <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={ORANGE} stopOpacity="1" />
                    <Stop offset="100%" stopColor={ORANGE_LIGHT} stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                
                {/* Outer ring with gradient */}
                <Circle cx="60" cy="60" r="55" stroke="url(#logoGradient)" strokeWidth="4" />
                
                {/* Inner subtle ring */}
                <Circle cx="60" cy="60" r="48" stroke={ORANGE} strokeWidth="0.5" opacity="0.3" />
                
                {/* Wallet body */}
                <Path
                  d="M40 40H80C85 40 90 45 90 50V63C90 70 85 75 80 75H40C35 75 30 70 30 65V50C30 45 35 40 40 40Z"
                  stroke="url(#logoGradient)"
                  strokeWidth="3"
                />
                
                {/* Wallet detail line */}
                <Path
                  d="M75 55H85"
                  stroke="url(#logoGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                
                {/* Decorative dots */}
                <Circle cx="40" cy="46" r="2" fill={ORANGE_LIGHT} opacity="0.8" />
                <Circle cx="80" cy="46" r="2" fill={ORANGE_LIGHT} opacity="0.8" />
              </Svg>
            </View>
          </View>
        </Animated.View>

        {/* Brand Text */}
        <Animated.View style={{ 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}>
          <Text style={styles.titleMain}>REF-M-LINK</Text>
          <Text style={styles.subtitle}>Financial Freedom</Text>
          
          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerDot} />
            <View style={styles.dividerLine} />
          </View>
        </Animated.View>

        {/* Language Selector Card */}
        <Animated.View style={[
          styles.card,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <Text style={styles.cardLabel}>SELECT LANGUAGE</Text>
          
          <TouchableOpacity 
            style={styles.languageSelector}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.langLeft}>
              <Text style={styles.flagEmoji}>{selectedLang?.flag}</Text>
              <View>
                <Text style={styles.selectedLanguageText}>{selectedLang?.label}</Text>
                <Text style={styles.nativeText}>{selectedLang?.native}</Text>
              </View>
            </View>
            <View style={styles.chevronContainer}>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Language Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Choose Language</Text>
              
              <FlatList
                data={LANGUAGES}
                keyExtractor={(item) => item.value}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.languageOption,
                      selectedLanguage === item.value && styles.selectedOption
                    ]}
                    onPress={() => {
                      setSelectedLanguage(item.value);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.flagEmoji}>{item.flag}</Text>
                    <View style={styles.langOptionText}>
                      <Text style={styles.languageOptionName}>{item.label}</Text>
                      <Text style={styles.languageOptionNative}>{item.native}</Text>
                    </View>
                    {selectedLanguage === item.value && (
                      <View style={styles.checkmarkContainer}>
                        <Text style={styles.checkmark}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Get Started Button */}
        <Animated.View style={{ 
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: pulseAnim }
          ],
          width: '100%'
        }}>
          <Pressable
            onPress={handleGetStarted}
            style={({ pressed }) => [
              styles.buttonWrapper,
              pressed && styles.buttonPressed,
            ]}
          >
            <ExpoLinearGradient
              colors={[ORANGE, ORANGE_DARK]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <Text style={styles.buttonArrow}>→</Text>
            </ExpoLinearGradient>
          </Pressable>
        </Animated.View>

        {/* Bottom indicator */}
        <Animated.View style={[
          styles.bottomDots,
          { opacity: fadeAnim }
        ]}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </Animated.View>
      </View>
    </View>
  );
}

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
    opacity: 0.05,
  },
  bgCircle1: {
    width: 300,
    height: 300,
    top: -50,
    right: -50,
  },
  bgCircle2: {
    width: 200,
    height: 200,
    bottom: 100,
    left: -30,
  },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  logoContainer: {
    marginBottom: 8,
  },
  logoGlow: {
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  titleMain: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 6,
    textAlign: 'center',
  },
  subtitle: {
    color: ORANGE_LIGHT,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 8,
    textAlign: 'center',
    marginTop: 8,
    textTransform: 'uppercase',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 32,
    width: '60%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: ORANGE,
    opacity: 0.3,
  },
  dividerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
    marginHorizontal: 16,
    opacity: 0.8,
  },
  card: {
    width: '100%',
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: ORANGE + '30',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardLabel: {
    color: ORANGE_LIGHT,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
    marginBottom: 12,
    opacity: 0.7,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DARK_BG,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: ORANGE + '40',
  },
  langLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flagEmoji: {
    fontSize: 32,
  },
  selectedLanguageText: {
    fontSize: 16,
    fontWeight: "700",
    color: '#FFFFFF',
  },
  nativeText: {
    fontSize: 12,
    color: ORANGE_LIGHT,
    marginTop: 2,
    opacity: 0.8,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ORANGE + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    fontSize: 20,
    color: ORANGE,
    fontWeight: "300",
    marginTop: -2,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: CARD_BG,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    maxHeight: height * 0.6,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: ORANGE + '40',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: '#FFFFFF',
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: DARK_BG,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: ORANGE,
    backgroundColor: ORANGE + '15',
  },
  langOptionText: {
    flex: 1,
    marginLeft: 12,
  },
  languageOptionName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: "600",
  },
  languageOptionNative: {
    fontSize: 13,
    color: ORANGE_LIGHT,
    marginTop: 2,
  },
  checkmarkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: "bold",
  },
  // Button Styles
  buttonWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 32,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: "800",
    fontSize: 17,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  buttonArrow: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: "300",
    marginLeft: 4,
  },
  bottomDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
    opacity: 0.3,
  },
  dotActive: {
    opacity: 1,
    width: 24,
  },
});