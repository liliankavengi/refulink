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

function IconSmartphone({ color = ORANGE, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <Line x1="12" y1="18" x2="12.01" y2="18" />
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

function IconShield({ color = "#666", size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );
}

function IconVault({ color = ORANGE, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="2" y="4" width="20" height="16" rx="2" />
      <Circle cx="12" cy="12" r="3" />
      <Path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
    </Svg>
  );
}

function IconShare({ color = ORANGE, size = 16 }) {
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

function IconDollarSign({ color = ORANGE, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="12" y1="1" x2="12" y2="23" />
      <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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

function IconTrendingDown({ color = ORANGE, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <Polyline points="17 18 23 18 23 12" />
    </Svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type RouteParams = {
  VaultWithdrawSuccess: {
    amount: string;
  };
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function VaultWithdrawSuccessScreen() {
  const [showDetails, setShowDetails] = useState(false);
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, "VaultWithdrawSuccess">>();
  const { amount } = route.params || { amount: "0" };

  const withdrawAmount = parseFloat(amount || "0");
  const kesAmount = (withdrawAmount * 128).toFixed(2);
  const transactionId = `VW-${Date.now().toString(36).toUpperCase()}`;
  const timestamp = new Date().toLocaleString('en-US', {
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
  const phonePulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      
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

    // Phone pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(phonePulse, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(phonePulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleViewVault = () => {
    navigation.navigate("Vault");
  };

  const handleDashboard = () => {
    navigation.navigate("MainTabs", { screen: "Home" });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Withdrawal Successful!\n\nAmount: ${withdrawAmount} USDC\nKES Received: ${kesAmount}\nTransaction ID: ${transactionId}\nDate: ${timestamp}\n\nvia REF-M-LINK Vault`,
        title: 'Withdrawal Confirmation',
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
      
      <ExpoLinearGradient
        colors={[DARK_BG, '#16213E', '#0F3460']}
        style={styles.background}
      />
      
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
            <Text style={styles.successTitle}>Withdrawal Successful!</Text>
            <Text style={styles.successSubtitle}>
              {withdrawAmount} USDC withdrawn from vault
            </Text>
            
            <View style={styles.mpesaBadge}>
              <Animated.View style={{ transform: [{ scale: phonePulse }] }}>
                <IconSmartphone size={16} />
              </Animated.View>
              <Text style={styles.mpesaText}>
                KES {Number(kesAmount).toLocaleString()} sent to M-Pesa
              </Text>
            </View>
          </Animated.View>

          {/* Transaction Details */}
          <Animated.View style={[
            styles.detailsCard,
            {
              opacity: opacityAnim,
              transform: [{ translateY: detailsSlide }]
            }
          ]}>
            <ExpoLinearGradient
              colors={[CARD_BG, '#1E2A4A']}
              style={styles.detailsGradient}
            >
              <Text style={styles.detailsTitle}>TRANSACTION DETAILS</Text>

              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <IconTrendingDown size={14} />
                  <Text style={styles.detailLabel}>Amount Withdrawn</Text>
                </View>
                <Text style={styles.detailValue}>
                  {withdrawAmount} USDC
                </Text>
              </View>

              <View style={styles.detailDivider} />

              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <IconDollarSign size={14} />
                  <Text style={styles.detailLabel}>KES Received</Text>
                </View>
                <Text style={styles.detailValueHighlight}>
                  KES {Number(kesAmount).toLocaleString()}
                </Text>
              </View>

              <View style={styles.detailDivider} />

              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <IconCalendar size={14} />
                  <Text style={styles.detailLabel}>Date</Text>
                </View>
                <Text style={styles.detailValue}>{timestamp}</Text>
              </View>

              {/* Toggle More Details */}
              <Pressable
                onPress={() => setShowDetails(!showDetails)}
                style={styles.toggleButton}
              >
                <Text style={styles.toggleText}>
                  {showDetails ? "Hide Details" : "View More Details"}
                </Text>
              </Pressable>

              {showDetails && (
                <View style={styles.expandedDetails}>
                  <View style={styles.expandedDivider} />
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Transaction ID</Text>
                    <Text style={styles.detailValueSmall}>{transactionId}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Conversion Rate</Text>
                    <Text style={styles.detailValue}>1 USDC ≈ 128 KES</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Network Fee</Text>
                    <Text style={styles.detailValue}>0.001 XLM</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Destination</Text>
                    <Text style={styles.detailValue}>Wallet</Text>
                  </View>

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

          {/* Info Card */}
          <Animated.View style={[
            styles.infoCard,
            {
              opacity: opacityAnim,
              transform: [{ translateY: detailsSlide }]
            }
          ]}>
            <ExpoLinearGradient
              colors={[CARD_BG, '#1E2A4A']}
              style={styles.infoGradient}
            >
              <IconSmartphone size={16} />
              <Text style={styles.infoText}>
                Your funds have been converted from USDC to KES and sent to your Wallet account. Check your phone for the Wallet confirmation message.
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
              onPress={handleViewVault}
              style={({ pressed }) => [
                styles.vaultButton,
                pressed && styles.vaultButtonPressed,
              ]}
            >
              <ExpoLinearGradient
                colors={[ORANGE, ORANGE_DARK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.vaultGradient}
              >
                <IconVault color="#FFFFFF" size={18} />
                <Text style={styles.vaultButtonText}>View Vault</Text>
                <IconArrowRight size={18} />
              </ExpoLinearGradient>
            </Pressable>

            <Pressable
              onPress={handleDashboard}
              style={({ pressed }) => [
                styles.dashboardButton,
                pressed && styles.dashboardButtonPressed,
              ]}
            >
              <Text style={styles.dashboardButtonText}>
                Back to Dashboard
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
    gap: 12,
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
    gap: 10,
  },
  successTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 1,
  },
  successSubtitle: {
    color: '#999',
    fontSize: 15,
    fontWeight: "500",
    textAlign: 'center',
  },
  mpesaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ORANGE + '15',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  mpesaText: {
    color: ORANGE,
    fontSize: 14,
    fontWeight: "700",
  },
  // Details Card
  detailsCard: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  detailsGradient: {
    padding: 20,
    gap: 12,
  },
  detailsTitle: {
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
  detailValueHighlight: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: "700",
  },
  detailValueSmall: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: "500",
    fontFamily: 'monospace',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#2A2A3E',
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleText: {
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
  // Info Card
  infoCard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  infoGradient: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    alignItems: 'flex-start',
  },
  infoText: {
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
  vaultButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  vaultButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  vaultGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  vaultButtonText: {
    color: '#FFFFFF',
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  dashboardButton: {
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ORANGE + '30',
    alignItems: 'center',
  },
  dashboardButtonPressed: {
    backgroundColor: ORANGE + '05',
  },
  dashboardButtonText: {
    color: ORANGE,
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 1,
  },
});