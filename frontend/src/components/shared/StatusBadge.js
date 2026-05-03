import React from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";

const STATUS_CONFIG = {
  UNVERIFIED: {
    label: "Unverified",
    bg:     "#1A1A1A",
    border: "#333",
    text:   "#A1A1AA",
    dot:    "#52525B",
  },
  PENDING: {
    label: "Pending",
    bg:     "#1A0A00",
    border: "#FF6600",
    text:   "#FF6600",
    dot:    "#FF6600",
  },
  VOUCHED: {
    label: "Vouched",
    bg:     "#052E16",
    border: "#22C55E",
    text:   "#22C55E",
    dot:    "#22C55E",
  },
};

StatusBadge.propTypes = {
  status: PropTypes.string,
};

export default function StatusBadge({ status = "UNVERIFIED" }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.UNVERIFIED;

  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 999,
      borderWidth: 1,
      backgroundColor: config.bg,
      borderColor: config.border,
    }}>
      <View style={{
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: config.dot,
        marginRight: 8,
      }} />
      <Text style={{ color: config.text, fontWeight: "600", fontSize: 13, letterSpacing: 0.3 }}>
        {config.label}
      </Text>
    </View>
  );
}