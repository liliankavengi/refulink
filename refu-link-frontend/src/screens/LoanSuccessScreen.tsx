import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Share,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Line, Polyline, Rect } from "react-native-svg";

const { width } = Dimensions.get('window');
const ORANGE = "#FF5722";
const ORANGE_LIGHT = "#FF8A65";
const ORANGE_DARK = "#E64A19";
const DARK_BG = "#1A1A2E";
const CARD_BG = "#16213E";
const GREEN = "#4CAF50";

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function IconCheckCircle({ color = ORANGE, size = 120, strokeWidth = 1.5 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" opacity={0.1} fill={color} />
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Polyline points="22 4 12 14.01 9 11.01" />
    </Svg>
  );
}

function IconCalendar({ color = ORANGE, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <Line x1="16" y1="2" x2="16" y2="6" />
      <Line x1="8" y1="2" x2="8" y2="6" />
      <Line x1="3" y1="10" x2="21" y2="10" />
    </Svg>
  );
}

function IconArrowRight({ color = "#FFFFFF", size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="5" y1="12" x2="19" y2="12" />
      <Polyline points="12 5 19 12 12 19" />
    </Svg>
  );
}

function IconReceipt({ color = ORANGE, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
      <Path d="M16 8H8" />
      <Path d="M16 12H8" />
      <Path d="M13 16H8" />
    </Svg>
  );
}

function IconShare({ color = ORANGE, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="18" cy="5" r="3" />
      <Circle cx="6" cy="12" r="3" />
      <Circle cx="18" cy="19" r="3" />
      <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
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

function IconDollarSign({ color = ORANGE, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="12" y1="1" x2="12" y2="23" />
      <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </Svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type RouteParams = {
  LoanSuccess: {
    amount: number;
  };
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function LoanSuccessScreen() {
  const [showDetails, setShowDetails] = useState(false);
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, "LoanSuccess">>();
  const { amount } = route.params || { amount: 0 };

  const repaymentAmount = amount * 1.05;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);
  
  const transactionId = `LN-${Date.now().toString(36).toUpperCase()}`;
  const releaseDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const detailsSlide = useRef(new Animated.Value(20)).current;
  const buttonsSlide = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    // Staggered animations
    Animated.sequence([
      Animated.delay(300),
      
      // Checkmark and ripples
      Animated.parallel([
        Animated.spring(checkmarkScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      
      // Ripple effects
      Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(ripple1, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(ripple1, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.sequence([
          Animated.delay(500),
          Animated.loop(
            Animated.sequence([
              Animated.timing(ripple2, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
              }),
              Animated.timing(ripple2, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
            ])
          ),
        ]),
        Animated.sequence([
          Animated.delay(1000),
          Animated.loop(
            Animated.sequence([
              Animated.timing(ripple3, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
              }),
              Animated.timing(ripple3, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
            ])
          ),
        ]),
      ]),
      
      // Content slides up
      Animated.spring(contentSlide, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      
      Animated.spring(detailsSlide, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      
      Animated.spring(buttonsSlide, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDashboard = () => {
    navigation.navigate("MainTabs", { screen: "Home" });
  };

  const handleViewTransaction = () => {
    setShowDetails(!showDetails);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Loan Approved!\n\nAmount: KES ${amount.toLocaleString()}\nTotal Repayment: KES ${repaymentAmount.toFixed(2)}\nDue Date: ${dueDate.toLocaleDateString()}\nTransaction ID: ${transactionId}\n\nvia REF-M-LINK Vault`,
        title: 'Loan Confirmation',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const rippleScale1 = ripple1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 2.5],
  });
  
  const rippleOpacity1 = ripple1.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.4, 0.2, 0],
  });

  const rippleScale2 = ripple2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 2],
  });
  
  const rippleOpacity2 = ripple2.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.3, 0.15, 0],
  });

  const rippleScale3 = ripple3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1.5],
  });
  
  const rippleOpacity3 = ripple3.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.2, 0.1, 0],
  });

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
        <View style={styles.content}>
          {/* Success Icon with Animation */}
          <Animated.View style={[
            styles.iconContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: checkmarkScale }]
            }
          ]}>
            <View style={styles.iconWrapper}>
              <IconCheckCircle size={100} strokeWidth={1.5} />
              
              {/* Ripple effects */}
              <Animated.View style={[
                styles.ripple,
                {
                  transform: [{ scale: rippleScale1 }],
                  opacity: rippleOpacity1,
                }
              ]} />
              <Animated.View style={[
                styles.ripple,
                {
                  transform: [{ scale: rippleScale2 }],
                  opacity: rippleOpacity2,
                }
              ]} />
              <Animated.View style={[
                styles.ripple,
                {
                  transform: [{ scale: rippleScale3 }],
                  opacity: rippleOpacity3,
                }
              ]} />
            </View>
          </Animated.View>

          {/* Success Text */}
          <Animated.View style={[
            styles.textContainer,
            {
              opacity: opacityAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: contentSlide }
              ]
            }
          ]}>
            <Text style={styles.successTitle}>Loan Approved!</Text>
            <Text style={styles.successSubtitle}>
              KES {amount.toLocaleString()} released to your wallet
            </Text>
            
            <View style={styles.amountBadge}>
              <IconDollarSign size={16} />
              <Text style={styles.amountBadgeText}>
                Available in your balance
              </Text>
            </View>
          </Animated.View>

          {/* Repayment Details */}
          <Animated.View style={[
            styles.repaymentCard,
            {
              opacity: opacityAnim,
              transform: [{ translateY: detailsSlide }]
            }
          ]}>
            <ExpoLinearGradient
              colors={[CARD_BG, '#1E2A4A']}
              style={styles.repaymentGradient}
            >
              <Text style={styles.repaymentTitle}>REPAYMENT DETAILS</Text>

              <View style={styles.repaymentRow}>
                <Text style={styles.repaymentLabel}>Total to Repay</Text>
                <Text style={styles.repaymentAmount}>
                  KES {repaymentAmount.toFixed(2)}
                </Text>
              </View>

              <View style={styles.repaymentDivider} />

              <View style={styles.repaymentRow}>
                <View style={styles.dueDateRow}>
                  <IconCalendar size={16} />
                  <Text style={styles.repaymentLabel}>Due Date</Text>
                </View>
                <Text style={styles.dueDateValue}>
                  {dueDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>

              <View style={styles.repaymentRow}>
                <Text style={styles.repaymentLabel}>Interest Rate</Text>
                <Text style={styles.repaymentValue}>5%</Text>
              </View>

              {/* Expanded Details Toggle */}
              <Pressable
                onPress={handleViewTransaction}
                style={styles.detailsToggle}
              >
                <IconReceipt size={14} />
                <Text style={styles.detailsToggleText}>
                  {showDetails ? "Hide Details" : "View Details"}
                </Text>
              </Pressable>

              {showDetails && (
                <View style={styles.expandedDetails}>
                  <View style={styles.expandedDivider} />
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Transaction ID</Text>
                    <Text style={styles.detailValue}>{transactionId}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Released</Text>
                    <Text style={styles.detailValue}>{releaseDate}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Principal</Text>
                    <Text style={styles.detailValue}>
                      KES {amount.toLocaleString()}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Interest</Text>
                    <Text style={styles.detailValue}>
                      KES {(repaymentAmount - amount).toFixed(2)}
                    </Text>
                  </View>

                  {/* Share Button */}
                  <Pressable
                    onPress={handleShare}
                    style={styles.shareButton}
                  >
                    <IconShare size={14} />
                    <Text style={styles.shareText}>Share Receipt</Text>
                  </Pressable>
                </View>
              )}
            </ExpoLinearGradient>
          </Animated.View>

          {/* Blockchain Info */}
          <Animated.View style={[
            styles.blockchainCard,
            {
              opacity: opacityAnim,
              transform: [{ translateY: detailsSlide }]
            }
          ]}>
            <ExpoLinearGradient
              colors={[CARD_BG, '#1E2A4A']}
              style={styles.blockchainGradient}
            >
              <IconShield size={16} />
              <Text style={styles.blockchainText}>
                Loan recorded on Stellar blockchain via Soroban Smart Contract. Repayments are automated and trust-based.
              </Text>
            </ExpoLinearGradient>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View style={[
            styles.actionsContainer,
            {
              opacity: opacityAnim,
              transform: [{ translateY: buttonsSlide }]
            }
          ]}>
            <Pressable
              onPress={handleDashboard}
              style={({ pressed }) => [
                styles.dashboardButton,
                pressed && styles.dashboardButtonPressed,
              ]}
            >
              <ExpoLinearGradient
                colors={[ORANGE, ORANGE_DARK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.dashboardGradient}
              >
                <Text style={styles.dashboardButtonText}>Go to Dashboard</Text>
                <IconArrowRight size={18} />
              </ExpoLinearGradient>
            </Pressable>

            <Pressable
              onPress={handleViewTransaction}
              style={({ pressed }) => [
                styles.transactionButton,
                pressed && styles.transactionButtonPressed,
              ]}
            >
              <IconReceipt size={16} />
              <Text style={styles.transactionButtonText}>
                {showDetails ? "Hide Details" : "View Transaction"}
              </Text>
            </Pressable>
          </Animated.View>
        </View>
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
    width: 300,
    height: 300,
    top: -100,
    right: -100,
    opacity: 0.04,
  },
  bgCircle2: {
    width: 200,
    height: 200,
    bottom: 100,
    left: -80,
    opacity: 0.03,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  // Icon
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 10,
    height: 10,
  },
  ripple: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: ORANGE,
  },
  // Text
  textContainer: {
    alignItems: 'center',
    gap: 8,
  },
  successTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 1,
  },
  successSubtitle: {
    color: ORANGE,
    fontSize: 15,
    fontWeight: "600",
    textAlign: 'center',
  },
  amountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ORANGE + '10',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 4,
  },
  amountBadgeText: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: "600",
  },
  // Repayment Card
  repaymentCard: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ORANGE + '30',
  },
  repaymentGradient: {
    padding: 20,
    gap: 12,
  },
  repaymentTitle: {
    color: '#666',
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 4,
  },
  repaymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  repaymentLabel: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
  },
  repaymentAmount: {
    color: ORANGE,
    fontSize: 16,
    fontWeight: "800",
  },
  repaymentValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: "600",
  },
  repaymentDivider: {
    height: 1,
    backgroundColor: '#2A2A3E',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dueDateValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: "600",
  },
  // Details Toggle
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  detailsToggleText: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: "600",
  },
  expandedDetails: {
    gap: 8,
  },
  expandedDivider: {
    height: 1,
    backgroundColor: '#2A2A3E',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: '#999',
    fontSize: 12,
    fontWeight: "500",
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: "600",
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    marginTop: 4,
    borderRadius: 10,
    backgroundColor: ORANGE + '10',
    borderWidth: 1,
    borderColor: ORANGE + '20',
  },
  shareText: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: "600",
  },
  // Blockchain Card
  blockchainCard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  blockchainGradient: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    alignItems: 'flex-start',
  },
  blockchainText: {
    color: '#999',
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
    lineHeight: 18,
  },
  // Actions
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  dashboardButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  dashboardButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  dashboardGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dashboardButtonText: {
    color: '#FFFFFF',
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  transactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ORANGE + '30',
  },
  transactionButtonPressed: {
    backgroundColor: ORANGE + '05',
  },
  transactionButtonText: {
    color: ORANGE,
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 1,
  },
});