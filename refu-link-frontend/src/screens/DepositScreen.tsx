import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Rect, Line } from "react-native-svg";

const ORANGE = "#FF5722";
const ORANGE_LIGHT = "#FF8A65";
const ORANGE_DARK = "#E64A19";
const DARK_BG = "#1A1A2E";
const CARD_BG = "#16213E";

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function ChevronLeft({ color = "#FFFFFF", size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 18l-6-6 6-6" />
    </Svg>
  );
}

function ChevronRight({ color = ORANGE, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 18l6-6-6-6" />
    </Svg>
  );
}

// Smartphone icon (M-PESA)
function IconSmartphone({ color = ORANGE, size = 32 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <Line x1="12" y1="18" x2="12.01" y2="18" />
    </Svg>
  );
}

// Users icon (Agent Deposit)
function IconUsers({ color = ORANGE, size = 32 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <Circle cx="9" cy="7" r="4" />
      <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

// Heart icon (AID / NGO)
function IconHeart({ color = ORANGE, size = 32 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </Svg>
  );
}

// Shield icon for security notice
function IconShield({ color = "#666", size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type DepositOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.FC<{ color?: string; size?: number }>;
  route: string;
  popular?: boolean;
  badge?: string;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function DepositOptionsScreen() {
  const navigation = useNavigation<any>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const depositOptions: DepositOption[] = [
    {
      id: "mpesa",
      title: "M-PESA",
      subtitle: "Deposit via Paybill or Till Number",
      icon: IconSmartphone,
      route: "MpesaDeposit",
      popular: true,
      badge: "INSTANT",
    },
    {
      id: "agent",
      title: "AGENT DEPOSIT",
      subtitle: "Visit a nearby authorized agent",
      icon: IconUsers,
      route: "AgentDeposit",
      badge: "CASH",
    },
    {
      id: "aid",
      title: "AID / NGO FUNDING",
      subtitle: "Receive verified aid transfers",
      icon: IconHeart,
      route: "AidDeposit",
      badge: "VERIFIED",
    },
  ];

  const handleDeposit = (option: DepositOption) => {
    setSelectedOption(option.id);
    setTimeout(() => {
      navigation.navigate(option.route);
    }, 200);
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
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backButtonPressed,
              ]}
            >
              <ChevronLeft size={24} />
            </Pressable>
            
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Deposit Funds</Text>
              <Text style={styles.headerSubtitle}>
                Add money securely to your wallet
              </Text>
            </View>
          </View>
          
          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={styles.progressStep}>
                <View style={[styles.progressDot, styles.progressDotActive]} />
                <Text style={styles.progressLabel}>Choose</Text>
              </View>
              <View style={styles.progressLine} />
              <View style={styles.progressStep}>
                <View style={styles.progressDot} />
                <Text style={styles.progressLabelInactive}>Details</Text>
              </View>
              <View style={styles.progressLine} />
              <View style={styles.progressStep}>
                <View style={styles.progressDot} />
                <Text style={styles.progressLabelInactive}>Confirm</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Deposit Options */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <IconShield size={20} />
            </View>
            <Text style={styles.infoText}>
              All deposits are encrypted and secured. Choose your preferred method below.
            </Text>
          </View>

          {/* Options List */}
          <View style={styles.optionsList}>
            {depositOptions.map((option) => (
              <Pressable
                key={option.id}
                onPress={() => handleDeposit(option)}
                style={({ pressed }) => [
                  styles.optionCard,
                  selectedOption === option.id && styles.optionCardSelected,
                  pressed && styles.optionCardPressed,
                ]}
              >
                <ExpoLinearGradient
                  colors={[
                    selectedOption === option.id ? ORANGE + '15' : CARD_BG,
                    selectedOption === option.id ? ORANGE + '05' : '#1E2A4A'
                  ]}
                  style={styles.optionGradient}
                >
                  {/* Badge */}
                  {option.badge && (
                    <View style={[
                      styles.badge,
                      option.popular && styles.badgePopular
                    ]}>
                      <Text style={[
                        styles.badgeText,
                        option.popular && styles.badgeTextPopular
                      ]}>
                        {option.badge}
                      </Text>
                    </View>
                  )}

                  <View style={styles.optionContent}>
                    <View style={styles.optionLeft}>
                      {/* Icon Container */}
                      <View style={[
                        styles.iconContainer,
                        selectedOption === option.id && styles.iconContainerSelected
                      ]}>
                        <option.icon 
                          color={selectedOption === option.id ? '#FFFFFF' : ORANGE} 
                          size={28} 
                        />
                      </View>

                      {/* Text */}
                      <View style={styles.optionText}>
                        <Text style={styles.optionTitle}>{option.title}</Text>
                        <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                        
                        {/* Features */}
                        <View style={styles.featuresRow}>
                          {option.id === "mpesa" && (
                            <>
                              <View style={styles.featureTag}>
                                <Text style={styles.featureText}>Paybill 247247</Text>
                              </View>
                              <View style={styles.featureTag}>
                                <Text style={styles.featureText}>Till 12345</Text>
                              </View>
                            </>
                          )}
                          {option.id === "agent" && (
                            <>
                              <View style={styles.featureTag}>
                                <Text style={styles.featureText}>200+ Agents</Text>
                              </View>
                              <View style={styles.featureTag}>
                                <Text style={styles.featureText}>No Fees</Text>
                              </View>
                            </>
                          )}
                          {option.id === "aid" && (
                            <>
                              <View style={styles.featureTag}>
                                <Text style={styles.featureText}>UNHCR</Text>
                              </View>
                              <View style={styles.featureTag}>
                                <Text style={styles.featureText}>WFP</Text>
                              </View>
                            </>
                          )}
                        </View>
                      </View>
                    </View>

                    {/* Arrow */}
                    <View style={styles.arrowContainer}>
                      <ChevronRight 
                        color={selectedOption === option.id ? '#FFFFFF' : ORANGE} 
                        size={24} 
                      />
                    </View>
                  </View>
                </ExpoLinearGradient>
              </Pressable>
            ))}
          </View>

          {/* Security Notice */}
          <View style={styles.securityNotice}>
            <IconShield size={14} />
            <Text style={styles.securityText}>
              Your funds are protected by bank-level security
            </Text>
          </View>
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
    bottom: 100,
    left: -80,
    opacity: 0.02,
  },
  safeArea: {
    flex: 1,
  },
  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
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
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: '#999',
    fontSize: 14,
    marginTop: 4,
  },
  // Progress
  progressContainer: {
    paddingHorizontal: 8,
  },
  progressTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressStep: {
    alignItems: 'center',
    gap: 6,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2A2A3E',
    borderWidth: 2,
    borderColor: '#3A3A4E',
  },
  progressDotActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  progressLabel: {
    color: ORANGE,
    fontSize: 10,
    fontWeight: "700",
  },
  progressLabelInactive: {
    color: '#666',
    fontSize: 10,
    fontWeight: "600",
  },
  progressLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2A2A3E',
    marginHorizontal: 4,
  },
  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 24,
  },
  // Info Card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#2A2A3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    color: '#999',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
    fontWeight: "500",
  },
  // Options List
  optionsList: {
    gap: 16,
  },
  optionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  optionCardSelected: {
    borderColor: ORANGE,
  },
  optionCardPressed: {
    borderColor: ORANGE + '60',
    transform: [{ scale: 0.99 }],
  },
  optionGradient: {
    padding: 20,
    position: 'relative',
  },
  // Badge
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#2A2A3E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  badgePopular: {
    backgroundColor: ORANGE,
  },
  badgeText: {
    color: '#666',
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  badgeTextPopular: {
    color: '#FFFFFF',
  },
  // Option Content
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: ORANGE + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ORANGE + '30',
  },
  iconContainerSelected: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  optionText: {
    flex: 1,
    gap: 6,
  },
  optionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  optionSubtitle: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  featureTag: {
    backgroundColor: '#2A2A3E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featureText: {
    color: '#666',
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#2A2A3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Security Notice
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  securityText: {
    color: '#666',
    fontSize: 12,
    fontWeight: "500",
  },
});