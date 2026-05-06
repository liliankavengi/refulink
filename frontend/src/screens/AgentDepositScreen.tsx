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
  Linking,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Line, Rect, Polyline, Polygon } from "react-native-svg";

const ORANGE = "#FF5722";
const ORANGE_LIGHT = "#FF8A65";
const ORANGE_DARK = "#E64A19";
const DARK_BG = "#1A1A2E";
const CARD_BG = "#16213E";
const GREEN = "#4CAF50";

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function IconChevronLeft({ color = "#FFFFFF", size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 18l-6-6 6-6" />
    </Svg>
  );
}

function IconMapPin({ color = ORANGE, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <Circle cx="12" cy="10" r="3" />
    </Svg>
  );
}

function IconPhone({ color = ORANGE, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  );
}

function IconNavigation({ color = ORANGE, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polygon points="3 11 22 2 13 21 11 13 3 11" />
    </Svg>
  );
}

function IconClock({ color = "#666", size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Polyline points="12 6 12 12 16 14" />
    </Svg>
  );
}

function IconShield({ color = "#666", size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );
}

function IconStar({ color = ORANGE, size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
      <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Svg>
  );
}

function IconUsers({ color = ORANGE, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <Circle cx="9" cy="7" r="4" />
      <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Agent = {
  id: number;
  name: string;
  location: string;
  distance: string;
  phone: string;
  rating?: number;
  hours?: string;
  type?: string;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AgentDepositScreen() {
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const navigation = useNavigation<any>();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const listItemAnims = useRef([...Array(3)].map(() => new Animated.Value(50))).current;

  useEffect(() => {
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
      Animated.stagger(100,
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

  const agents: Agent[] = [
    {
      id: 1,
      name: "Kakuma Agent Hub",
      location: "Block 3, Main Market",
      distance: "0.5 km",
      phone: "+254 712 345 678",
      rating: 4.8,
      hours: "8:00 AM - 6:00 PM",
      type: "Premium Agent",
    },
    {
      id: 2,
      name: "Mama Grace Money Services",
      location: "Zone 4, Near Hospital",
      distance: "1.2 km",
      phone: "+254 723 456 789",
      rating: 4.5,
      hours: "7:00 AM - 8:00 PM",
      type: "Verified Agent",
    },
    {
      id: 3,
      name: "Community Trust Point",
      location: "Block 1, Center Plaza",
      distance: "2.1 km",
      phone: "+254 734 567 890",
      rating: 4.2,
      hours: "9:00 AM - 5:00 PM",
      type: "Community Agent",
    },
  ];

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert("Error", "Could not open phone app");
    });
  };

  const handleGetDirections = (agent: Agent) => {
    const { location } = agent;
    const url = Platform.select({
      ios: `maps:0,0?q=${location}`,
      android: `geo:0,0?q=${location}`,
    });
    
    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert(
          "Directions",
          `Navigate to: ${agent.name}\n${agent.location}`
        );
      });
    }
  };

  const handleSelectAgent = (id: number) => {
    setSelectedAgent(id);
    // Could navigate to agent detail or deposit form
    setTimeout(() => {
      navigation.navigate("DepositForm", { agentId: id });
    }, 300);
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
              <Text style={styles.headerTitle}>Agent Deposit</Text>
              <Text style={styles.headerSubtitle}>
                Visit authorized agents nearby
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
            {/* Info Banner */}
            <View style={styles.infoBanner}>
              <ExpoLinearGradient
                colors={[CARD_BG, '#1E2A4A']}
                style={styles.infoGradient}
              >
                <View style={styles.infoContent}>
                  <View style={styles.infoIcon}>
                    <IconShield size={18} />
                  </View>
                  <View style={styles.infoText}>
                    <Text style={styles.infoTitle}>Authorized Agents</Text>
                    <Text style={styles.infoDescription}>
                      All agents are verified and authorized to process deposits.
                    </Text>
                  </View>
                </View>
              </ExpoLinearGradient>
            </View>

            {/* Agent List */}
            <View style={styles.agentList}>
              {agents.map((agent, index) => (
                <Animated.View
                  key={agent.id}
                  style={{
                    transform: [{ translateY: listItemAnims[index] }],
                  }}
                >
                  <Pressable
                    onPress={() => handleSelectAgent(agent.id)}
                    style={({ pressed }) => [
                      styles.agentCard,
                      selectedAgent === agent.id && styles.agentCardSelected,
                      pressed && styles.agentCardPressed,
                    ]}
                  >
                    {/* Agent Type Badge */}
                    <View style={styles.agentBadge}>
                      <View style={[
                        styles.badgeDot,
                        agent.type === "Premium Agent" && styles.badgeDotPremium,
                        agent.type === "Verified Agent" && styles.badgeDotVerified,
                        agent.type === "Community Agent" && styles.badgeDotCommunity,
                      ]} />
                      <Text style={styles.badgeText}>{agent.type}</Text>
                    </View>

                    {/* Agent Info */}
                    <View style={styles.agentInfo}>
                      {/* Name and Rating */}
                      <View style={styles.agentHeader}>
                        <View style={styles.agentNameRow}>
                          <View style={styles.agentIcon}>
                            <IconUsers size={20} />
                          </View>
                          <View style={styles.agentNameInfo}>
                            <Text style={styles.agentName}>{agent.name}</Text>
                            <View style={styles.ratingRow}>
                              <IconStar size={12} />
                              <Text style={styles.ratingText}>{agent.rating}</Text>
                              <Text style={styles.ratingCount}>(120+ reviews)</Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.distanceBadge}>
                          <IconNavigation size={12} />
                          <Text style={styles.distanceText}>{agent.distance}</Text>
                        </View>
                      </View>

                      {/* Contact Details */}
                      <View style={styles.contactDetails}>
                        <View style={styles.contactRow}>
                          <IconMapPin size={14} />
                          <Text style={styles.contactText}>{agent.location}</Text>
                        </View>
                        <View style={styles.contactRow}>
                          <IconPhone size={14} />
                          <Text style={styles.contactText}>{agent.phone}</Text>
                        </View>
                        <View style={styles.contactRow}>
                          <IconClock size={14} />
                          <Text style={styles.contactText}>{agent.hours}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionRow}>
                      <Pressable
                        onPress={() => handleCall(agent.phone)}
                        style={({ pressed }) => [
                          styles.actionButton,
                          styles.callButton,
                          pressed && styles.callButtonPressed,
                        ]}
                      >
                        <IconPhone size={14} />
                        <Text style={styles.actionButtonText}>Call</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleGetDirections(agent)}
                        style={({ pressed }) => [
                          styles.actionButton,
                          styles.directionsButton,
                          pressed && styles.directionsButtonPressed,
                        ]}
                      >
                        <IconNavigation size={14} />
                        <Text style={styles.directionsButtonText}>Directions</Text>
                      </Pressable>
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
            </View>

            {/* Safety Tips */}
            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>Deposit Tips</Text>
              <View style={styles.tipItem}>
                <View style={styles.tipNumber}>
                  <Text style={styles.tipNumberText}>1</Text>
                </View>
                <Text style={styles.tipText}>
                  Always verify the agent's ID before making a deposit
                </Text>
              </View>
              <View style={styles.tipItem}>
                <View style={styles.tipNumber}>
                  <Text style={styles.tipNumberText}>2</Text>
                </View>
                <Text style={styles.tipText}>
                  Request a receipt for every transaction
                </Text>
              </View>
              <View style={styles.tipItem}>
                <View style={styles.tipNumber}>
                  <Text style={styles.tipNumberText}>3</Text>
                </View>
                <Text style={styles.tipText}>
                  Deposits reflect instantly in your wallet
                </Text>
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
    gap: 20,
  },
  // Info Banner
  infoBanner: {
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
    gap: 12,
    alignItems: 'flex-start',
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#2A2A3E',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
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
  // Agent List
  agentList: {
    gap: 16,
  },
  agentCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    overflow: 'hidden',
  },
  agentCardSelected: {
    borderColor: ORANGE,
  },
  agentCardPressed: {
    borderColor: ORANGE + '40',
  },
  agentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#2A2A3E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 16,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666',
  },
  badgeDotPremium: {
    backgroundColor: ORANGE,
  },
  badgeDotVerified: {
    backgroundColor: GREEN,
  },
  badgeDotCommunity: {
    backgroundColor: '#2196F3',
  },
  badgeText: {
    color: '#999',
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  agentInfo: {
    gap: 16,
  },
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  agentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  agentIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: ORANGE + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ORANGE + '20',
  },
  agentNameInfo: {
    flex: 1,
    gap: 4,
  },
  agentName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: "700",
  },
  ratingCount: {
    color: '#666',
    fontSize: 11,
    fontWeight: "500",
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ORANGE + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  distanceText: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: "700",
  },
  contactDetails: {
    gap: 8,
    backgroundColor: DARK_BG,
    padding: 14,
    borderRadius: 14,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactText: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  callButton: {
    backgroundColor: ORANGE,
  },
  callButtonPressed: {
    opacity: 0.85,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  directionsButton: {
    backgroundColor: ORANGE + '15',
    borderWidth: 1,
    borderColor: ORANGE + '30',
  },
  directionsButtonPressed: {
    backgroundColor: ORANGE + '25',
  },
  directionsButtonText: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  // Tips Card
  tipsCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    gap: 14,
  },
  tipsTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: ORANGE + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  tipNumberText: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: "800",
  },
  tipText: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
    lineHeight: 18,
  },
});