import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Circle, Line, Polyline, Rect } from "react-native-svg";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import DashboardScreen from "../screens/DashboardScreen";
import ScanScreen from "../screens/ScanScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";

// ── Responsive Helpers ────────────────────────────────────────────────────────

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Breakpoints
const isSmallPhone  = SCREEN_HEIGHT < 667;  // e.g. iPhone SE, small Androids
const isMediumPhone = SCREEN_HEIGHT < 736;  // e.g. iPhone 8, mid Androids
// large+ = everything above (iPhone X series, modern flagships)

/** Scale a size relative to a 390px (iPhone 14) baseline */
function rs(size: number): number {
  return Math.round((SCREEN_WIDTH / 390) * size);
}

// Dynamic sizing constants
const TAB_BASE_HEIGHT   = isSmallPhone ? 56 : isMediumPhone ? 62 : 70;
const ICON_SIZE         = isSmallPhone ? rs(20) : rs(24);
const LABEL_FONT_SIZE   = isSmallPhone ? rs(9)  : rs(10);
const SCAN_BTN_SIZE     = isSmallPhone ? rs(48) : rs(56);
const SCAN_BTN_RADIUS   = SCAN_BTN_SIZE / 2;
const SCAN_ICON_SIZE    = isSmallPhone ? rs(24) : rs(28);
const SCAN_MARGIN_TOP   = isSmallPhone ? -rs(14) : -rs(20);

// Colors
const DARK_BG    = "#1A1A2E";
const CARD_BG    = "#16213E";
const ORANGE     = "#FF5722";
const ORANGE_DARK = "#E64A19";

// ── Tab Icons ─────────────────────────────────────────────────────────────────

function IconHome({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Polyline points="9 22 9 12 15 12 15 22" />
      {focused && (
        <Path d="M9 22V12h6v10" fill={color} opacity="0.2" />
      )}
    </Svg>
  );
}

function IconScan({ color, focused }: { color: string; focused: boolean }) {
  return (
    <View style={focused ? [styles.scanIconWrapper, {
      width: SCAN_BTN_SIZE,
      height: SCAN_BTN_SIZE,
      borderRadius: SCAN_BTN_RADIUS,
      marginTop: SCAN_MARGIN_TOP,
    }] : undefined}>
      {focused && (
        <View style={[styles.scanIconBackground, {
          width: SCAN_BTN_SIZE,
          height: SCAN_BTN_SIZE,
          borderRadius: SCAN_BTN_RADIUS,
        }]}>
          <ExpoLinearGradient
            colors={[ORANGE, ORANGE_DARK]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.scanIconGradient}
          />
        </View>
      )}
      <Svg
        width={focused ? SCAN_ICON_SIZE : ICON_SIZE}
        height={focused ? SCAN_ICON_SIZE : ICON_SIZE}
        viewBox="0 0 24 24"
        fill="none"
        stroke={focused ? "#FFFFFF" : color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M3 7V5a2 2 0 0 1 2-2h2" />
        <Path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <Path d="M21 17v2a2 2 0 0 1-2 2h-2" />
        <Path d="M7 21H5a2 2 0 0 1-2-2v-2" />
        <Line x1="7" y1="12" x2="17" y2="12" />
      </Svg>
    </View>
  );
}

function IconHistory({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M3 3v5h5" />
      <Path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
      <Path d="M12 7v5l4 2" />
      {focused && (
        <Circle cx="12" cy="12" r="10" fill={color} opacity="0.1" />
      )}
    </Svg>
  );
}

function IconProfile({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
      {focused && (
        <Circle cx="12" cy="7" r="4" fill={color} opacity="0.15" />
      )}
    </Svg>
  );
}

// ── Tab Bar Background ────────────────────────────────────────────────────────

function TabBarBackground() {
  return (
    <View style={styles.tabBarBackground}>
      <ExpoLinearGradient
        colors={[DARK_BG + "F5", CARD_BG + "F5"]}
        style={styles.tabBarGradient}
      />
    </View>
  );
}

// ── Tab Label ─────────────────────────────────────────────────────────────────

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View style={styles.tabLabelContainer}>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
      {focused && <View style={styles.tabIndicator} />}
    </View>
  );
}

// ── Tab Navigator ─────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  // Total tab bar height = base + device safe area bottom (home indicator / nav bar)
  const tabBarHeight = TAB_BASE_HEIGHT + insets.bottom;

  // Vertical padding tweaks per platform
  const paddingTop    = isSmallPhone ? 6 : 8;
  const paddingBottom = insets.bottom > 0 ? insets.bottom : (Platform.OS === "android" ? 6 : 8);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: tabBarHeight,
          backgroundColor: "transparent",
          borderTopWidth: 1,
          borderTopColor: "#2A2A3E",
          elevation: 0,
          paddingTop,
          paddingBottom,
        },
        tabBarBackground: () => <TabBarBackground />,
        tabBarActiveTintColor: ORANGE,
        tabBarInactiveTintColor: "#666",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: LABEL_FONT_SIZE,
          fontWeight: "700",
          letterSpacing: 1,
          marginTop: 4,
          marginBottom: isSmallPhone ? 4 : 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconHome color={color} focused={focused} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Home" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconScan color={color} focused={focused} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Scan" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconHistory color={color} focused={focused} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="History" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconProfile color={color} focused={focused} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  tabBarGradient: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#2A2A3E",
  },
  scanIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    // width / height / borderRadius / marginTop are set inline (dynamic)
  },
  scanIconBackground: {
    position: "absolute",
    overflow: "hidden",
    // width / height / borderRadius set inline (dynamic)
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  scanIconGradient: {
    flex: 1,
  },
  tabLabelContainer: {
    alignItems: "center",
    gap: 4,
  },
  tabLabel: {
    fontSize: LABEL_FONT_SIZE,
    fontWeight: "600",
    color: "#666",
    letterSpacing: 1,
  },
  tabLabelActive: {
    color: ORANGE,
    fontWeight: "800",
  },
  tabIndicator: {
    width: rs(4),
    height: rs(4),
    borderRadius: rs(2),
    backgroundColor: ORANGE,
  },
});