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
import Svg, { Path, Circle, Line, Polyline } from "react-native-svg";

const { width, height } = Dimensions.get('window');
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

function IconShare({ color = ORANGE, size = 20 }) {
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

function IconDownload({ color = "#FFFFFF", size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <Polyline points="7 10 12 15 17 10" />
      <Line x1="12" y1="15" x2="12" y2="3" />
    </Svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type RouteParams = {
  SendSuccess: {
    amount: string;
    recipientName: string;
    transactionId?: string;
  };
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function SendSuccessScreen() {
  const [showDetails, setShowDetails] = useState(false);
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, "SendSuccess">>();
  
  const { amount, recipientName, transactionId } = route.params || {};

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const rippleAnim1 = useRef(new Animated.Value(0)).current;
  const rippleAnim2 = useRef(new Animated.Value(0)).current;
  const rippleAnim3 = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const detailsSlide = useRef(new Animated.Value(20)).current;
  const buttonSlide = useRef(new Animated.Value(40)).current;

  // Generate a mock transaction ID
  const txId = transactionId || `TX-${Date.now().toString(36).toUpperCase()}`;
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  useEffect(() => {
    // Run ripples independently - don't put in sequence
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rippleAnim1, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(rippleAnim1, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      ).start();

      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(rippleAnim2, { toValue: 1, duration: 1500, useNativeDriver: true }),
            Animated.timing(rippleAnim2, { toValue: 0, duration: 0, useNativeDriver: true }),
          ])
        ).start();
      }, 500);

      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(rippleAnim3, { toValue: 1, duration: 1500, useNativeDriver: true }),
            Animated.timing(rippleAnim3, { toValue: 0, duration: 0, useNativeDriver: true }),
          ])
        ).start();
      }, 1000);
    }, 800);

    // Main sequence without ripples
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(checkmarkScale, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.spring(contentSlide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
      Animated.spring(detailsSlide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
      Animated.spring(buttonSlide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleDone = () => {
    navigation.navigate("MainTabs", { screen: "Home" });
  };

  const handleViewReceipt = () => {
    setShowDetails(!showDetails);
  };

  const handleShareReceipt = async () => {
    try {
      await Share.share({
        message: `Transaction Receipt\n\nAmount: KES ${parseFloat(amount || "0").toLocaleString()}\nTo: ${recipientName}\nTransaction ID: ${txId}\nDate: ${timestamp}\n\nSent via REF-M-LINK Wallet`,
        title: 'Transaction Receipt',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const rippleScale1 = rippleAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 2.5],
  });
  
  const rippleOpacity1 = rippleAnim1.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.4, 0.2, 0],
  });

  const rippleScale2 = rippleAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 2],
  });
  
  const rippleOpacity2 = rippleAnim2.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.3, 0.15, 0],
  });

  const rippleScale3 = rippleAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1.5],
  });
  
  const rippleOpacity3 = rippleAnim3.interpolate({
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
            <Text style={styles.successTitle}>
              Payment Sent Successfully!
            </Text>
            <Text style={styles.successSubtitle}>
              Your transaction has been completed
            </Text>
            
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>AMOUNT SENT</Text>
              <Text style={styles.amountValue}>
                KES {parseFloat(amount || "0").toLocaleString()}
              </Text>
              <Text style={styles.recipientText}>
                to {recipientName || "Amina Hassan"}
              </Text>
            </View>
          </Animated.View>

          {/* Transaction Details (Toggle) */}
          <Animated.View style={[
            styles.detailsContainer,
            {
              opacity: opacityAnim,
              transform: [{ translateY: detailsSlide }]
            }
          ]}>
            <Pressable
              onPress={handleViewReceipt}
              style={styles.detailsToggle}
            >
              <IconReceipt size={16} />
              <Text style={styles.detailsToggleText}>
                {showDetails ? "Hide Details" : "View Receipt"}
              </Text>
              <Text style={styles.detailsChevron}>
                {showDetails ? "▲" : "▼"}
              </Text>
            </Pressable>

            {showDetails && (
              <View style={styles.receiptCard}>
                <ExpoLinearGradient
                  colors={[CARD_BG, '#1E2A4A']}
                  style={styles.receiptGradient}
                >
                  <Text style={styles.receiptTitle}>TRANSACTION RECEIPT</Text>
                  
                  <View style={styles.receiptDivider} />
                  
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Transaction ID</Text>
                    <Text style={styles.receiptValue}>{txId}</Text>
                  </View>
                  
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Date & Time</Text>
                    <Text style={styles.receiptValue}>{timestamp}</Text>
                  </View>
                  
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Status</Text>
                    <View style={styles.statusBadge}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusText}>Completed</Text>
                    </View>
                  </View>
                  
                  <View style={styles.receiptDivider} />
                  
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Amount Sent</Text>
                    <Text style={styles.receiptAmount}>
                      KES {parseFloat(amount || "0").toLocaleString()}
                    </Text>
                  </View>
                  
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Fee</Text>
                    <Text style={styles.receiptValue}>KES 0.00</Text>
                  </View>
                  
                  <View style={styles.receiptDivider} />
                  
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Recipient</Text>
                    <Text style={styles.receiptValue}>{recipientName}</Text>
                  </View>
                  
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Reference</Text>
                    <Text style={styles.receiptValue}>Payment</Text>
                  </View>
                  
                  {/* Share Button */}
                  <Pressable
                    onPress={handleShareReceipt}
                    style={styles.shareButton}
                  >
                    <IconShare size={16} />
                    <Text style={styles.shareText}>Share Receipt</Text>
                  </Pressable>
                </ExpoLinearGradient>
              </View>
            )}
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View style={[
            styles.actionsContainer,
            {
              opacity: opacityAnim,
              transform: [{ translateY: buttonSlide }]
            }
          ]}>
            <Pressable
              onPress={handleDone}
              style={({ pressed }) => [
                styles.doneButton,
                pressed && styles.doneButtonPressed,
              ]}
            >
              <ExpoLinearGradient
                colors={[ORANGE, ORANGE_DARK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.doneGradient}
              >
                <Text style={styles.doneButtonText}>Done</Text>
                <IconArrowRight size={18} />
              </ExpoLinearGradient>
            </Pressable>

            <Pressable
              onPress={handleViewReceipt}
              style={({ pressed }) => [
                styles.receiptButton,
                pressed && styles.receiptButtonPressed,
              ]}
            >
              <IconDownload size={18} />
              <Text style={styles.receiptButtonText}>Download Receipt</Text>
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
    width: 120,
    height: 120,
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
    gap: 12,
  },
  successTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 1,
    textAlign: 'center',
  },
  successSubtitle: {
    color: '#999',
    fontSize: 14,
    fontWeight: "500",
    textAlign: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: CARD_BG,
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  amountLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
  },
  amountValue: {
    color: ORANGE,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 1,
  },
  recipientText: {
    color: '#999',
    fontSize: 14,
    fontWeight: "600",
  },
  // Details
  detailsContainer: {
    width: '100%',
    gap: 12,
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  detailsToggleText: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: "600",
  },
  detailsChevron: {
    color: ORANGE,
    fontSize: 10,
  },
  receiptCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  receiptGradient: {
    padding: 20,
    gap: 12,
  },
  receiptTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
    textAlign: 'center',
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#2A2A3E',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    color: '#999',
    fontSize: 13,
    fontWeight: "500",
  },
  receiptValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: "600",
  },
  receiptAmount: {
    color: ORANGE,
    fontSize: 16,
    fontWeight: "800",
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: GREEN + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GREEN,
  },
  statusText: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "700",
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 4,
    borderRadius: 12,
    backgroundColor: ORANGE + '10',
    borderWidth: 1,
    borderColor: ORANGE + '20',
  },
  shareText: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: "700",
  },
  // Actions
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  doneButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  doneButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  doneGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ORANGE + '30',
  },
  receiptButtonPressed: {
    backgroundColor: ORANGE + '05',
  },
  receiptButtonText: {
    color: ORANGE,
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 1,
  },
});