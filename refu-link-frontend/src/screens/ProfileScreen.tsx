import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Rect, Line, Polygon, Polyline } from "react-native-svg";

const { width } = Dimensions.get('window');
const ORANGE = "#FF5722";
const ORANGE_LIGHT = "#FF8A65";
const ORANGE_DARK = "#E64A19";
const DARK_BG = "#1A1A2E";
const CARD_BG = "#16213E";
const GREEN = "#4CAF50";

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function IconHome({ color = "#666", size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Polyline points="9 22 9 12 15 12 15 22" />
    </Svg>
  );
}

function IconScan({ color = "#666", size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <Path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <Path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <Path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <Line x1="3" y1="12" x2="21" y2="12" />
    </Svg>
  );
}

function IconHistory({ color = "#666", size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 3v5h5" />
      <Path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
      <Path d="M12 7v5l4 2" />
    </Svg>
  );
}

function IconUser({ color = "#666", size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
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

function IconChevronRight({ color = "#666", size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 18l6-6-6-6" />
    </Svg>
  );
}

function IconUserCircle({ color = ORANGE, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

function IconShield({ color = ORANGE, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );
}

function IconGlobe({ color = ORANGE, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Line x1="2" y1="12" x2="22" y2="12" />
      <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Svg>
  );
}

function IconHelpCircle({ color = ORANGE, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <Line x1="12" y1="17" x2="12.01" y2="17" />
    </Svg>
  );
}

function IconLogOut({ color = "#999", size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <Polyline points="16 17 21 12 16 7" />
      <Line x1="21" y1="12" x2="9" y2="12" />
    </Svg>
  );
}

function IconAvatar({ size = 80 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="12" fill={ORANGE} />
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="12" cy="8" r="3" stroke="#000" strokeWidth="1.5" />
    </Svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "home" | "scan" | "history" | "profile";

type ProfileAction = {
  id: string;
  label: string;
  icon: React.FC<{ color?: string; size?: number }>;
  route: string;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigation = useNavigation<any>();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const modalScale = useRef(new Animated.Value(0.8)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
    ]).start();
  }, []);

  useEffect(() => {
    if (showLogoutModal) {
      Animated.parallel([
        Animated.spring(modalScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      modalScale.setValue(0.8);
      modalOpacity.setValue(0);
    }
  }, [showLogoutModal]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    // Clear any stored session data here
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const profileActions: ProfileAction[] = [
    {
      id: "edit",
      label: "EDIT PROFILE",
      icon: IconUserCircle,
      route: "EditProfile",
    },
    {
      id: "security",
      label: "SECURITY SETTINGS",
      icon: IconShield,
      route: "Security",
    },
    {
      id: "language",
      label: "LANGUAGE",
      icon: IconGlobe,
      route: "Language",
    },
    {
      id: "help",
      label: "HELP & SUPPORT",
      icon: IconHelpCircle,
      route: "Help",
    },
  ];

  const navTabs: { key: Tab; Icon: React.FC<{ color?: string; size?: number }>; route?: string }[] = [
    { key: "home", Icon: IconHome, route: "Dashboard" },
    { key: "scan", Icon: IconScan, route: "Scan" },
    { key: "history", Icon: IconHistory, route: "History" },
    { key: "profile", Icon: IconUser },
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
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable 
            style={({ pressed }) => [
              styles.settingsButton,
              pressed && styles.settingsButtonPressed
            ]}
          >
            <IconShield color={ORANGE} size={20} />
          </Pressable>
        </Animated.View>

        {/* Main Content */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* User Card */}
          <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}>
            <View style={styles.userCard}>
              <ExpoLinearGradient
                colors={[CARD_BG, '#1E2A4A']}
                style={styles.userCardGradient}
              >
                <View style={styles.userCardContent}>
                  {/* Avatar */}
                  <View style={styles.avatarContainer}>
                    <View style={styles.avatarGlow}>
                      <IconAvatar size={80} />
                    </View>
                    <View style={styles.onlineDot} />
                  </View>

                  {/* Name */}
                  <Text style={styles.userName}>Amina Hassan</Text>

                  {/* RIN */}
                  <View style={styles.rinContainer}>
                    <Text style={styles.rinLabel}>RIN</Text>
                    <Text style={styles.rinNumber}>1234 5678 9012</Text>
                  </View>

                  {/* Status */}
                  <View style={styles.statusBadge}>
                    <IconCheckCircle color={GREEN} size={16} />
                    <Text style={styles.statusText}>Verified</Text>
                  </View>

                  {/* Stats */}
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statNumber}>12</Text>
                      <Text style={styles.statLabel}>Transactions</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statNumber}>4</Text>
                      <Text style={styles.statLabel}>Vouches</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statNumber}>B+</Text>
                      <Text style={styles.statLabel}>Score</Text>
                    </View>
                  </View>
                </View>
              </ExpoLinearGradient>
            </View>
          </Animated.View>

          {/* Profile Actions */}
          <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}>
            <Text style={styles.sectionTitle}>SETTINGS</Text>
            <View style={styles.actionsList}>
              {profileActions.map((action, index) => (
                <Pressable
                  key={action.id}
                  onPress={() => navigation.navigate(action.route)}
                  style={({ pressed }) => [
                    styles.actionItem,
                    index === 0 && styles.actionItemFirst,
                    index === profileActions.length - 1 && styles.actionItemLast,
                    pressed && styles.actionItemPressed,
                  ]}
                >
                  <View style={styles.actionLeft}>
                    <View style={styles.actionIcon}>
                      <action.icon color={ORANGE} size={20} />
                    </View>
                    <Text style={styles.actionLabel}>{action.label}</Text>
                  </View>
                  <View style={styles.actionRight}>
                    {action.id === "language" && (
                      <View style={styles.languageBadge}>
                        <Text style={styles.languageText}>EN</Text>
                      </View>
                    )}
                    <IconChevronRight size={18} />
                  </View>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* Logout Button */}
          <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}>
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                styles.logoutButton,
                pressed && styles.logoutButtonPressed,
              ]}
            >
              <IconLogOut color="#999" size={18} />
              <Text style={styles.logoutText}>LOG OUT</Text>
            </Pressable>
          </Animated.View>

          {/* App Version */}
          <Text style={styles.versionText}>REF-M-LINK v1.0.0</Text>
        </ScrollView>

        {/* Bottom Navigation */}
        <Animated.View style={[
          styles.bottomNav,
          { opacity: fadeAnim }
        ]}>
          <ExpoLinearGradient
            colors={[DARK_BG + 'F0', CARD_BG + 'F0']}
            style={styles.bottomNavGradient}
          >
            {navTabs.map(({ key, Icon, route }) => (
              <Pressable
                key={key}
                onPress={() => {
                  setActiveTab(key);
                  if (route) navigation.navigate(route);
                }}
                style={styles.navItem}
              >
                <View style={[
                  styles.navIconContainer,
                  activeTab === key && styles.navIconActive
                ]}>
                  <Icon 
                    color={activeTab === key ? ORANGE : '#666'} 
                    size={22} 
                  />
                </View>
                {activeTab === key && <View style={styles.navIndicator} />}
              </Pressable>
            ))}
          </ExpoLinearGradient>
        </Animated.View>
      </SafeAreaView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <Animated.View style={[
          styles.modalOverlay,
          { opacity: modalOpacity }
        ]}>
          <Animated.View style={[
            styles.modalContent,
            { transform: [{ scale: modalScale }] }
          ]}>
            <ExpoLinearGradient
              colors={[CARD_BG, '#1E2A4A']}
              style={styles.modalGradient}
            >
              {/* Warning Icon */}
              <View style={styles.modalIcon}>
                <Text style={styles.modalIconText}>!</Text>
              </View>

              <Text style={styles.modalTitle}>Log Out?</Text>
              <Text style={styles.modalDescription}>
                You will need your PIN or biometrics to log back in.
              </Text>

              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => setShowLogoutModal(false)}
                  style={({ pressed }) => [
                    styles.modalButton,
                    styles.modalCancelButton,
                    pressed && styles.modalCancelButtonPressed,
                  ]}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </Pressable>

                <Pressable
                  onPress={confirmLogout}
                  style={({ pressed }) => [
                    styles.modalButton,
                    styles.modalConfirmButton,
                    pressed && styles.modalConfirmButtonPressed,
                  ]}
                >
                  <ExpoLinearGradient
                    colors={[ORANGE, ORANGE_DARK]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.modalConfirmGradient}
                  >
                    <Text style={styles.modalConfirmText}>Log Out</Text>
                  </ExpoLinearGradient>
                </Pressable>
              </View>
            </ExpoLinearGradient>
          </Animated.View>
        </Animated.View>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 1,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  settingsButtonPressed: {
    backgroundColor: '#2A2A3E',
  },
  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
    gap: 24,
  },
  // User Card
  userCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ORANGE + '30',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  userCardGradient: {
    padding: 24,
  },
  userCardContent: {
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarGlow: {
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: GREEN,
    borderWidth: 2,
    borderColor: CARD_BG,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  rinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2A2A3E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  rinLabel: {
    color: '#666',
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  rinNumber: {
    color: '#999',
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: GREEN + '15',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#2A2A3E',
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 18,
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
    height: 30,
    backgroundColor: '#3A3A4E',
  },
  // Section Title
  sectionTitle: {
    color: '#666',
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  // Actions List
  actionsList: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    overflow: 'hidden',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
  },
  actionItemFirst: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  actionItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  actionItemPressed: {
    backgroundColor: '#2A2A3E',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: ORANGE + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  actionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageBadge: {
    backgroundColor: ORANGE + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  languageText: {
    color: ORANGE,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  logoutButtonPressed: {
    backgroundColor: '#2A2A3E',
    borderColor: '#666',
  },
  logoutText: {
    color: '#999',
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
  // Version
  versionText: {
    color: '#444',
    fontSize: 11,
    fontWeight: "600",
    textAlign: 'center',
    letterSpacing: 1,
  },
  // Bottom Nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  bottomNavGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#2A2A3E',
    paddingBottom: 20,
  },
  navItem: {
    alignItems: 'center',
    gap: 6,
  },
  navIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconActive: {
    backgroundColor: ORANGE + '15',
  },
  navIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ORANGE,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ORANGE + '30',
  },
  modalGradient: {
    padding: 32,
    alignItems: 'center',
    gap: 20,
  },
  modalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ORANGE + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalIconText: {
    color: ORANGE,
    fontSize: 28,
    fontWeight: "800",
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  modalDescription: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 4,
  },
  modalButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalCancelButton: {
    backgroundColor: '#2A2A3E',
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A4E',
  },
  modalCancelButtonPressed: {
    backgroundColor: '#3A3A4E',
  },
  modalCancelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  modalConfirmButton: {
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalConfirmButtonPressed: {
    opacity: 0.9,
  },
  modalConfirmGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});