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
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Line, Polyline, Rect } from "react-native-svg";

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

function IconCheckCircle({ color = ORANGE, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Polyline points="22 4 12 14.01 9 11.01" />
    </Svg>
  );
}

function IconClock({ color = "#999", size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Polyline points="12 6 12 12 16 14" />
    </Svg>
  );
}

function IconHeart({ color = ORANGE, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </Svg>
  );
}

function IconShield({ color = "#666", size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );
}

function IconCalendar({ color = "#666", size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <Line x1="16" y1="2" x2="16" y2="6" />
      <Line x1="8" y1="2" x2="8" y2="6" />
      <Line x1="3" y1="10" x2="21" y2="10" />
    </Svg>
  );
}

function IconLink({ color = ORANGE, size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
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

function IconTrendingUp({ color = GREEN, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <Polyline points="17 6 23 6 23 12" />
    </Svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type AidTransfer = {
  id: number;
  organization: string;
  amount: string;
  status: "completed" | "pending" | "processing";
  date: string;
  verified: boolean;
  reference?: string;
  type?: string;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AidDepositScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [expandedTransfer, setExpandedTransfer] = useState<number | null>(null);
  const navigation = useNavigation<any>();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const listItemAnims = useRef([...Array(2)].map(() => new Animated.Value(50))).current;

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
      Animated.stagger(150,
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

  const aidTransfers: AidTransfer[] = [
    {
      id: 1,
      organization: "UNHCR Cash Assistance",
      amount: "KES 5,000.00",
      status: "completed",
      date: "2026-04-15",
      verified: true,
      reference: "UNHCR-2026-04-001",
      type: "Monthly Allowance",
    },
    {
      id: 2,
      organization: "WFP Food Voucher",
      amount: "KES 3,200.00",
      status: "pending",
      date: "2026-04-25",
      verified: false,
      reference: "WFP-2026-04-089",
      type: "Food Assistance",
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return GREEN;
      case "pending":
        return "#FF9800";
      case "processing":
        return "#2196F3";
      default:
        return "#666";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return IconCheckCircle;
      case "pending":
        return IconClock;
      case "processing":
        return IconLink;
      default:
        return IconClock;
    }
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
              <Text style={styles.headerTitle}>Aid / NGO Funding</Text>
              <Text style={styles.headerSubtitle}>
                Receive verified aid transfers
              </Text>
            </View>
          </View>
        </Animated.View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={ORANGE}
              colors={[ORANGE]}
            />
          }
        >
          <Animated.View style={[
            styles.content,
            { opacity: fadeAnim }
          ]}>
            {/* Stats Summary */}
            <View style={styles.statsCard}>
              <ExpoLinearGradient
                colors={[CARD_BG, '#1E2A4A']}
                style={styles.statsGradient}
              >
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <View style={[styles.statIcon, styles.statIconGreen]}>
                      <IconTrendingUp size={16} />
                    </View>
                    <Text style={styles.statValue}>KES 5,000</Text>
                    <Text style={styles.statLabel}>Received</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <View style={[styles.statIcon, styles.statIconOrange]}>
                      <IconClock size={16} />
                    </View>
                    <Text style={styles.statValue}>KES 3,200</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <View style={[styles.statIcon, styles.statIconBlue]}>
                      <IconUsers size={16} />
                    </View>
                    <Text style={styles.statValue}>2</Text>
                    <Text style={styles.statLabel}>Organizations</Text>
                  </View>
                </View>
              </ExpoLinearGradient>
            </View>

            {/* Organization Badge */}
            <View style={styles.orgBadge}>
              <IconHeart size={18} />
              <Text style={styles.orgBadgeText}>Partner Organizations</Text>
            </View>

            {/* Aid Transfers List */}
            <View style={styles.transferList}>
              {aidTransfers.map((transfer, index) => {
                const StatusIcon = getStatusIcon(transfer.status);
                const statusColor = getStatusColor(transfer.status);
                const isExpanded = expandedTransfer === transfer.id;

                return (
                  <Animated.View
                    key={transfer.id}
                    style={{
                      transform: [{ translateY: listItemAnims[index] }],
                    }}
                  >
                    <Pressable
                      onPress={() => setExpandedTransfer(isExpanded ? null : transfer.id)}
                      style={({ pressed }) => [
                        styles.transferCard,
                        pressed && styles.transferCardPressed,
                      ]}
                    >
                      {/* Card Header */}
                      <View style={styles.transferHeader}>
                        <View style={styles.transferOrg}>
                          <View style={styles.orgIconContainer}>
                            <IconUsers size={20} />
                          </View>
                          <View style={styles.orgInfo}>
                            <Text style={styles.orgName}>{transfer.organization}</Text>
                            <Text style={styles.orgType}>{transfer.type}</Text>
                          </View>
                        </View>
                        <Text style={styles.transferAmount}>{transfer.amount}</Text>
                      </View>

                      {/* Status Section */}
                      <View style={styles.statusSection}>
                        <View style={[
                          styles.statusBadge,
                          { backgroundColor: statusColor + '15' }
                        ]}>
                          <StatusIcon color={statusColor} size={16} />
                          <Text style={[styles.statusText, { color: statusColor }]}>
                            {transfer.status === "completed" ? "Received & Verified" :
                             transfer.status === "pending" ? "Pending Disbursement" :
                             "Processing"}
                          </Text>
                        </View>
                        
                        {/* Verification Badge */}
                        {transfer.verified && (
                          <View style={styles.verifiedBadge}>
                            <IconLink size={12} />
                            <Text style={styles.verifiedText}>Blockchain Verified</Text>
                          </View>
                        )}
                      </View>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <View style={styles.expandedDetails}>
                          <View style={styles.detailDivider} />
                          
                          <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                              <IconCalendar size={14} />
                              <Text style={styles.detailLabel}>Expected Date</Text>
                            </View>
                            <Text style={styles.detailValue}>
                              {formatDate(transfer.date)}
                            </Text>
                          </View>
                          
                          <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                              <IconShield size={14} />
                              <Text style={styles.detailLabel}>Reference</Text>
                            </View>
                            <Text style={styles.detailValue}>
                              {transfer.reference}
                            </Text>
                          </View>
                          
                          <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                              <IconLink size={14} />
                              <Text style={styles.detailLabel}>Status</Text>
                            </View>
                            <Text style={[
                              styles.detailValue,
                              { color: statusColor }
                            ]}>
                              {transfer.status.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                      )}

                      {/* Expand Indicator */}
                      <View style={styles.expandIndicator}>
                        <Text style={styles.expandText}>
                          {isExpanded ? "Show Less" : "Show More"}
                        </Text>
                      </View>
                    </Pressable>
                  </Animated.View>
                );
              })}
            </View>

            {/* Info Cards */}
            <View style={styles.infoCards}>
              {/* How It Works */}
              <View style={styles.infoCard}>
                <ExpoLinearGradient
                  colors={[CARD_BG, '#1E2A4A']}
                  style={styles.infoCardGradient}
                >
                  <Text style={styles.infoCardTitle}>How It Works</Text>
                  <View style={styles.infoSteps}>
                    <View style={styles.infoStep}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>1</Text>
                      </View>
                      <Text style={styles.stepText}>
                        Partner organizations verify your eligibility
                      </Text>
                    </View>
                    <View style={styles.infoStep}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>2</Text>
                      </View>
                      <Text style={styles.stepText}>
                        Funds are allocated to your wallet automatically
                      </Text>
                    </View>
                    <View style={styles.infoStep}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>3</Text>
                      </View>
                      <Text style={styles.stepText}>
                        Receive notification when transfer is complete
                      </Text>
                    </View>
                  </View>
                </ExpoLinearGradient>
              </View>

              {/* Blockchain Notice */}
              <View style={styles.blockchainCard}>
                <ExpoLinearGradient
                  colors={[CARD_BG, '#1E2A4A']}
                  style={styles.blockchainGradient}
                >
                  <View style={styles.blockchainContent}>
                    <IconShield size={18} />
                    <View style={styles.blockchainText}>
                      <Text style={styles.blockchainTitle}>Blockchain Security</Text>
                      <Text style={styles.blockchainDescription}>
                        Aid transfers are automatically deposited to your wallet when disbursed by partner organizations. All transfers are verified on the Stellar blockchain for transparency and security.
                      </Text>
                    </View>
                  </View>
                </ExpoLinearGradient>
              </View>
            </View>

            {/* Partner Logos */}
            <View style={styles.partnersSection}>
              <Text style={styles.partnersTitle}>SUPPORTED BY</Text>
              <View style={styles.partnersRow}>
                <View style={styles.partnerLogo}>
                  <Text style={styles.partnerText}>UNHCR</Text>
                </View>
                <View style={styles.partnerLogo}>
                  <Text style={styles.partnerText}>WFP</Text>
                </View>
                <View style={styles.partnerLogo}>
                  <Text style={styles.partnerText}>IRC</Text>
                </View>
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
  // Stats Card
  statsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  statsGradient: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconGreen: {
    backgroundColor: GREEN + '15',
  },
  statIconOrange: {
    backgroundColor: '#FF9800' + '15',
  },
  statIconBlue: {
    backgroundColor: '#2196F3' + '15',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "800",
  },
  statLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: "600",
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#2A2A3E',
  },
  // Org Badge
  orgBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  orgBadgeText: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  // Transfer List
  transferList: {
    gap: 16,
  },
  transferCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  transferCardPressed: {
    borderColor: ORANGE + '30',
  },
  transferHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  transferOrg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  orgIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: ORANGE + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ORANGE + '20',
  },
  orgInfo: {
    flex: 1,
    gap: 2,
  },
  orgName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: "700",
  },
  orgType: {
    color: '#666',
    fontSize: 12,
    fontWeight: "500",
  },
  transferAmount: {
    color: ORANGE,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  statusSection: {
    gap: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    color: ORANGE,
    fontSize: 11,
    fontWeight: "600",
  },
  // Expanded Details
  expandedDetails: {
    marginTop: 16,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#2A2A3E',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: "600",
  },
  expandIndicator: {
    alignItems: 'center',
    marginTop: 12,
  },
  expandText: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: "600",
  },
  // Info Cards
  infoCards: {
    gap: 16,
  },
  infoCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  infoCardGradient: {
    padding: 20,
    gap: 16,
  },
  infoCardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
  infoSteps: {
    gap: 12,
  },
  infoStep: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: ORANGE + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: "800",
  },
  stepText: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
    lineHeight: 18,
  },
  // Blockchain Card
  blockchainCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  blockchainGradient: {
    padding: 20,
  },
  blockchainContent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  blockchainText: {
    flex: 1,
    gap: 6,
  },
  blockchainTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "700",
  },
  blockchainDescription: {
    color: '#999',
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 18,
  },
  // Partners Section
  partnersSection: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  partnersTitle: {
    color: '#555',
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
  },
  partnersRow: {
    flexDirection: 'row',
    gap: 12,
  },
  partnerLogo: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#2A2A3E',
    borderWidth: 1,
    borderColor: '#3A3A4E',
  },
  partnerText: {
    color: '#999',
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
  },
});