import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, View } from "react-native";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  visible: boolean;
  onHide: () => void;
}

export default function Toast({ message, type = "info", visible, onHide }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(2000),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => onHide());
    }
  }, [visible]);

  if (!visible) return null;

  const colors = {
    success: "#4CAF50",
    error: "#F44336",
    info: "#2196F3",
  };

  return (
    <Animated.View style={[styles.container, { opacity, backgroundColor: colors[type] }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    zIndex: 1000,
    elevation: 10,
  },
  text: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});