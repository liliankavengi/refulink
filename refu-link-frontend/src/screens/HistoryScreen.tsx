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
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Line, Polyline, Rect, Polygon } from "react-native-svg";
import React from "react";

const { width } = Dimensions.get('window');
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

function IconTrendingUp({ color = ORANGE, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <Polyline points="17 6 23 6 23 12" />
    </Svg>
  );
}

function IconTrendingDown({ color = "#FFFFFF", size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <Polyline points="17 18 23 18 23 12" />
    </Svg>
  );
}

function IconUserPlus({ color = ORANGE, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <Circle cx="9" cy="7" r="4" />
      <Line x1="17" y1="11" x2="23" y2="11" />
      <Line x1="20" y1="8" x2="20" y2="14" />
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

function IconFilter({ color = "#666", size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
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

function IconSearch({ color = "#FFFFFF", size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="11" cy="11" r="8" />
      <Line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type TransactionType = "received" | "sent" | "vouch";
type FilterCategory = "all" | "sent" | "received" | "trust";

type Transaction = {
  id: number;
  type: TransactionType;
  category: FilterCategory;
  title: string;
  source: string;
  amount: string;
  date: string;
  verified: boolean;
  icon: React.FC<{ color?: string; size?: number }>;
  status?: string;
  reference?: string;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function TransactionHistoryScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const navigation = useNavigation<any>();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const listSlideAnim = useRef(new Animated.Value(50)).current;

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
      Animated.spring(listSlideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const allTransactions: Transaction[] = [
    {
      id: 1,
      type: "received",
      category: "received",
      title: "RECEIVED AID",
      source: "NGO Transfer",
      amount: "+KES 5,000.00",
      date: "2026-04-20",
      verified: true,
      icon: IconTrendingUp,
      status: "Completed",
      reference: "STL-8F3A2B",
    },
    {
      id: 2,
      type: "sent",
      category: "sent",
      title: "PAID KIOSK",
      source: "Mama Amina Kiosk",
      amount: "-KES 250.00",
      date: "2026-04-19",
      verified: false,
      icon: IconTrendingDown,
      status: "Pending",
    },
    {
      id: 3,
      type: "vouch",
      category: "trust",
      title: "NEW VOUCH",
      source: "Verified by Community Leader",
      amount: "+1 Trust",
      date: "2026-04-18",
      verified: true,
      icon: IconUserPlus,
      reference: "VCH-9K2M5",
    },
    {
      id: 4,
      type: "sent",
      category: "sent",
      title: "PAID MERCHANT",
      source: "Local Shop",
      amount: "-KES 1,200.00",
      date: "2026-04-17",
      verified: true,
      icon: IconTrendingDown,
      status: "Completed",
      reference: "STL-3B7D1E",
    },
    {
      id: 5,
      type: "received",
      category: "received",
      title: "RECEIVED TRANSFER",
      source: "Hassan Ahmed",
      amount: "+KES 3,500.00",
      date: "2026-04-16",
      verified: true,
      icon: IconTrendingUp,
      status: "Completed",
      reference: "STL-5A9C4F",
    },
  ];

  const transactions = allTransactions.filter((t) => {
    if (activeFilter === "all") return true;
    return t.category === activeFilter;
  });

  const filters: { id: FilterCategory; label: string; count?: number }[] = [
    { id: "all", label: "All", count: allTransactions.length },
    { id: "sent", label: "Sent", count: allTransactions.filter(t => t.category === "sent").length },
    { id: "received", label: "Received", count: allTransactions.filter(t => t.category === "received").length },
    { id: "trust", label: "Trust", count: allTransactions.filter(t => t.category === "trust").length },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleTransactionPress = (transaction: Transaction) => {
    navigation.navigate("TransactionDetail", { transaction });
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
              <Text style={styles.headerTitle}>History</Text>
              <Text style={styles.headerSubtitle}>
                {allTransactions.length} transactions
              </Text>
            </View>
            <Pressable style={({ pressed }) => [
              styles.searchButton,
              pressed && styles.searchButtonPressed,
            ]}>
              <IconSearch size={20} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Summary Card */}
        <Animated.View style={[
          styles.summaryCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <ExpoLinearGradient
            colors={[CARD_BG, '#1E2A4A']}
            style={styles.summaryGradient}
          >
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <IconTrendingUp color={GREEN} size={16} />
                <Text style={styles.summaryLabel}>Received</Text>
                <Text style={[styles.summaryValue, { color: GREEN }]}>
                  KES 8,500
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <IconTrendingDown color={ORANGE} size={16} />
                <Text style={styles.summaryLabel}>Sent</Text>
                <Text style={[styles.summaryValue, { color: ORANGE }]}>
                  KES 1,450
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <IconUserPlus color="#2196F3" size={16} />
                <Text style={styles.summaryLabel}>Trust</Text>
                <Text style={[styles.summaryValue, { color: "#2196F3" }]}>
                  +1
                </Text>
              </View>
            </View>
          </ExpoLinearGradient>
        </Animated.View>

        {/* Filter Tabs */}
        <Animated.View style={[
          styles.filterContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {filters.map((filter) => (
              <Pressable
                key={filter.id}
                onPress={() => setActiveFilter(filter.id)}
                style={[
                  styles.filterTab,
                  activeFilter === filter.id && styles.filterTabActive,
                ]}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === filter.id && styles.filterTextActive,
                ]}>
                  {filter.label}
                </Text>
                {filter.count !== undefined && (
                  <View style={[
                    styles.filterCount,
                    activeFilter === filter.id && styles.filterCountActive,
                  ]}>
                    <Text style={[
                      styles.filterCountText,
                      activeFilter === filter.id && styles.filterCountTextActive,
                    ]}>
                      {filter.count}
                    </Text>
                  </View>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Transaction List */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {transactions.length === 0 ? (
            <Animated.View style={[
              styles.emptyState,
              { transform: [{ translateY: listSlideAnim }] }
            ]}>
              <View style={styles.emptyIcon}>
                <IconTrendingUp size={48} />
              </View>
              <Text style={styles.emptyTitle}>No transactions yet</Text>
              <Text style={styles.emptyText}>
                Your activity will appear here
              </Text>
            </Animated.View>
          ) : (
            <View style={styles.transactionList}>
              {transactions.map((transaction, index) => (
                <Animated.View
                  key={transaction.id}
                  style={{
                    transform: [{
                      translateY: listSlideAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, 50 - (index * 10)],
                        extrapolate: 'clamp',
                      })
                    }],
                    opacity: fadeAnim,
                  }}
                >
                  <Pressable
                    onPress={() => handleTransactionPress(transaction)}
                    style={({ pressed }) => [
                      styles.transactionCard,
                      pressed && styles.transactionCardPressed,
                    ]}
                  >
                    <View style={styles.transactionContent}>
                      <View style={styles.transactionLeft}>
                        {/* Icon */}
                        <View style={[
                          styles.transactionIcon,
                          transaction.type === "received" && styles.iconReceived,
                          transaction.type === "sent" && styles.iconSent,
                          transaction.type === "vouch" && styles.iconVouch,
                        ]}>
                          <transaction.icon 
                            color={
                              transaction.type === "sent" ? "#FFFFFF" : ORANGE
                            } 
                            size={18} 
                          />
                        </View>

                        {/* Details */}
                        <View style={styles.transactionDetails}>
                          <View style={styles.transactionHeader}>
                            <Text style={styles.transactionTitle}>
                              {transaction.title}
                            </Text>
                            {transaction.verified && (
                              <IconLink size={12} />
                            )}
                          </View>
                          <Text style={styles.transactionSource}>
                            {transaction.source}
                          </Text>
                          <View style={styles.transactionMeta}>
                            <IconCalendar size={12} />
                            <Text style={styles.transactionDate}>
                              {formatDate(transaction.date)}
                            </Text>
                            {transaction.reference && (
                              <>
                                <View style={styles.metaDot} />
                                <Text style={styles.transactionRef}>
                                  {transaction.reference}
                                </Text>
                              </>
                            )}
                          </View>
                        </View>
                      </View>

                      {/* Amount */}
                      <View style={styles.transactionRight}>
                        <Text style={[
                          styles.transactionAmount,
                          (transaction.type === "received" || transaction.type === "vouch") 
                            ? styles.amountPositive 
                            : styles.amountNegative,
                        ]}>
                          {transaction.amount}
                        </Text>
                        {transaction.status && (
                          <View style={[
                            styles.statusBadge,
                            transaction.status === "Pending" && styles.statusPending,
                            transaction.status === "Completed" && styles.statusCompleted,
                          ]}>
                            <View style={[
                              styles.statusDot,
                              transaction.status === "Pending" && styles.statusDotPending,
                              transaction.status === "Completed" && styles.statusDotCompleted,
                            ]} />
                            <Text style={[
                              styles.statusText,
                              transaction.status === "Pending" && styles.statusTextPending,
                              transaction.status === "Completed" && styles.statusTextCompleted,
                            ]}>
                              {transaction.status}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Blockchain verification */}
                    {transaction.verified && transaction.type !== "vouch" && (
                      <View style={styles.verificationFooter}>
                        <View style={styles.verificationDot} />
                        <Text style={styles.verificationText}>
                          Verified on Stellar ledger
                        </Text>
                      </View>
                    )}
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          )}
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
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  searchButtonPressed: {
    backgroundColor: '#2A2A3E',
  },
  // Summary Card
  summaryCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  summaryGradient: {
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  summaryLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: "600",
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "800",
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#2A2A3E',
  },
  // Filter Tabs
  filterContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  filterTabActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  filterText: {
    color: '#999',
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  filterCount: {
    backgroundColor: '#2A2A3E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  filterCountActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterCountText: {
    color: '#666',
    fontSize: 11,
    fontWeight: "700",
  },
  filterCountTextActive: {
    color: '#FFFFFF',
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
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ORANGE + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  // Transaction List
  transactionList: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    overflow: 'hidden',
  },
  transactionCardPressed: {
    borderColor: ORANGE + '40',
    backgroundColor: '#1E2A4A',
  },
  transactionContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  iconReceived: {
    backgroundColor: ORANGE + '15',
  },
  iconSent: {
    backgroundColor: '#2A2A3E',
  },
  iconVouch: {
    backgroundColor: '#2196F3' + '15',
  },
  transactionDetails: {
    flex: 1,
    gap: 4,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transactionTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  transactionSource: {
    color: '#999',
    fontSize: 12,
    fontWeight: "500",
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  transactionDate: {
    color: '#666',
    fontSize: 11,
    fontWeight: "500",
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#444',
  },
  transactionRef: {
    color: '#555',
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  amountPositive: {
    color: ORANGE,
  },
  amountNegative: {
    color: '#FFFFFF',
  },
  // Status Badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPending: {
    backgroundColor: ORANGE + '15',
  },
  statusCompleted: {
    backgroundColor: GREEN + '15',
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusDotPending: {
    backgroundColor: ORANGE,
  },
  statusDotCompleted: {
    backgroundColor: GREEN,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  statusTextPending: {
    color: ORANGE,
  },
  statusTextCompleted: {
    color: GREEN,
  },
  // Verification Footer
  verificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1A1A2E',
    borderTopWidth: 1,
    borderTopColor: '#2A2A3E',
  },
  verificationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GREEN,
  },
  verificationText: {
    color: '#666',
    fontSize: 11,
    fontWeight: "500",
  },
});