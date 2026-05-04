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
  Clipboard,
  Linking,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
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

function IconCopy({ color = ORANGE, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </Svg>
  );
}

function IconExternalLink({ color = ORANGE, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <Polyline points="15 3 21 3 21 9" />
      <Line x1="10" y1="14" x2="21" y2="3" />
    </Svg>
  );
}

function IconCheckCircle({ color = ORANGE, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Polyline points="22 4 12 14.01 9 11.01" />
    </Svg>
  );
}

function IconTrendingUp({ color = ORANGE, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <Polyline points="17 6 23 6 23 12" />
    </Svg>
  );
}

function IconTrendingDown({ color = "#FFFFFF", size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <Polyline points="17 18 23 18 23 12" />
    </Svg>
  );
}

function IconUserPlus({ color = ORANGE, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <Circle cx="9" cy="7" r="4" />
      <Line x1="17" y1="11" x2="23" y2="11" />
      <Line x1="20" y1="8" x2="20" y2="14" />
    </Svg>
  );
}

function IconCalendar({ color = "#666", size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <Line x1="16" y1="2" x2="16" y2="6" />
      <Line x1="8" y1="2" x2="8" y2="6" />
      <Line x1="3" y1="10" x2="21" y2="10" />
    </Svg>
  );
}

function IconClock({ color = "#666", size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Polyline points="12 6 12 12 16 14" />
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

function IconLink({ color = ORANGE, size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </Svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Transaction = {
  id: number;
  type: "received" | "sent" | "vouch";
  category: string;
  title: string;
  source: string;
  amount: string;
  date: string;
  verified: boolean;
  icon?: React.FC<{ color?: string; size?: number }>;
  status?: string;
  reference?: string;
};

type RouteParams = {
  TransactionDetail: {
    transaction: Transaction;
  };
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function TransactionDetailScreen() {
  const [copied, setCopied] = useState(false);
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, "TransactionDetail">>();
  const { transaction } = route.params || {};

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardScale = useRef(new Animated.Value(0.95)).current;

  // Mock data
  const hashId = "0x7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a";
  const shortHash = `${hashId.substring(0, 10)}...${hashId.substring(hashId.length - 8)}`;
  const timestamp = "2026-04-20 14:32:15 UTC";
  const blockNumber = "4,582,931";
  const confirmations = "12,847";

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
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!transaction) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Transaction not found</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewExplorer = () => {
    const url = `https://stellar.expert/explorer/public/tx/${hashId}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Could not open explorer");
    });
  };

  const getIcon = () => {
    switch (transaction.type) {
      case "received":
        return IconTrendingUp;
      case "sent":
        return IconTrendingDown;
      case "vouch":
        return IconUserPlus;
      default:
        return IconTrendingUp;
    }
  };

  const getAmountColor = () => {
    switch (transaction.type) {
      case "received":
      case "vouch":
        return ORANGE;
      case "sent":
        return "#FFFFFF";
      default:
        return "#FFFFFF";
    }
  };

  const TransactionIcon = getIcon();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DARK_BG} />
      
      <ExpoLinearGradient
        colors={[DARK_BG, '#16213E', '#0F3460']}
        style={styles.background}
      />
      
      <View style={styles.bgDecor}>
        <View style={[styles.bgCircle, styles.bgCircle1]} />
        <View style={[styles.bgCircle, styles.bgCircle2]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
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
              <Text style={styles.headerTitle}>Transaction</Text>
              <Text style={styles.headerSubtitle}>Details</Text>
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
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: cardScale }
              ]
            }
          ]}>
            {/* Amount Card */}
            <View style={styles.amountCard}>
              <ExpoLinearGradient
                colors={[CARD_BG, '#1E2A4A']}
                style={styles.amountGradient}
              >
                <View style={styles.amountIcon}>
                  <TransactionIcon color={getAmountColor()} size={28} />
                </View>
                <Text style={styles.amountLabel}>AMOUNT</Text>
                <Text style={[styles.amountValue, { color: getAmountColor() }]}>
                  {transaction.amount}
                </Text>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                
                {transaction.verified && (
                  <View style={styles.verifiedBadge}>
                    <IconCheckCircle color={GREEN} size={14} />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </ExpoLinearGradient>
            </View>

            {/* Details Card */}
            <View style={styles.detailsCard}>
              <ExpoLinearGradient
                colors={[CARD_BG, '#1E2A4A']}
                style={styles.detailsGradient}
              >
                <Text style={styles.sectionTitle}>TRANSACTION DETAILS</Text>

                <View style={styles.detailRow}>
                  <View style={styles.detailLeft}>
                    <IconLink size={14} />
                    <Text style={styles.detailLabel}>
                      {transaction.type === "received" ? "From" : 
                       transaction.type === "sent" ? "To" : "Event"}
                    </Text>
                  </View>
                  <Text style={styles.detailValue}>{transaction.source}</Text>
                </View>

                <View style={styles.detailDivider} />

                <View style={styles.detailRow}>
                  <View style={styles.detailLeft}>
                    <IconCalendar size={14} />
                    <Text style={styles.detailLabel}>Date</Text>
                  </View>
                  <Text style={styles.detailValue}>{transaction.date}</Text>
                </View>

                <View style={styles.detailDivider} />

                <View style={styles.detailRow}>
                  <View style={styles.detailLeft}>
                    <IconClock size={14} />
                    <Text style={styles.detailLabel}>Time</Text>
                  </View>
                  <Text style={styles.detailValue}>14:32:15 UTC</Text>
                </View>

                <View style={styles.detailDivider} />

                <View style={styles.detailRow}>
                  <View style={styles.detailLeft}>
                    <IconShield size={14} />
                    <Text style={styles.detailLabel}>Status</Text>
                  </View>
                  <View style={styles.statusContainer}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>
                      {transaction.status || "Confirmed"}
                    </Text>
                  </View>
                </View>
              </ExpoLinearGradient>
            </View>

            {/* Blockchain Verification */}
            {transaction.verified && transaction.type !== "vouch" && (
              <View style={styles.blockchainCard}>
                <ExpoLinearGradient
                  colors={[CARD_BG, '#1E2A4A']}
                  style={styles.blockchainGradient}
                >
                  <Text style={styles.sectionTitle}>BLOCKCHAIN VERIFICATION</Text>

                  {/* Transaction Hash */}
                  <View style={styles.hashSection}>
                    <Text style={styles.hashLabel}>Transaction Hash</Text>
                    <View style={styles.hashRow}>
                      <Text style={styles.hashText} numberOfLines={1}>
                        {shortHash}
                      </Text>
                      <Pressable
                        onPress={() => handleCopy(hashId)}
                        style={styles.copyButton}
                      >
                        <IconCopy size={16} />
                      </Pressable>
                    </View>
                    {copied && (
                      <Text style={styles.copiedText}>Copied to clipboard!</Text>
                    )}
                  </View>

                  <View style={styles.detailDivider} />

                  {/* Network */}
                  <View style={styles.detailRow}>
                    <View style={styles.detailLeft}>
                      <IconShield size={14} />
                      <Text style={styles.detailLabel}>Network</Text>
                    </View>
                    <Text style={styles.detailValue}>Stellar Mainnet</Text>
                  </View>

                  <View style={styles.detailDivider} />

                  {/* Block Number */}
                  <View style={styles.detailRow}>
                    <View style={styles.detailLeft}>
                      <Text style={styles.detailLabel}>Block</Text>
                    </View>
                    <Text style={styles.detailValue}>{blockNumber}</Text>
                  </View>

                  <View style={styles.detailDivider} />

                  {/* Confirmations */}
                  <View style={styles.detailRow}>
                    <View style={styles.detailLeft}>
                      <Text style={styles.detailLabel}>Confirmations</Text>
                    </View>
                    <View style={styles.statusContainer}>
                      <View style={[styles.statusDot, styles.statusDotGreen]} />
                      <Text style={styles.statusTextGreen}>{confirmations}</Text>
                    </View>
                  </View>

                  {/* View on Explorer */}
                  <Pressable
                    onPress={handleViewExplorer}
                    style={({ pressed }) => [
                      styles.explorerButton,
                      pressed && styles.explorerButtonPressed,
                    ]}
                  >
                    <Text style={styles.explorerButtonText}>
                      View on Explorer
                    </Text>
                    <IconExternalLink size={16} />
                  </Pressable>
                </ExpoLinearGradient>
              </View>
            )}

            {/* Back Button */}
            <Pressable
              onPress={() => navigation.navigate("History")}
              style={({ pressed }) => [
                styles.backToHistoryButton,
                pressed && styles.backToHistoryPressed,
              ]}
            >
              <ExpoLinearGradient
                colors={[ORANGE, ORANGE_DARK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.backToHistoryGradient}
              >
                <Text style={styles.backToHistoryText}>Back to History</Text>
              </ExpoLinearGradient>
            </Pressable>
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
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
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: '#666',
    fontSize: 12,
    fontWeight: "600",
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
  // Amount Card
  amountCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  amountGradient: {
    padding: 28,
    alignItems: 'center',
    gap: 12,
  },
  amountIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: ORANGE + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  amountLabel: {
    color: '#666',
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: 1,
  },
  transactionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: GREEN + '15',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  verifiedText: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "700",
  },
  // Details Card
  detailsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  detailsGradient: {
    padding: 20,
    gap: 14,
  },
  sectionTitle: {
    color: '#666',
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  detailDivider: {
    height: 1,
    backgroundColor: '#2A2A3E',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ORANGE,
  },
  statusDotGreen: {
    backgroundColor: GREEN,
  },
  statusText: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: "600",
  },
  statusTextGreen: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "600",
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
    gap: 14,
  },
  hashSection: {
    gap: 8,
  },
  hashLabel: {
    color: '#999',
    fontSize: 11,
    fontWeight: "500",
  },
  hashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A3E',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  hashText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: "500",
    fontFamily: 'monospace',
    flex: 1,
  },
  copyButton: {
    padding: 4,
  },
  copiedText: {
    color: ORANGE,
    fontSize: 11,
    fontWeight: "600",
  },
  explorerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2A2A3E',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 4,
  },
  explorerButtonPressed: {
    backgroundColor: '#3A3A4E',
  },
  explorerButtonText: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  // Back Button
  backToHistoryButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  backToHistoryPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  backToHistoryGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  backToHistoryText: {
    color: '#FFFFFF',
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});