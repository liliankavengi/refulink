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
  Alert,
  Modal,
  TextInput,
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

function IconMessageCircle({ color = ORANGE, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Svg>
  );
}

function IconPhone({ color = ORANGE, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  );
}

function IconMail({ color = ORANGE, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <Polyline points="22,6 12,13 2,6" />
    </Svg>
  );
}

function IconFileText({ color = ORANGE, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <Polyline points="14 2 14 8 20 8" />
      <Line x1="16" y1="13" x2="8" y2="13" />
      <Line x1="16" y1="17" x2="8" y2="17" />
      <Polyline points="10 9 9 9 8 9" />
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

function IconSend({ color = "#FFFFFF", size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="22" y1="2" x2="11" y2="13" />
      <Polygon points="22 2 15 22 11 13 2 9 22 2" />
    </Svg>
  );
}

function IconX({ color = "#666", size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="18" y1="6" x2="6" y2="18" />
      <Line x1="6" y1="6" x2="18" y2="18" />
    </Svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type SupportOption = {
  id: string;
  label: string;
  icon: React.FC<{ color?: string; size?: number }>;
  subtitle?: string;
  action: () => void;
  badge?: string;
};

// ── FAQ Data ──────────────────────────────────────────────────────────────────

const FAQ_DATA = [
  {
    question: "How do I deposit funds?",
    answer: "You can deposit funds through M-PESA, authorized agents, or NGO/AID funding. Go to the Deposit screen from your dashboard to see available options.",
  },
  {
    question: "Is my wallet secure?",
    answer: "Yes, your wallet is protected with bank-level encryption, biometric authentication, and secure PIN verification. Your data never leaves your device unencrypted.",
  },
  {
    question: "How do I change my PIN?",
    answer: "Go to Profile > Security Settings > Change PIN. You'll need to enter your current PIN before setting a new one.",
  },
  {
    question: "What is a RIN number?",
    answer: "RIN (Refugee Identification Number) is your unique identifier used to verify your identity against the government register.",
  },
  {
    question: "How long do transactions take?",
    answer: "Most transactions are processed instantly. Bank transfers may take 1-3 business days depending on the financial institution.",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function HelpSupportScreen() {
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; sender: "user" | "support" }>>([
    { text: "Hello! How can we help you today?", sender: "support" },
  ]);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const navigation = useNavigation<any>();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const listItemAnims = useRef([...Array(4)].map(() => new Animated.Value(50))).current;

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

  const handleCall = () => {
    const phoneNumber = "+254800123456";
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert("Error", "Could not open phone app");
    });
  };

  const handleEmail = () => {
    const email = "support@refulink.org";
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert("Error", "Could not open email app");
    });
  };

  const handleChat = () => {
    setShowChatModal(true);
  };

  const handleFAQ = () => {
    // FAQ is shown inline
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;

    setChatMessages(prev => [...prev, { text: chatMessage, sender: "user" }]);
    setChatMessage("");

    // Simulate support response
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { 
          text: "Thank you for your message. A support agent will respond shortly.", 
          sender: "support" 
        },
      ]);
    }, 1000);
  };

  const supportOptions: SupportOption[] = [
    {
      id: "faq",
      label: "FAQ ARTICLES",
      icon: IconFileText,
      action: handleFAQ,
      badge: `${FAQ_DATA.length} articles`,
    },
    {
      id: "chat",
      label: "LIVE CHAT SUPPORT",
      icon: IconMessageCircle,
      action: handleChat,
      badge: "Online",
    },
    {
      id: "call",
      label: "CALL SUPPORT",
      subtitle: "+254 800 123 456",
      icon: IconPhone,
      action: handleCall,
      badge: "24/7",
    },
    {
      id: "email",
      label: "EMAIL SUPPORT",
      subtitle: "support@refulink.org",
      icon: IconMail,
      action: handleEmail,
      badge: "24h response",
    },
  ];

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
              <Text style={styles.headerTitle}>Help & Support</Text>
              <Text style={styles.headerSubtitle}>
                We're here to help you
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
            {/* Support Options */}
            <View style={styles.supportSection}>
              <Text style={styles.sectionTitle}>GET HELP</Text>
              
              <View style={styles.supportList}>
                {supportOptions.map((option, index) => (
                  <Animated.View
                    key={option.id}
                    style={{
                      transform: [{ translateY: listItemAnims[index] }],
                    }}
                  >
                    <Pressable
                      onPress={option.action}
                      style={({ pressed }) => [
                        styles.supportItem,
                        index === 0 && styles.supportItemFirst,
                        index === supportOptions.length - 1 && styles.supportItemLast,
                        pressed && styles.supportItemPressed,
                      ]}
                    >
                      <View style={styles.supportLeft}>
                        <View style={[
                          styles.supportIcon,
                          option.id === "chat" && styles.supportIconGreen,
                          option.id === "call" && styles.supportIconBlue,
                          option.id === "email" && styles.supportIconPurple,
                        ]}>
                          <option.icon 
                            color={
                              option.id === "faq" ? ORANGE :
                              option.id === "chat" ? GREEN :
                              option.id === "call" ? "#2196F3" :
                              "#9C27B0"
                            } 
                            size={20} 
                          />
                        </View>
                        <View style={styles.supportInfo}>
                          <View style={styles.supportHeader}>
                            <Text style={styles.supportLabel}>{option.label}</Text>
                            {option.badge && (
                              <View style={[
                                styles.badge,
                                option.badge === "Online" && styles.badgeOnline,
                                option.badge === "24/7" && styles.badge247,
                              ]}>
                                <View style={[
                                  styles.badgeDot,
                                  option.badge === "Online" && styles.badgeDotOnline,
                                ]} />
                                <Text style={styles.badgeText}>{option.badge}</Text>
                              </View>
                            )}
                          </View>
                          {option.subtitle && (
                            <Text style={styles.supportSubtitle}>
                              {option.subtitle}
                            </Text>
                          )}
                        </View>
                      </View>
                    </Pressable>
                  </Animated.View>
                ))}
              </View>
            </View>

            {/* FAQ Section */}
            <View style={styles.faqSection}>
              <Text style={styles.sectionTitle}>COMMON QUESTIONS</Text>
              
              <View style={styles.faqList}>
                {FAQ_DATA.map((faq, index) => (
                  <Pressable
                    key={index}
                    onPress={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    style={[
                      styles.faqItem,
                      index === 0 && styles.faqItemFirst,
                      index === FAQ_DATA.length - 1 && styles.faqItemLast,
                      expandedFAQ === index && styles.faqItemExpanded,
                    ]}
                  >
                    <View style={styles.faqHeader}>
                      <Text style={[
                        styles.faqQuestion,
                        expandedFAQ === index && styles.faqQuestionExpanded,
                      ]}>
                        {faq.question}
                      </Text>
                      <Text style={styles.faqToggle}>
                        {expandedFAQ === index ? '−' : '+'}
                      </Text>
                    </View>
                    {expandedFAQ === index && (
                      <View style={styles.faqAnswer}>
                        <View style={styles.faqAnswerLine} />
                        <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Response Time Info */}
            <View style={styles.infoCard}>
              <ExpoLinearGradient
                colors={[CARD_BG, '#1E2A4A']}
                style={styles.infoGradient}
              >
                <View style={styles.infoContent}>
                  <IconClock size={20} />
                  <View style={styles.infoText}>
                    <Text style={styles.infoTitle}>Average Response Time</Text>
                    <Text style={styles.infoValue}>Under 5 minutes</Text>
                  </View>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoContent}>
                  <IconShield size={20} />
                  <View style={styles.infoText}>
                    <Text style={styles.infoTitle}>Support Availability</Text>
                    <Text style={styles.infoValue}>24 hours, 7 days a week</Text>
                  </View>
                </View>
              </ExpoLinearGradient>
            </View>

            {/* App Version */}
            <View style={styles.versionSection}>
              <Text style={styles.versionText}>REF-M-LINK Wallet</Text>
              <Text style={styles.versionNumber}>Version 1.0.0</Text>
              <Text style={styles.versionBuild}>Build 2026.04.1</Text>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Chat Modal */}
        <Modal
          visible={showChatModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowChatModal(false)}
        >
          <View style={styles.chatModal}>
            <View style={styles.chatContainer}>
              {/* Chat Header */}
              <View style={styles.chatHeader}>
                <View style={styles.chatHeaderLeft}>
                  <View style={styles.chatAvatar}>
                    <IconMessageCircle color={ORANGE} size={20} />
                  </View>
                  <View>
                    <Text style={styles.chatTitle}>Support Chat</Text>
                    <View style={styles.chatStatus}>
                      <View style={styles.onlineDot} />
                      <Text style={styles.chatStatusText}>Online</Text>
                    </View>
                  </View>
                </View>
                <Pressable
                  onPress={() => setShowChatModal(false)}
                  style={styles.chatCloseButton}
                >
                  <IconX size={20} />
                </Pressable>
              </View>

              {/* Chat Messages */}
              <ScrollView style={styles.chatMessages}>
                {chatMessages.map((msg, index) => (
                  <View
                    key={index}
                    style={[
                      styles.messageBubble,
                      msg.sender === "user" ? styles.messageUser : styles.messageSupport,
                    ]}
                  >
                    <Text style={[
                      styles.messageText,
                      msg.sender === "user" && styles.messageTextUser,
                    ]}>
                      {msg.text}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              {/* Chat Input */}
              <View style={styles.chatInput}>
                <TextInput
                  value={chatMessage}
                  onChangeText={setChatMessage}
                  placeholder="Type your message..."
                  placeholderTextColor="#666"
                  style={styles.chatTextInput}
                  multiline
                />
                <Pressable
                  onPress={sendChatMessage}
                  style={({ pressed }) => [
                    styles.chatSendButton,
                    !chatMessage.trim() && styles.chatSendDisabled,
                    pressed && chatMessage.trim() && styles.chatSendPressed,
                  ]}
                  disabled={!chatMessage.trim()}
                >
                  <IconSend color={chatMessage.trim() ? "#FFFFFF" : "#666"} size={18} />
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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
  // Support Section
  supportSection: {
    gap: 12,
  },
  sectionTitle: {
    color: '#666',
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
    paddingHorizontal: 4,
  },
  supportList: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    overflow: 'hidden',
  },
  supportItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
  },
  supportItemFirst: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  supportItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  supportItemPressed: {
    backgroundColor: '#2A2A3E',
  },
  supportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: ORANGE + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportIconGreen: {
    backgroundColor: GREEN + '15',
  },
  supportIconBlue: {
    backgroundColor: '#2196F3' + '15',
  },
  supportIconPurple: {
    backgroundColor: '#9C27B0' + '15',
  },
  supportInfo: {
    flex: 1,
    gap: 4,
  },
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  supportLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#2A2A3E',
  },
  badgeOnline: {
    backgroundColor: GREEN + '15',
  },
  badge247: {
    backgroundColor: '#2196F3' + '15',
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#666',
  },
  badgeDotOnline: {
    backgroundColor: GREEN,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: '#999',
  },
  supportSubtitle: {
    color: ORANGE,
    fontSize: 14,
    fontWeight: "600",
  },
  // FAQ Section
  faqSection: {
    gap: 12,
  },
  faqList: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    overflow: 'hidden',
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
  },
  faqItemFirst: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  faqItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  faqItemExpanded: {
    backgroundColor: ORANGE + '05',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
    marginRight: 12,
  },
  faqQuestionExpanded: {
    color: ORANGE,
  },
  faqToggle: {
    color: ORANGE,
    fontSize: 20,
    fontWeight: "300",
    width: 24,
    textAlign: 'center',
  },
  faqAnswer: {
    marginTop: 12,
  },
  faqAnswerLine: {
    height: 1,
    backgroundColor: '#2A2A3E',
    marginBottom: 12,
  },
  faqAnswerText: {
    color: '#999',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "500",
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
    gap: 12,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    flex: 1,
    gap: 2,
  },
  infoTitle: {
    color: '#999',
    fontSize: 12,
    fontWeight: "600",
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "700",
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#2A2A3E',
  },
  // Version
  versionSection: {
    alignItems: 'center',
    gap: 4,
    paddingTop: 20,
  },
  versionText: {
    color: '#666',
    fontSize: 13,
    fontWeight: "600",
  },
  versionNumber: {
    color: '#555',
    fontSize: 11,
    fontWeight: "500",
  },
  versionBuild: {
    color: '#444',
    fontSize: 10,
    fontWeight: "500",
  },
  // Chat Modal
  chatModal: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  chatContainer: {
    flex: 1,
    marginTop: 60,
    backgroundColor: DARK_BG,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ORANGE + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "700",
  },
  chatStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GREEN,
  },
  chatStatusText: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "600",
  },
  chatCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#2A2A3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatMessages: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  messageSupport: {
    backgroundColor: CARD_BG,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageUser: {
    backgroundColor: ORANGE,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#2A2A3E',
    gap: 12,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    maxHeight: 100,
  },
  chatSendButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatSendDisabled: {
    backgroundColor: '#2A2A3E',
  },
  chatSendPressed: {
    opacity: 0.8,
  },
});