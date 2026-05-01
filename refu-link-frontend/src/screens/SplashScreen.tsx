import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, StatusBar, Dimensions, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get('window');
const ORANGE = "#FF5722";
const ORANGE_LIGHT = "#FF8A65";
const ORANGE_DARK = "#E64A19";
const DARK_BG = "#1A1A2E";
const CARD_BG = "#16213E";

type RootParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Identification: undefined;
  Login: undefined;
};

export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(30)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  // Typewriter state
  const [displayText, setDisplayText] = React.useState("");
  const [showCursor, setShowCursor] = React.useState(true);
  const FULL_NAME = "REF-M-LINK";
  
  // Pulse animation for glow
  const pulseGlow = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Continuous glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseGlow, {
          toValue: 1.5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseGlow, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Logo entrance
    Animated.sequence([
      // Initial delay
      Animated.delay(300),
      
      // Logo scales and rotates in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoRotateAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      
      // Glow effect
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      
      // Text slides up
      Animated.parallel([
        Animated.spring(textSlideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start(); 

    // Typewriter effect
    let currentIndex = 0;
    const typewriterInterval = setInterval(() => {
      if (currentIndex <= FULL_NAME.length) {
        setDisplayText(FULL_NAME.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typewriterInterval);
        // Cursor blink
        const cursorInterval = setInterval(() => {
          setShowCursor(prev => !prev);
        }, 500);
        
        setTimeout(() => {
          clearInterval(cursorInterval);
          setShowCursor(false);
        }, 2000);
      }
    }, 200);

    // Navigate after animations
    const navigationTimeout = setTimeout(async () => {
      const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");
      if (hasOnboarded) {
        navigation.replace("Login");
      } else {
        navigation.replace("Onboarding");
      }
    }, 50000);

    return () => {
      clearInterval(typewriterInterval);
      clearTimeout(navigationTimeout);
    };
  }, []);

  const logoSpin = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg'],
  });



  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DARK_BG} />
      
      {/* Background Gradient */}
      <ExpoLinearGradient
        colors={[DARK_BG, '#16213E', '#0F3460']}
        style={styles.background}
      />
      
      {/* Animated background particles */}
      <View style={styles.particles}>
        <Animated.View style={[
          styles.particle,
          styles.particle1,
          { opacity: glowAnim }
        ]} />
        <Animated.View style={[
          styles.particle,
          styles.particle2,
          { opacity: glowAnim }
        ]} />
        <Animated.View style={[
          styles.particle,
          styles.particle3,
          { opacity: glowAnim }
        ]} />
      </View>

      <View style={styles.inner}>
        {/* Logo with spinning entrance and glow */}
        <Animated.View style={[
          styles.logoContainer,
          {
            opacity: opacityAnim,
            transform: [
              { scale: scaleAnim },
              { rotate: logoSpin }
            ]
          }
        ]}>
          <Animated.View style={[
            styles.logoGlow,
            {
              transform: [{ scale: pulseGlow }],
              opacity: glowAnim,
            }
          ]}>
            <View style={styles.logoWrapper}>
              <Svg width={160} height={160} viewBox="0 0 120 120" fill="none">
                <Defs>
                  <LinearGradient id="splashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={ORANGE} stopOpacity="1" />
                    <Stop offset="50%" stopColor={ORANGE_LIGHT} stopOpacity="1" />
                    <Stop offset="100%" stopColor={ORANGE} stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                
                {/* Outer ring with gradient */}
                <Circle 
                  cx="60" 
                  cy="60" 
                  r="55" 
                  stroke="url(#splashGradient)" 
                  strokeWidth="4" 
                />
                
                {/* Inner decorative ring */}
                <Circle 
                  cx="60" 
                  cy="60" 
                  r="48" 
                  stroke={ORANGE} 
                  strokeWidth="0.5" 
                  opacity="0.4" 
                />
                
                {/* Wallet body */}
                <Path
                  d="M40 40H80C85 40 90 45 90 50V63C90 70 85 75 80 75H40C35 75 30 70 30 65V50C30 45 35 40 40 40Z"
                  stroke="url(#splashGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Wallet detail */}
                <Path
                  d="M75 55H85"
                  stroke="url(#splashGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                
                {/* Corner accents */}
                <Circle cx="40" cy="45" r="2" fill={ORANGE_LIGHT} opacity="0.8" />
                <Circle cx="80" cy="45" r="2" fill={ORANGE_LIGHT} opacity="0.8" />
                <Circle cx="80" cy="70" r="2" fill={ORANGE_LIGHT} opacity="0.8" />
              </Svg>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Main Title with Typewriter */}
        <Animated.View style={[
          styles.titleContainer,
          {
            opacity: opacityAnim,
            transform: [{ translateY: textSlideAnim }]
          }
        ]}>
          <Text style={styles.titleMain}>
            {displayText}
            {showCursor && <Text style={styles.cursor}>|</Text>}
          </Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View style={{
          opacity: subtitleOpacity,
          transform: [{ translateY: textSlideAnim }]
        }}>
          <Text style={styles.subtitle}>Your Wallet. Your Way.</Text>
          
          {/* Loading indicator */}
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBar}>
              <Animated.View style={[
                styles.loadingProgress,
                {
                  transform: [{
                    scaleX: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1]
                    })
                  }]
                }
              ]} />
            </View>
          </View>
        </Animated.View>

        {/* Bottom branding */}
        <Animated.View style={[
          styles.footer,
          { opacity: subtitleOpacity }
        ]}>
          <Text style={styles.footerText}>FINANCIAL SOLUTIONS</Text>
        </Animated.View>
      </View>
    </View>
  );
}

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
  particles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: ORANGE,
  },
  particle1: {
    width: 200,
    height: 200,
    top: '5%',
    right: -50,
    opacity: 0.08,
  },
  particle2: {
    width: 150,
    height: 150,
    bottom: '10%',
    left: -60,
    opacity: 0.06,
  },
  particle3: {
    width: 100,
    height: 100,
    top: '50%',
    right: '5%',
    opacity: 0.04,
  },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoGlow: {
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 15,
    backgroundColor: 'transparent',
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  titleContainer: {
    marginBottom: 16,
  },
  titleMain: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 8,
    textAlign: 'center',
    fontFamily: 'System',
  },
  cursor: {
    color: ORANGE,
    fontWeight: "200",
    fontSize: 32,
  },
  subtitle: {
    color: ORANGE_LIGHT,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 6,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 32,
  },
  loadingContainer: {
    width: 120,
    alignSelf: 'center',
  },
  loadingBar: {
    height: 2,
    backgroundColor: ORANGE + '30',
    borderRadius: 1,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: ORANGE,
    borderRadius: 1,
    width: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  footerText: {
    color: ORANGE + '40',
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 6,
    textAlign: 'center',
  },
});